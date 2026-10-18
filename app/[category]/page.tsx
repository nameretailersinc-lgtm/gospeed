import {notFound} from 'next/navigation';
import Link from 'next/link';
import Image from '@/components/site-image';
import {BookOpen,ArrowRight} from 'lucide-react';
import {categories,tools} from '@/data/tools';
import {metadata} from '@/lib/seo';
import {categoryImage} from '@/lib/visuals';
import {Breadcrumbs} from '@/components/breadcrumbs';
import {PhotoToolCard} from '@/components/photo-tool-card';
import {Button} from '@/components/ui/button';
export const dynamicParams=false;
export function generateStaticParams(){return categories.map(c=>({category:c.slug}));}
export async function generateMetadata({params}:{params:Promise<{category:string}>}){const {category}=await params;const c=categories.find(c=>c.slug===category);return c?metadata(`${c.name} Calculators & Engineering Tools`,c.description,`/${c.slug}`):{};}
export default async function CategoryPage({params}:{params:Promise<{category:string}>}){const {category}=await params;const c=categories.find(c=>c.slug===category);if(!c)notFound();return <div className="photo-category-page"><section className="photo-page-hero"><Image src={category==='go-kart'?'/chain-calculator/footer-go-kart.jpg':categoryImage(category)} alt="" fill priority sizes="100vw"/><div className="hero-shade"/><div className="container"><Breadcrumbs items={[{name:'Home',path:'/'},{name:'Calculators',path:'/calculators'},{name:c.name,path:`/${category}`}]}/><div className="photo-page-heading"><span className="eyebrow">THE {c.name.toUpperCase()} TOOLBOX</span><h1>{c.name} <span>calculators</span></h1><p>{c.description}</p></div></div></section><div className="container category-main"><div className="category-tool-grid">{tools.filter(t=>t.category===category).map((t,i)=><PhotoToolCard tool={t} key={t.id} index={i}/>)}</div><section className="category-learn-banner"><Image src="/homepage/calculator-kart-speed.jpg" alt="" fill sizes="100vw"/><div className="learn-banner-content"><span className="learn-book"><BookOpen size={35}/></span><div><span className="eyebrow">LEARN AND IMPROVE</span><h2>Build a complete understanding of your setup.</h2><p>Use the linked formulas and worked examples to connect each result to the underlying engineering.</p><Button asChild><Link href="/guides">Explore the technical library <ArrowRight size={15}/></Link></Button></div></div></section></div></div>;}
