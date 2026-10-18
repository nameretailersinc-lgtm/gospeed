'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {ArrowRight,ChevronDown,Menu,X,Search,Zap,BookOpen,ChartNoAxesColumnIncreasing,Wrench,Info,Calculator} from 'lucide-react';
import {categories} from '@/data/tools';
import {CalculatorMenu} from './calculator-menu';
import {ResourceMenu} from './resource-menu';
import {Brand} from './brand';
export function Header(){
 const [mobile,setMobile]=useState(false);const header=useRef<HTMLElement>(null);const toggle=useRef<HTMLButtonElement>(null);const search=useRef<HTMLInputElement>(null);
 useEffect(()=>{
  function keydown(e:KeyboardEvent){
   if(e.key==='Escape'){const open=header.current?.querySelector<HTMLDetailsElement>('details[open]');if(open){open.open=false;open.querySelector('summary')?.focus();}setMobile(false);if(mobile)toggle.current?.focus();}
   const target=e.target as HTMLElement;
   if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!target.closest('input,textarea,select,[contenteditable="true"]')&&search.current?.offsetParent){e.preventDefault();search.current.focus();}
  }
  function outside(e:PointerEvent){if(!header.current?.contains(e.target as Node)){setMobile(false);header.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(d=>d.open=false);}}
  function oneMenu(e:Event){const selected=e.target as HTMLDetailsElement;if(selected.tagName==='DETAILS'&&selected.open)header.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(d=>{if(d!==selected)d.open=false;});}
  const element=header.current;document.addEventListener('keydown',keydown);document.addEventListener('pointerdown',outside);element?.addEventListener('toggle',oneMenu,true);
  return()=>{document.removeEventListener('keydown',keydown);document.removeEventListener('pointerdown',outside);element?.removeEventListener('toggle',oneMenu,true);};
 },[mobile]);
 const shut=()=>{setMobile(false);header.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(d=>d.open=false);};
 return <header className="site-header racing-header" ref={header}><div className="container header-inner"><Link className="brand" href="/" aria-label="GoSpeedRaceway home" onClick={shut}><Brand/></Link><nav aria-label="Main navigation" className="desktop-nav"><details className="nav-dropdown calculator-dropdown"><summary><Calculator className="nav-label-icon" size={19} aria-hidden="true"/>Calculators<ChevronDown size={13} aria-hidden="true"/></summary><CalculatorMenu onNavigate={shut}/></details>{([['guides','Engineering Guides'],['reference','Reference Charts'],['tools','Tools']] as const).map(([kind,label])=><details className="nav-dropdown" key={kind}><summary>{kind==='guides'?<BookOpen className="nav-label-icon" size={19} aria-hidden="true"/>:kind==='reference'?<ChartNoAxesColumnIncreasing className="nav-label-icon" size={19} aria-hidden="true"/>:<Wrench className="nav-label-icon" size={19} aria-hidden="true"/>}{label}<ChevronDown size={13} aria-hidden="true"/></summary><ResourceMenu kind={kind} onNavigate={shut}/></details>)}<Link href="/about" onClick={shut}><Info className="nav-label-icon" size={18} aria-hidden="true"/>About</Link></nav><form action="/calculators" className="nav-search"><button aria-label="Search calculators" type="submit"><Search size={18}/></button><label className="sr-only" htmlFor="nav-search">Search tools</label><input ref={search} id="nav-search" name="q" placeholder="Search calculators…" type="search"/><kbd aria-hidden="true">/</kbd></form><Link href="/calculators" className="header-tool-button" onClick={shut}><Zap size={17} fill="currentColor"/>Find a Tool<ArrowRight size={17}/></Link><button ref={toggle} className="mobile-toggle" aria-label={mobile?'Close navigation':'Open navigation'} aria-expanded={mobile} aria-controls="mobile-nav" onClick={()=>setMobile(!mobile)}>{mobile?<X/>:<Menu/>}</button></div>{mobile&&<nav id="mobile-nav" aria-label="Mobile navigation" className="mobile-nav"><Link href="/calculators" onClick={shut}>All calculators</Link>{categories.map(c=><Link key={c.slug} href={`/${c.slug}`} onClick={shut}>{c.name}</Link>)}<Link href="/guides" onClick={shut}>Engineering guides</Link><Link href="/reference" onClick={shut}>Reference charts</Link><Link href="/methodology" onClick={shut}>Methodology</Link><Link href="/about" onClick={shut}><Info className="nav-label-icon" size={18} aria-hidden="true"/>About</Link></nav>}</header>;
}
