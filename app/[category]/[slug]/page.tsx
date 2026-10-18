import {notFound} from 'next/navigation';
import Image from '@/components/site-image';
import {tools,getTool,categories} from '@/data/tools';
import {metadata,softwareSchema} from '@/lib/seo';
import {categoryImage} from '@/lib/visuals';
import {validate,type Inputs,type UnitSystem} from '@/lib/engine';
import {Breadcrumbs} from '@/components/breadcrumbs';
import {Calculator} from '@/components/calculator';
import {StructuredData} from '@/components/structured-data';
import {ToolContent} from '@/components/tool-content';
export const dynamicParams=false;
export function generateStaticParams(){return tools.map(t=>({category:t.category,slug:t.slug}));}
type Params=Promise<{category:string;slug:string}>;
export async function generateMetadata({params}:{params:Params}){const {category,slug}=await params;const t=getTool(category,slug);return t?metadata(t.name,t.description,t.path):{};}
export default async function ToolPage({params,searchParams}:{params:Params;searchParams:Promise<Record<string,string|string[]|undefined>>}){const {category,slug}=await params;const tool=getTool(category,slug);if(!tool)notFound();const cat=categories.find(c=>c.slug===category)!;const query=await searchParams;let initialValues:Inputs|undefined;let shareError=false;const units:UnitSystem=query.units==='metric'?'metric':'imperial';if(query.v!==undefined){try{if(typeof query.v!=='string'||query.v.length>6000)throw new Error('Invalid share');const parsed=JSON.parse(query.v) as Inputs;if(!parsed||Array.isArray(parsed)||typeof parsed!=='object'||!validate(tool,parsed).valid)throw new Error('Invalid values');initialValues=parsed;}catch{shareError=true;}}const prefix=tool.name.startsWith('Go-Kart ')?'Go-Kart ':tool.name.startsWith('Mini Bike ')?'Mini Bike ':'';const suffix=tool.name.slice(prefix.length).replace(/ Calculator$/,'');return <div className="photo-tool-page"><StructuredData data={softwareSchema(tool.name,tool.description,tool.path)}/><section className="photo-page-hero tool-photo-hero"><Image src={categoryImage(category)} alt="" fill priority sizes="100vw"/><div className="hero-shade"/><div className="container"><Breadcrumbs items={[{name:'Home',path:'/'},{name:cat.name,path:`/${category}`},{name:tool.shortName,path:tool.path}]}/><div className="photo-page-heading"><span className="eyebrow">{cat.name.toUpperCase()} CALCULATOR</span><h1>{prefix}<span>{suffix}</span>{tool.name.endsWith(' Calculator')&&<>{' '}<br/>Calculator</>}</h1><p>{tool.description}</p></div></div></section><div className="container photo-tool-main"><Calculator tool={tool} initialValues={initialValues} initialUnits={units} shareError={shareError}/><ToolContent tool={tool}/></div></div>;}
