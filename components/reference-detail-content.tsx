import Link from 'next/link';
import Image from './site-image';
import {ChevronDown,BookOpen,HelpCircle,ArrowUpRight,ArrowRight,Lightbulb} from 'lucide-react';
import {guides} from '@/data/guides';
import {tools} from '@/data/tools';
import {referenceDetails} from '@/data/reference-details';
import type {Reference} from '@/data/references';
import {guideHero} from '@/lib/guide-presentation';

export function ReferenceDetailContent({reference}:{reference:Reference}) {
 const detail=referenceDetails[reference.slug];if(!detail)return null;
 const related=guides.filter(g=>g.toolPaths.includes(reference.toolPath)).slice(0,3);
 return <div className="reference-detail-content"><div className="reference-explainer-grid"><section className="reference-explainer-card"><h2><BookOpen size={21}/>How to read this comparison</h2><p>{detail.reading}</p></section><section className="reference-explainer-card"><h2><Lightbulb size={21}/>A worked example with the initial inputs</h2><p>{detail.example}</p><p className="review-note">The live table changes when you edit its controls.</p></section></div><div className="reference-tool-callout"><ArrowUpRight size={25}/><div><Link href={reference.toolPath}>Open {tools.find(t=>t.path===reference.toolPath)?.name}</Link><p>Use the interactive calculator to explore more scenarios, units and relevant inputs.</p></div><Link className="button button-primary" href={reference.toolPath}>Open calculator<ArrowRight size={16}/></Link></div><section className="reference-faq-section"><h2><HelpCircle size={23}/>Frequently asked questions</h2><div>{[{question:detail.question,answer:detail.answer},{question:'Why do input controls and column headers show different units?',answer:'The unit toggle changes how you enter dimensional inputs. Each output column keeps its stated unit so you can compare values consistently. Read the column header before copying a result.'}].map(f=><details className="faq-item" key={f.question}><summary>{f.question}<ChevronDown size={16}/></summary><p>{f.answer}</p></details>)}</div></section>{related.length>0&&<section className="reference-related-section"><h2><BookOpen size={23}/>Understand the method in more detail</h2><div>{related.map(g=><Link href={`/guides/${g.slug}`} key={g.slug}><Image src={guideHero(g)} width={120} height={80} alt=""/><span><strong>{g.title}</strong><small>{g.intro}</small></span><ArrowRight size={16}/></Link>)}</div></section>}</div>;
}
