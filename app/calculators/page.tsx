import {metadata} from '@/lib/seo';
import {Directory} from '@/components/directory';
import {StructuredData} from '@/components/structured-data';
import {breadcrumbSchema} from '@/lib/seo';
export const generateMetadata=()=>metadata('Racing Calculator Directory — All 36 Tools','Search all 36 motorsport calculators by name, vehicle or technical term. Filter gearing, speed, drag racing, tires and engineering tools.','/calculators');
export default async function CalculatorsPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const params=await searchParams;return <><StructuredData data={breadcrumbSchema([{name:'Home',path:'/'},{name:'Calculators',path:'/calculators'}])}/><Directory key={typeof params.q==='string'?params.q:''} initialQuery={typeof params.q==='string'?params.q.slice(0,200):''}/></>;}
