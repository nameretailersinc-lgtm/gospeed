'use client';
import Link from 'next/link';
import {useState} from 'react';
import {ArrowRight,ChevronRight,BookOpen,TableProperties,Wrench,Layers,Car,Bike,Cog,CircleDot,Flag,Gauge,Ruler,Link2,Weight,GraduationCap,ChartNoAxesColumnIncreasing} from 'lucide-react';
import Image from './site-image';
import {guides} from '@/data/guides';
import {references} from '@/data/references';
import {guideImage,guideTopics} from '@/lib/guide-library';
import {referenceHero} from '@/lib/reference-presentation';
import {HD} from '@/lib/image-assets';

type Kind='guides'|'reference'|'tools';
type Item={path:string;title:string;text:string;topic:string;image:string};
const utilityItems:Item[]=[
 {path:'/calculators',title:'Calculator directory',text:'Find the right tool across 9 motorsport categories.',topic:'explore',image:HD.kart},
 {path:'/methodology',title:'Calculation methodology',text:'Understand units, formulas, model types and review policy.',topic:'methods',image:HD.blueprint},
 {path:'/engineering',title:'Engineering calculators',text:'Explore sprocket geometry and chain speed.',topic:'explore',image:HD.chain},
 {path:'/reference',title:'Interactive reference charts',text:'Change an input and compare the relationship.',topic:'explore',image:HD.drivetrain},
 {path:'/contact',title:'Report a correction',text:'Prepare a report with inputs and supporting evidence.',topic:'help',image:HD.workbench},
 {path:'/about',title:'About the project',text:'Learn the scope and purpose of GoSpeedRaceway.',topic:'help',image:HD.kartRear},
];
const referenceTopic=(slug:string)=>slug.includes('chain')||slug.includes('sprocket')?'Chain & Sprockets':slug.includes('tire')?'Tires & Dimensions':slug.includes('torque')?'Torque & Speed':slug.includes('loss')?'Drivetrain & Losses':slug.includes('quarter')?'Weight & ET':slug.includes('converter')?'Converter Ratios':'Gearing & RPM';
const topicIcons:Record<string,typeof BookOpen>={'Go-kart':Car,'Mini bike':Bike,Motorcycle:Bike,'Dirt bike':Bike,Drivetrain:Layers,Tires:CircleDot,'Drag racing':Flag,Performance:Gauge,Engineering:Ruler,'Chain & Sprockets':Link2,'Tires & Dimensions':CircleDot,'Torque & Speed':Gauge,'Drivetrain & Losses':Cog,'Weight & ET':Weight,'Converter Ratios':Cog,'Gearing & RPM':Cog,explore:Layers,methods:Ruler,help:Wrench};
const featuredGuides=['calculate-go-kart-gear-ratios','torque-vs-horsepower','sprocket-pitch-diameter','go-kart-chain-sizes','quarter-mile-et-estimation','motorcycle-highway-rpm'];
const guideSummaries:Record<string,string>={
 'calculate-go-kart-gear-ratios':'Calculate reduction, compare sprockets and work through a 12/60 example.',
 'torque-vs-horsepower':'Understand how torque, RPM and power work together at one operating point.',
 'sprocket-pitch-diameter':'Calculate the pitch circle from chain pitch and sprocket tooth count.',
 'go-kart-chain-sizes':'Measure chain pitch and understand the limits of pitch-only identification.',
 'quarter-mile-et-estimation':'Explore the ET model, race weight, power and real-world limitations.',
 'motorcycle-highway-rpm':'See how gearing and tire circumference change engine RPM at road speed.',
};

export function ResourceMenu({kind,onNavigate}:{kind:Kind;onNavigate:()=>void}){
 const [active,setActive]=useState('all');
 const isGuides=kind==='guides';const isReference=kind==='reference';
 const items:Item[]=isGuides?guides.map(g=>({path:'/guides/'+g.slug,title:g.title,text:guideSummaries[g.slug]??g.intro,topic:g.category,image:guideImage(g)})):isReference?references.map(r=>({path:'/reference/'+r.slug,title:r.title,text:r.description,topic:referenceTopic(r.slug),image:referenceHero(r.slug)})):utilityItems;
 const title=isGuides?'Engineering Guides':isReference?'Reference Charts':'Tools & Resources';
 const hub=isGuides?'/guides':isReference?'/reference':'/calculators';
 const topics=kind==='tools'?['explore','methods','help']:isGuides?guideTopics:[...new Set(items.map(i=>i.topic))];
 const subtitles:Record<string,string>={all:'Tools, methods and more',explore:'Helpful utilities',methods:'Calculation methods',help:'Support and contribution'};
 const groupLabels:Record<string,string>={explore:'Explore tools',methods:'Methods & sources',help:'Help & project'};
 const groups=[{id:'all',label:'All '+(isGuides?'Guides':isReference?'Charts':'Resources')},...topics.map(t=>({id:t,label:groupLabels[t]??t}))];
 const filtered=active==='all'?(isGuides?featuredGuides.map(slug=>items.find(i=>i.path==='/guides/'+slug)!):items.slice(0,6)):items.filter(i=>i.topic===active).slice(0,6);
 const Icon=isGuides?BookOpen:isReference?TableProperties:Wrench;
 return <div className={`dropdown-panel resource-mega-menu resource-menu-${kind}`}>
  <div className="mega-group-list" role="tablist" aria-label={title+' topics'} aria-orientation="vertical">{groups.map((g,i)=>{const TopicIcon=i===0?Icon:topicIcons[g.id]??Layers;return <button key={g.id} type="button" role="tab" id={`${kind}-topic-${i}`} aria-selected={active===g.id} aria-controls={`${kind}-topic-panel`} tabIndex={active===g.id?0:-1} onClick={()=>setActive(g.id)} onKeyDown={e=>{if(['ArrowUp','ArrowDown','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?groups.length-1:(i+(e.key==='ArrowDown'?1:-1)+groups.length)%groups.length;setActive(groups[next].id);document.getElementById(`${kind}-topic-${next}`)?.focus();}}}><TopicIcon size={23} aria-hidden="true"/><span>{g.label}{kind==='tools'&&<small>{subtitles[g.id]}</small>}</span><ChevronRight size={15} aria-hidden="true"/></button>;})}</div>
  <div className="resource-menu-content" role="tabpanel" id={`${kind}-topic-panel`} aria-labelledby={`${kind}-topic-${groups.findIndex(g=>g.id===active)}`}><div className="mega-tools-heading"><div><span className="eyebrow">{isGuides?'ENGINEERING GUIDES':`${items.length} ${isReference?'CONFIGURABLE CHARTS':'TOOLS & RESOURCES'}`}</span><h2>{active==='all'?(isGuides?<>Learn, Improve, <span>Go Faster</span></>:isReference?<>Reference <span>Charts</span></>:<>Tools & <span>Resources</span></>):groupLabels[active]??active}</h2></div><Link href={hub} onClick={onNavigate}>View all {isGuides?'guides':isReference?'charts':'tools'}<ArrowRight size={16}/></Link></div><p className="resource-menu-intro">{isGuides?'Step-by-step guides, real examples and practical explanations for racers and builders.':isReference?'Compare useful ranges with consistent units, visible formulas and clear assumptions.':'Find a tool, understand the method or help improve a calculation.'}</p>
   <div className="resource-card-grid">{filtered.map(item=><Link className="resource-menu-card" key={item.path} href={item.path} onClick={onNavigate}><span className="resource-card-photo"><Image src={item.image} alt="" fill sizes="(max-width: 1190px) 300px, 400px"/></span><span className="resource-card-copy">{isGuides&&<BookOpen size={20} className="resource-card-book" aria-hidden="true"/>}<strong>{item.title}</strong><small>{item.text}</small></span><ArrowRight size={16} aria-hidden="true"/></Link>)}</div>
   <Link className="resource-menu-footer" href={kind==='tools'?'/methodology':hub} onClick={onNavigate}><GraduationCap size={29} aria-hidden="true"/><span><strong>{kind==='tools'?'See how the calculations work':isGuides?'Browse the complete technical library':'Explore all interactive reference charts'}</strong><small>{isGuides?'In-depth guides, calculations and worked examples.':isReference?'Configurable tables with explained results and limitations.':'Units, formulas, examples and sources in one place.'}</small></span><ArrowRight size={19}/></Link>
  </div>
  <div className="mega-feature-card resource-feature"><div className="mega-feature-image"><Image src={isGuides?HD.car:isReference?HD.chain:HD.drivetrain} alt="" fill sizes="(max-width: 1000px) 1px, 1100px"/><span className="resource-feature-label">{isGuides?'PRACTICAL GUIDES':isReference?'TECHNICAL DATA':'CLEAR METHODS'}<strong>FOR REAL RACERS</strong></span>{isGuides?<div className="resource-feature-stats"><span><strong>{guides.length}</strong>Guides</span><span><strong>{guideTopics.length}</strong>Topics</span><span><strong>Free</strong>To read</span></div>:<ChartNoAxesColumnIncreasing size={32} aria-hidden="true"/>}</div><div><h2>{isGuides?<>Understand your setup. <span>Go faster.</span></>:isReference?<>Understand the data. <span>Compare clearly.</span></>:<>Practical tools. <span>Better understanding.</span></>}</h2><p>{isGuides?'Clear explanations, real examples and practical answers to common questions.':isReference?'Explore engineering relationships and understand what each result can tell you.':'Inspect formulas, check an example and understand each model’s limits.'}</p><Link href={kind==='tools'?'/methodology':hub} className="button button-primary" onClick={onNavigate}>{isGuides?'Explore all guides':isReference?'Explore all charts':'Explore resources'}<ArrowRight size={17}/></Link></div></div>
 </div>;
}
