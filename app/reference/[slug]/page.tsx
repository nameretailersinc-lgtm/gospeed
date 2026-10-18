import {notFound} from 'next/navigation';
import {references} from '@/data/references';
import {metadata} from '@/lib/seo';
import {ReferenceDetail} from '@/components/reference-detail';
export const dynamicParams=false;
export function generateStaticParams(){return references.map(r=>({slug:r.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const r=references.find(r=>r.slug===slug);return r?metadata(r.title,r.description,`/reference/${slug}`):{};}
export default async function ReferencePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const reference=references.find(r=>r.slug===slug);if(!reference)notFound();return <ReferenceDetail reference={reference}/>;}
