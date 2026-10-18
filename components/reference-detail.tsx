import Link from 'next/link';
import Image from './site-image';
import {Calculator,ChartColumnIncreasing,ExternalLink,ArrowLeft} from 'lucide-react';
import type {Reference} from '@/data/references';
import {sources} from '@/data/sources';
import {tools} from '@/data/tools';
import {referenceHero} from '@/lib/reference-presentation';
import {Breadcrumbs} from './breadcrumbs';
import {ReferenceTable} from './reference-table';
import {ReferenceDetailContent} from './reference-detail-content';

export function ReferenceDetail({reference}:{reference:Reference}){
 const source=sources[reference.source];
 return <div className="reference-detail-page"><header className="reference-detail-hero"><Image src={referenceHero(reference.slug)} alt="" fill priority sizes="100vw" quality={90}/><div className="container"><Breadcrumbs items={[{name:'Home',path:'/'},{name:'Reference charts',path:'/reference'},{name:reference.title,path:`/reference/${reference.slug}`}]}/><div className="reference-detail-heading"><span className="eyebrow">INTERACTIVE REFERENCE</span><h1>{reference.title}</h1><p>{reference.description} Change an input to explore the relationship.</p></div></div></header><div className="container page-section reference-detail-container"><ReferenceTable slug={reference.slug}/><section className="reference-method-card"><h2><ChartColumnIncreasing size={22}/>How this table is calculated</h2><div><div className="formula-box"><Calculator size={23}/><code>{reference.formula}</code></div><p>Rows use the same assumptions while varying the value in the first column. Input-unit controls change the units used to enter values; column headers always state the output units.</p></div></section><ReferenceDetailContent reference={reference}/><section className="reference-source-block"><h2><ChartColumnIncreasing size={22}/>Source and assumptions</h2><p>{source.note}</p><a href={source.url} target="_blank" rel="noopener noreferrer" className="source-link">{source.title}<ExternalLink size={14}/></a><p className="review-note">Read the <Link href="/methodology">calculation methodology</Link> for model scope, unit conventions and review status.</p></section><Link href="/reference" className="arrow-link reference-back"><ArrowLeft size={16}/>All reference charts</Link><span className="sr-only">Related calculator: {tools.find(t=>t.path===reference.toolPath)?.name}</span></div></div>;
}
