'use client';
import {useRef,useState} from 'react';
import Link from 'next/link';
import Image from '@/components/site-image';
import {Search,ArrowRight,ArrowLeft,BookOpen,LayoutGrid,CalendarDays,Clock3,Car,Bike,Cog,CircleDot,Flag,Gauge,Ruler,SlidersHorizontal,X} from 'lucide-react';
import {guides} from '@/data/guides';
import {guideTopics,guideLevels,guideTypes,guideLevel,guideType,guideReadingMinutes,guideImage,guideDate,guideFeaturedRank} from '@/lib/guide-library';
export {guideImage} from '@/lib/guide-library';
const topicIcons=[Car,Bike,Bike,Bike,Cog,CircleDot,Flag,Gauge,Ruler];
const pageSize=15;

export function GuideLibrary({initialPage=1}:{initialPage?:number}){
 const [query,setQuery]=useState('');const [category,setCategory]=useState('All guides');const [levels,setLevels]=useState<string[]>([]);const [types,setTypes]=useState<string[]>([]);const [sort,setSort]=useState('featured');const [page,setPage]=useState(initialPage);const results=useRef<HTMLDivElement>(null);
 const labels=['All guides',...guideTopics];
 const found=guides.filter(g=>(category==='All guides'||category===g.category)&&(!levels.length||levels.includes(guideLevel(g)))&&(!types.length||types.includes(guideType(g)))&&`${g.title} ${g.intro} ${g.category}`.toLowerCase().includes(query.toLowerCase().trim())).sort((a,b)=>sort==='title'?a.title.localeCompare(b.title):sort==='reading'?guideReadingMinutes(a)-guideReadingMinutes(b):sort==='recent'?b.updated.localeCompare(a.updated):guideFeaturedRank(a)-guideFeaturedRank(b));
 const pages=Math.ceil(found.length/pageSize);const current=Math.max(1,Math.min(page,pages||1));const visible=found.slice((current-1)*pageSize,current*pageSize);
 const active=query||category!=='All guides'||levels.length>0||types.length>0;
 const reset=()=>{setQuery('');setCategory('All guides');setLevels([]);setTypes([]);setPage(1);};
 const chooseCategory=(label:string)=>{setCategory(label);setPage(1);};
 const changeFilter=(value:string,values:string[],set:(value:string[])=>void)=>{set(values.includes(value)?values.filter(v=>v!==value):[...values,value]);setPage(1);};
 const pageLink=(p:number)=>p===1?'/guides':`/guides?page=${p}`;
 function turnPage(p:number){setPage(p);results.current?.scrollIntoView({behavior:'smooth',block:'start'});results.current?.focus({preventScroll:true});}
 return <div className="guide-library">
  <form className="guide-library-search" role="search" onSubmit={e=>{e.preventDefault();results.current?.scrollIntoView({behavior:'smooth',block:'start'});results.current?.focus({preventScroll:true});}}><Search size={22} aria-hidden="true"/><label htmlFor="guide-search" className="sr-only">Search engineering guides</label><input id="guide-search" type="search" value={query} placeholder="Search guides, topics, or keywords…" onChange={e=>{setQuery(e.target.value);setPage(1);}}/><button className="button button-primary" type="submit"><Search size={16} aria-hidden="true"/>Search</button></form>
  <div className="guide-library-filters" role="group" aria-label="Filter guides by topic">{labels.map(label=><button key={label} aria-pressed={category===label} onClick={()=>chooseCategory(label)}>{label}</button>)}</div>
  <div className="guide-library-layout"><aside className="guide-library-sidebar" aria-label="Guide filters"><h2><SlidersHorizontal size={17} aria-hidden="true"/>Refine your reading</h2><div className="guide-sidebar-topics"><h3>Categories</h3>{labels.map((label,i)=>{const Icon=i===0?LayoutGrid:topicIcons[i-1];return <button key={label} aria-pressed={category===label} onClick={()=>chooseCategory(label)}><Icon size={17} aria-hidden="true"/><span>{label}</span><small>{label==='All guides'?guides.length:guides.filter(g=>g.category===label).length}</small></button>;})}</div>
   <fieldset><legend>Difficulty level</legend>{guideLevels.map(level=><label key={level}><input type="checkbox" checked={levels.includes(level)} onChange={()=>changeFilter(level,levels,setLevels)}/><span>{level}</span><small>{guides.filter(g=>guideLevel(g)===level).length}</small></label>)}</fieldset>
   <fieldset><legend>Content type</legend>{guideTypes.map(type=><label key={type}><input type="checkbox" checked={types.includes(type)} onChange={()=>changeFilter(type,types,setTypes)}/><span>{type}</span><small>{guides.filter(g=>guideType(g)===type).length}</small></label>)}</fieldset>
   <div className="guide-sidebar-note"><BookOpen size={21} aria-hidden="true"/><strong>Learn, then calculate.</strong><p>Every guide includes a worked example, practical limits and related tools.</p><Link href="/methodology">Our calculation methods<ArrowRight size={15}/></Link></div>
  </aside>
  <div className="guide-library-results" ref={results} tabIndex={-1}><div className="guide-library-results-heading"><p className="guide-result-count" role="status">{found.length} {found.length===1?'guide':'guides'}{pages>1&&<span> · Showing {(current-1)*pageSize+1}–{Math.min(current*pageSize,found.length)}</span>}</p><label>Sort by<select value={sort} onChange={e=>{setSort(e.target.value);setPage(1);}}><option value="featured">Featured</option><option value="recent">Most recent</option><option value="title">Title: A–Z</option><option value="reading">Quickest read</option></select></label></div>
   {active&&<div className="guide-active-filters"><span>{category==='All guides'?'All topics':category}{query&&` · “${query}”`}{levels.length>0&&` · ${levels.join(', ')}`}{types.length>0&&` · ${types.join(', ')}`}</span><button onClick={reset}><X size={14} aria-hidden="true"/>Clear filters</button></div>}
   <div className="guide-grid image-guide-grid">{visible.map(g=><Link className="library-card image-library-card" href={`/guides/${g.slug}`} key={g.slug}><div className="library-card-image"><Image src={guideImage(g)} alt="" fill sizes="(max-width: 600px) 90vw, (max-width: 1100px) 36vw, 26vw"/><span><BookOpen size={12} aria-hidden="true"/>{g.category}</span></div><div className="image-library-body"><h2>{g.title}</h2><p>{g.intro}</p><div className="guide-card-meta"><span><CalendarDays size={13} aria-hidden="true"/><time dateTime={g.updated}>{guideDate(g)}</time></span><span><Clock3 size={13} aria-hidden="true"/>{guideReadingMinutes(g)} min read</span><span className="guide-card-arrow"><ArrowRight size={16} aria-hidden="true"/></span></div></div></Link>)}</div>
   {!found.length&&<div className="empty-state"><Search size={30}/><h2>No matching guides</h2><p>Try a shorter search or clear a filter to see more topics.</p><button className="button button-outline" onClick={reset}>Clear filters</button></div>}
   {pages>1&&<nav className="guide-pagination" aria-label="Guide pages">{current>1?<Link href={pageLink(current-1)} aria-label="Previous guide page" onClick={e=>{e.preventDefault();turnPage(current-1);}}><ArrowLeft size={17}/></Link>:<span aria-disabled="true"><ArrowLeft size={17}/></span>}{Array.from({length:pages},(_,i)=>i+1).map(p=><Link key={p} href={pageLink(p)} aria-label={`Guide page ${p}`} aria-current={current===p?'page':undefined} onClick={e=>{e.preventDefault();turnPage(p);}}>{p}</Link>)}{current<pages?<Link href={pageLink(current+1)} aria-label="Next guide page" onClick={e=>{e.preventDefault();turnPage(current+1);}}><ArrowRight size={17}/></Link>:<span aria-disabled="true"><ArrowRight size={17}/></span>}</nav>}
  </div></div>
 </div>;
}
