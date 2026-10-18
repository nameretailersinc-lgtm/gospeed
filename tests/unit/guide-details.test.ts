import {describe,it,expect} from 'vitest';
import {guides} from '@/data/guides';
import {guideDetails} from '@/data/guide-details';
import {references} from '@/data/references';
import {referenceDetails} from '@/data/reference-details';
import {guideHero} from '@/lib/guide-presentation';
import {resolveSiteImage} from '@/lib/image-assets';
import {guideWorkshops} from '@/data/guide-workshops';
import {existsSync} from 'node:fs';

describe('expanded detail content',()=>{
 it('covers the entire guide catalog without unused editorial entries',()=>{
  expect(Object.keys(guideDetails).sort()).toEqual(guides.map(g=>g.slug).sort());
  const questions=new Set<string>();
  for(const guide of guides){
   expect(guide.sections.length,guide.slug).toBeGreaterThanOrEqual(3);
   expect(new Set(guide.sections.map(s=>s.heading)).size,guide.slug).toBe(guide.sections.length);
   expect(guide.faqs.length,guide.slug).toBeGreaterThanOrEqual(3);
   for(const faq of guide.faqs){expect(faq.answer.length).toBeGreaterThan(50);questions.add(faq.question);}
   expect(existsSync('public'+guideHero(guide)),guide.slug).toBe(true);
  }
  // Questions should be written for their topic rather than copied to every page.
  expect(questions.size).toBeGreaterThan(80);
 });
 it('gives every topic a dimensioned workshop with a complete comparison table',()=>{
  expect(Object.keys(guideWorkshops).sort()).toEqual(guides.map(g=>g.slug).sort());
  for(const guide of guides){const w=guideWorkshops[guide.slug];expect(w.steps.length).toBeGreaterThanOrEqual(4);expect(w.rows.length).toBeGreaterThanOrEqual(3);for(const row of w.rows){expect(row.length,guide.slug).toBe(w.columns.length);for(const value of row)if(typeof value==='number')expect(Number.isFinite(value),guide.slug).toBe(true);}expect(guide.faqs.some(f=>f.question===w.question)).toBe(true);}
  const dirt=guideWorkshops['dirt-bike-gearing'].rows;
  expect(dirt[1]).toEqual(['14/52',3.714,6.12,-5.77]);expect(dirt[2]).toEqual(['13/49',3.769,7.69,-7.14]);
 });
 it('checks every published pitch-diameter comparison against polygon geometry',()=>{
  const table=guideDetails['sprocket-pitch-diameter'].sections.find(s=>s.table)?.table;
  expect(table).toBeDefined();
  for(const [teeth,inches,mm,advance] of table!.rows){
   const n=Number(teeth);const diameter=0.5/Math.sin(Math.PI/n);
   expect(Number(inches)).toBeCloseTo(diameter,3);
   expect(Number(mm)).toBeCloseTo(diameter*25.4,3);
   expect(Number(advance)).toBe(n*0.5);
  }
  expect(guideDetails['sprocket-pitch-diameter'].faqs.find(f=>f.question.includes('20-tooth'))?.answer).toContain((12.7/Math.sin(Math.PI/20)).toFixed(5));
 });
 it('adds interpretation and worked examples to all reference tables',()=>{
  expect(Object.keys(referenceDetails).sort()).toEqual(references.map(r=>r.slug).sort());
  for(const r of references){const detail=referenceDetails[r.slug];expect(detail.reading).toBeTruthy();expect(detail.example).toBeTruthy();expect(detail.question).toBeTruthy();expect(detail.answer).toBeTruthy();}
 });
 it('keeps the supplied guide-specific photos instead of silently remapping them',()=>{
  for(const guide of guides.filter(g=>['sprocket-pitch-diameter','torque-vs-horsepower'].includes(g.slug))){const image=guideHero(guide);expect(resolveSiteImage(image)).toBe(image);}
 });
});
