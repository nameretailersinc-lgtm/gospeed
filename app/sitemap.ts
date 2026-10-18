import type {MetadataRoute} from 'next';
import {SITE,UPDATED} from '@/lib/seo';
import {tools,categories} from '@/data/tools';
import {guides} from '@/data/guides';
import {references} from '@/data/references';
export default function sitemap():MetadataRoute.Sitemap {const paths=['/','/calculators','/guides','/reference','/about','/methodology','/contact','/privacy','/terms',...categories.map(c=>`/${c.slug}`),...tools.map(t=>t.path),...guides.map(g=>`/guides/${g.slug}`),...references.map(r=>`/reference/${r.slug}`)];return paths.map(path=>({url:SITE+(path==='/'?'':path),lastModified:new Date(UPDATED)}));}
