import {notFound} from 'next/navigation';
import {guides} from '@/data/guides';
import {metadata} from '@/lib/seo';
import {GuideDetail} from '@/components/guide-detail';
export const dynamicParams=false;
export function generateStaticParams(){return guides.map(g=>({slug:g.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const g=guides.find(g=>g.slug===slug);return g?metadata(g.title,g.intro,`/guides/${slug}`):{};}
export default async function GuidePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const guide=guides.find(g=>g.slug===slug);if(!guide)notFound();return <GuideDetail guide={guide}/>;}
