import Link from 'next/link';
import Image from '@/components/site-image';
import {ArrowRight,ArrowUpRight} from 'lucide-react';
import {ToolIcon} from './icons';
import type {Tool} from '@/data/tools';
import {toolImage} from '@/lib/visuals';
export function PhotoToolCard({tool,index=0}:{tool:Tool;index?:number}){return <Link className={`photo-tool-card category-tool-card tool-color-${index%6}`} href={tool.path}><div className="photo-tool-image"><Image src={toolImage(tool)} alt="" fill sizes="(max-width: 600px) 50vw, 20vw"/></div><ArrowUpRight className="photo-card-arrow" size={20}/><div className="photo-tool-content"><span className="color-icon"><ToolIcon tool={tool} size={25}/></span><h3>{tool.shortName}</h3><p>{tool.description}</p><span className="card-link">Open calculator <ArrowRight size={14}/></span></div></Link>;}
