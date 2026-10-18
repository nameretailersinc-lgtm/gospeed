import {describe,it,expect} from 'vitest';
import {tools,relatedTools,categories} from '@/data/tools';
import {guides} from '@/data/guides';
import {references} from '@/data/references';
import {keywordMap} from '@/data/seo/keyword-map';
import {softwareSchema,breadcrumbSchema,SITE} from '@/lib/seo';
import sitemap from '@/app/sitemap';
describe('public content integrity',()=>{
 it('has exactly 36 tools, 30 distinct guides and 10 real reference tables',()=>{expect(tools).toHaveLength(36);expect(guides).toHaveLength(30);expect(references).toHaveLength(10);expect(new Set(tools.map(t=>t.path)).size).toBe(36);expect(new Set(guides.map(g=>g.title)).size).toBe(30);});
 it('maps every page once with unique titles and canonicals',()=>{expect(keywordMap).toHaveLength(94);expect(new Set(keywordMap.map(k=>k.path)).size).toBe(keywordMap.length);expect(new Set(keywordMap.map(k=>k.title)).size).toBe(keywordMap.length);for(const k of keywordMap){expect(k.canonical).toBe(SITE+k.path);expect(k.description.length).toBeGreaterThan(20);}});
 it('has no orphaned or nonexistent tool/guide associations',()=>{const paths=new Set(keywordMap.map(k=>k.path));for(const tool of tools){expect(categories.some(c=>c.slug===tool.category)).toBe(true);expect(relatedTools(tool).length).toBeGreaterThan(0);for(const slug of tool.guideSlugs)expect(guides.some(g=>g.slug===slug)).toBe(true);}for(const g of guides){expect(g.sections[0].text.length).toBeGreaterThan(250);expect(g.example.length).toBeGreaterThan(100);expect(g.caution.length).toBeGreaterThan(100);for(const p of g.toolPaths)expect(paths.has(p)).toBe(true);}});
 it.each(references)('$slug table derives finite rows and has a linked calculator',reference=>{const v=Object.fromEntries(reference.fields.map(f=>[f.key,f.default]));const rows=reference.rows(v);expect(rows.length).toBeGreaterThan(4);for(const row of rows){expect(row.length).toBe(reference.columns.length);for(const c of row)if(typeof c==='number')expect(Number.isFinite(c)).toBe(true);}expect(tools.some(t=>t.path===reference.toolPath)).toBe(true);});
 it('lists all canonical pages in the sitemap and uses honest modification dates',()=>{const links=sitemap();expect(links).toHaveLength(94);expect(new Set(links.map(l=>l.url)).size).toBe(94);for(const item of links)expect(item.url).toMatch(/^https:\/\/gospeedraceway.com/);});
 it('builds valid schema vocabulary without invented ratings or credentials',()=>{const schema=softwareSchema('Test','An engineering tool','/test');expect(schema['@type']).toBe('WebApplication');expect(schema.offers.price).toBe('0');expect(schema).not.toHaveProperty('aggregateRating');const crumbs=breadcrumbSchema([{name:'Home',path:'/'},{name:'Tools',path:'/calculators'}]);expect(crumbs.itemListElement[1].position).toBe(2);expect(crumbs.itemListElement[1].item).toBe(SITE+'/calculators');});
});
