import Link from 'next/link';
import {ChevronRight} from 'lucide-react';
import {StructuredData} from './structured-data';
import {breadcrumbSchema} from '@/lib/seo';
export function Breadcrumbs({items}:{items:{name:string;path:string}[]}){return <><nav aria-label="Breadcrumb" className="breadcrumbs"><ol>{items.map((item,i)=><li key={item.path}>{i>0&&<ChevronRight size={12} aria-hidden="true"/>}{i===items.length-1?<span aria-current="page">{item.name}</span>:<Link href={item.path}>{item.name}</Link>}</li>)}</ol></nav><StructuredData data={breadcrumbSchema(items)}/></>;}
