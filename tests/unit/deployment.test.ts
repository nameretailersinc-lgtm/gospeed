import {describe,it,expect} from 'vitest';
import {mkdtempSync,writeFileSync,readFileSync,copyFileSync,chmodSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve,dirname,delimiter} from 'node:path';
import {spawnSync} from 'node:child_process';

const current='ghcr.io/nameretailersinc-lgtm/gospeed:sha-'+'a'.repeat(40);
const previous='ghcr.io/nameretailersinc-lgtm/gospeed:sha-'+'b'.repeat(40);
const bash=process.platform==='win32'?'C:/Program Files/Git/bin/bash.exe':'bash';
const dockerStub=`#!/usr/bin/env bash
printf '%s | %s\\n' "\${GOSPEED_IMAGE:-unset}" "$*" >> "$MOCK_HISTORY"
if [[ "$1" == inspect ]]; then
  [[ "$MOCK_MODE" != first && "$MOCK_MODE" != first-failure ]] || exit 1
  if [[ "$*" == *com.docker.compose.project* ]]; then
    if [[ "$MOCK_MODE" == foreign ]]; then echo another-project; else echo gospeed; fi
  elif [[ "$*" == *.Config.Image* ]]; then echo "$MOCK_PREVIOUS"; fi
elif [[ "$1" == login ]]; then
  cat >/dev/null
elif [[ "$*" == *' up '* && "$GOSPEED_IMAGE" == "$MOCK_CURRENT" && ( "$MOCK_MODE" == failure || "$MOCK_MODE" == first-failure ) ]]; then
  exit 1
fi
exit 0
`;

function run(mode:string,image=current){
 const fixture=mkdtempSync(join(tmpdir(),'gospeed-deploy-test-'));
 if(dirname(resolve(fixture))!==resolve(tmpdir()))throw new Error('Unexpected fixture path');
 try{
  copyFileSync(resolve('deploy/deploy.sh'),join(fixture,'deploy.sh'));
  copyFileSync(resolve('deploy/compose.yml'),join(fixture,'compose.yml'));
  const docker=join(fixture,'docker');writeFileSync(docker,dockerStub);chmodSync(docker,0o755);
  const flock=join(fixture,'flock');writeFileSync(flock,'#!/usr/bin/env bash\nexit 0\n');chmodSync(flock,0o755);
  const history=join(fixture,'history');
  const result=spawnSync(bash,[join(fixture,'deploy.sh').replaceAll('\\','/'),image,'3001','test-user'],{
   input:'test-registry-token\n',encoding:'utf8',timeout:30000,
   env:{...process.env,PATH:fixture+delimiter+process.env.PATH,MOCK_MODE:mode,MOCK_HISTORY:history.replaceAll('\\','/'),MOCK_PREVIOUS:previous,MOCK_CURRENT:current},
  });
  if(result.error)throw result.error;
  return {status:result.status,output:result.stdout+result.stderr,history:existsSync(history)?readFileSync(history,'utf8'):'',saved:existsSync(join(fixture,'current-image'))?readFileSync(join(fixture,'current-image'),'utf8').trim():undefined};
 }finally{
  // Only remove the temporary fixture created by this test.
  rmSync(fixture,{recursive:true,force:true});
 }
}

describe('VPS release behavior with a fake Docker CLI (no real server changes)',()=>{
 it('records a healthy first release after pulling and waiting for readiness',()=>{
  const r=run('first');expect(r.status,r.output).toBe(0);expect(r.saved).toBe(current);expect(r.history).toContain('pull web');expect(r.history).toContain('up --detach --wait --wait-timeout 120 web');expect(r.output).not.toContain('test-registry-token');
 });
 it('replaces a healthy existing release',()=>{const r=run('existing');expect(r.status,r.output).toBe(0);expect(r.saved).toBe(current);});
 it('restores the previous image and fails the release when readiness fails',()=>{
  const r=run('failure');expect(r.status,r.output).toBe(1);expect(r.history).toContain(previous+' | compose --project-name gospeed --file compose.yml up');expect(r.saved).toBeUndefined();
 });
 it('reports a failed first deployment without inventing a rollback target',()=>{
  const r=run('first-failure');expect(r.status,r.output).toBe(1);expect(r.history).not.toContain(previous+' | compose');expect(r.saved).toBeUndefined();
 });
 it('refuses to replace a container owned by another project',()=>{
  const r=run('foreign');expect(r.status,r.output).toBe(1);expect(r.output).toContain('belongs to another deployment');expect(r.history).not.toContain('pull web');expect(r.history).not.toContain('login');
 });
 it('rejects an unversioned image before invoking Docker',()=>{
  const r=run('existing','ghcr.io/nameretailersinc-lgtm/gospeed:latest');expect(r.status,r.output).toBe(1);expect(r.output).toContain('Invalid release image');expect(r.history).toBe('');
 });
});
