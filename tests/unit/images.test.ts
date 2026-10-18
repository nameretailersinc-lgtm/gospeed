import {readFileSync,existsSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
import {HD,resolveSiteImage} from '@/lib/image-assets';
import {categoryImage,toolImage} from '@/lib/visuals';
import {tools,categories} from '@/data/tools';
describe('replacement asset integrity',()=>{
 it('uses real high-resolution PNGs instead of enlarged thumbnail crops',()=>{expect(Object.keys(HD)).toHaveLength(13);for(const url of Object.values(HD)){const path='public'+url;expect(existsSync(path),url).toBe(true);const bytes=readFileSync(path);expect(bytes.toString('ascii',1,4)).toBe('PNG');expect(bytes.readUInt32BE(16)).toBeGreaterThanOrEqual(1600);expect(bytes.readUInt32BE(20)).toBeGreaterThanOrEqual(790);}});
 it('resolves each tool and category to a saved detailed asset',()=>{for(const t of tools)expect(Object.values(HD)).toContain(resolveSiteImage(toolImage(t)));for(const c of categories)expect(Object.values(HD)).toContain(resolveSiteImage(categoryImage(c.slug)));});
 it('preserves existing high-resolution URLs and selects subject-specific replacements',()=>{expect(resolveSiteImage(HD.kart)).toBe(HD.kart);expect(resolveSiteImage('/About/engineering-laptop.jpg')).toBe(HD.workbench);expect(resolveSiteImage('/homepage/category-motorcycle.jpg')).toBe(HD.motorcycle);expect(resolveSiteImage('/homepage/calculator-tire-size.jpg')).toBe(HD.tires);});
});
