'use client';
import Link from 'next/link';
import {useState} from 'react';
import Image from './site-image';
import {ArrowRight,ChevronRight,Flame,LayoutGrid,ChartNoAxesColumnIncreasing} from 'lucide-react';
import {tools} from '@/data/tools';
import {HD} from '@/lib/image-assets';
import {CategoryIcon,ToolIcon} from './icons';

const groups=[
 {id:'all',label:'All Calculators',categories:[] as string[],hub:'/calculators'},
 {id:'performance',label:'Track & Performance',categories:['performance'],hub:'/performance'},
 {id:'setup',label:'Vehicle & Setup',categories:['go-kart','mini-bike'],hub:'/go-kart'},
 {id:'bikes',label:'Motorcycle & Dirt Bike',categories:['motorcycle','dirt-bike'],hub:'/motorcycle'},
 {id:'drivetrain',label:'Engine & Powertrain',categories:['drivetrain'],hub:'/drivetrain'},
 {id:'tires',label:'Tires & Gearing',categories:['tires'],hub:'/tires'},
 {id:'drag-racing',label:'Drag Racing',categories:['drag-racing'],hub:'/drag-racing'},
 {id:'engineering',label:'Engineering',categories:['engineering'],hub:'/engineering'},
];
const picks=['/go-kart/gear-ratio-calculator','/performance/zero-to-sixty-calculator','/tires/tire-diameter-calculator','/performance/torque-to-horsepower-calculator','/go-kart/speed-calculator','/go-kart/chain-length-calculator','/drag-racing/quarter-mile-calculator','/engineering/sprocket-pitch-diameter-calculator'];
const captions:Record<string,string>={
 '/go-kart/gear-ratio-calculator':'Compare gearing and theoretical speed',
 '/performance/zero-to-sixty-calculator':'Time and distance from acceleration',
 '/tires/tire-diameter-calculator':'Compare nominal tire dimensions',
 '/performance/torque-to-horsepower-calculator':'Convert torque and RPM to power',
 '/go-kart/speed-calculator':'Turn engine RPM into wheel speed',
 '/go-kart/chain-length-calculator':'Estimate pitches and shaft spacing',
 '/drag-racing/quarter-mile-calculator':'Compare weight and power scenarios',
 '/engineering/sprocket-pitch-diameter-calculator':'Explore chain and sprocket geometry',
};
export function CalculatorMenu({onNavigate}:{onNavigate:()=>void}){
 const [active,setActive]=useState('all');const group=groups.find(g=>g.id===active)!;
 const selected=active==='all'?picks.map(p=>tools.find(t=>t.path===p)!):tools.filter(t=>group.categories.includes(t.category)).slice(0,8);
 return <div className="dropdown-panel mega-calculator-menu"><div className="mega-group-list" role="tablist" aria-label="Calculator topics" aria-orientation="vertical">{groups.map((g,i)=><button type="button" role="tab" id={`calculator-topic-${g.id}`} aria-controls="calculator-topic-panel" aria-selected={active===g.id} key={g.id} onClick={()=>setActive(g.id)} onKeyDown={e=>{if(['ArrowUp','ArrowDown','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?groups.length-1:(i+(e.key==='ArrowDown'?1:-1)+groups.length)%groups.length;setActive(groups[next].id);document.getElementById(`calculator-topic-${groups[next].id}`)?.focus();}}} tabIndex={active===g.id?0:-1}>{g.id==='all'?<LayoutGrid size={23}/>:<CategoryIcon category={g.categories[0]} size={23}/>}<span>{g.label}</span><ChevronRight size={15}/></button>)}</div><div className="mega-tools-area" role="tabpanel" id="calculator-topic-panel" aria-labelledby={`calculator-topic-${active}`}><div className="mega-tools-heading"><h2><Flame size={21}/>{active==='all'?'Featured Calculators':group.label}</h2><Link href={group.hub} onClick={onNavigate}>View all<ArrowRight size={16}/></Link></div><p className="calculator-menu-intro">Choose a tool, enter your setup and see the formula behind the result.</p><div className="mega-tools-grid">{selected.map((t,i)=><Link className={`mega-tool-item mega-tool-tone-${i%6}`} href={t.path} key={t.path} onClick={onNavigate}><span className="mega-tool-icon"><ToolIcon tool={t} size={27}/></span><span><strong>{t.name.replace(/^Go-Kart /,'')}</strong><small>{captions[t.path]??t.description.split('.')[0]+'.'}</small></span><ChevronRight size={16}/></Link>)}</div><div className="mega-catalog-note">36 free calculators · 9 motorsport categories<Link href="/calculators" onClick={onNavigate}>Explore the directory<ArrowRight size={14}/></Link></div></div><div className="mega-feature-card"><div className="mega-feature-image"><Image src={HD.car} alt="Blue race car on an illuminated circuit" fill sizes="(max-width: 1000px) 1px, 1100px"/><ChartNoAxesColumnIncreasing size={28}/></div><div><h2>Track Performance Hub</h2><p>Explore power, torque and acceleration with clear formulas and useful comparisons.</p><Link href="/performance" className="button button-primary" onClick={onNavigate}>Explore calculators<ArrowRight size={16}/></Link></div></div></div>;
}
