import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {ToolIcon} from './icons';
import type {Tool} from '@/data/tools';
export function ToolCard({tool,featured=false}:{tool:Tool;featured?:boolean}){return <Link href={tool.path} className={`tool-card ${featured?'featured-tool':''}`}><div className="card-top"><span className="icon-box"><ToolIcon tool={tool}/></span><ArrowUpRight size={18} aria-hidden="true"/></div><span className="eyebrow">{tool.category.replaceAll('-',' ')}</span><h3>{tool.shortName}</h3><p>{tool.description}</p><span className="card-link">Open calculator <span aria-hidden="true">→</span></span></Link>;}
