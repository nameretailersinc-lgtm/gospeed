import {tools,relatedTools,categories} from '@/data/tools';
import {guides} from '@/data/guides';
import {references} from '@/data/references';
import {SITE} from '@/lib/seo';
type KeywordEntry={path:string;primaryKeyword:string;secondaryKeywords:string[];longTailVariants:string[];intent:'calculate'|'learn'|'navigate';canonical:string;title:string;description:string;h1:string;supportingHeadings:string[];relatedTools:string[];guides:string[];contentStatus:'implemented; launch review pending'};
const entry=(path:string,h1:string,description:string,intent:KeywordEntry['intent'],extra:Partial<KeywordEntry>={}):KeywordEntry=>({path,primaryKeyword:h1.toLowerCase().replaceAll('go-kart','go kart'),secondaryKeywords:[],longTailVariants:[],intent,canonical:SITE+path,title:h1+' | GoSpeedRaceway',description,h1,supportingHeadings:[],relatedTools:[],guides:[],contentStatus:'implemented; launch review pending',...extra});
export const keywordMap:KeywordEntry[]=[
 entry('/','Racing Calculators & Motorsport Performance Tools','Free motorsport calculators with documented formulas and assumptions.','navigate',{h1:'Racing Calculators, Engineering Guides & Motorsport Tools',relatedTools:tools.slice(0,6).map(t=>t.path)}),
 entry('/calculators','Racing Calculator Directory — All 36 Tools','Search calculators by name, category and technical term.','navigate',{h1:'Find your next calculation.'}),
 entry('/guides','Motorsport Engineering Guides','Practical explanations, examples and source references.','learn',{h1:'The engineering behind your setup.'}),
 entry('/reference','Interactive Racing Reference Charts','Configurable engineering comparison tables with explicit units.','learn',{h1:'Make the relationships visible.'}),
 ...categories.map(c=>entry('/'+c.slug,`${c.name} Calculators & Engineering Tools`,c.description,'navigate',{h1:`${c.name} calculators`,relatedTools:tools.filter(t=>t.category===c.slug).map(t=>t.path)})),
 ...tools.map(t=>entry(t.path,t.name,t.description,'calculate',{secondaryKeywords:t.terms,longTailVariants:t.terms,supportingHeadings:['How the calculation works','A worked example','What your result means','Assumptions and limitations','Common mistakes to avoid'],relatedTools:relatedTools(t).map(x=>x.path),guides:t.guideSlugs.map(slug=>'/guides/'+slug)})),
 ...guides.map(g=>entry('/guides/'+g.slug,g.title,g.intro,'learn',{longTailVariants:g.faqs.map(f=>f.question),supportingHeadings:[...g.sections.map(s=>s.heading),'Work through an example','Before you apply the result','Frequently asked questions','Reference and method','Continue learning'],relatedTools:g.toolPaths})),
 ...references.map(r=>entry('/reference/'+r.slug,r.title,r.description,'learn',{supportingHeadings:['How this table is calculated','How to read this comparison','A worked example with the initial inputs','Frequently asked questions','Source and assumptions'],relatedTools:[r.toolPath]})),
 ...(['about','contact','methodology','privacy','terms'] as const).map(slug=>entry('/'+slug,{about:'About GoSpeedRaceway',contact:'Contact & Corrections',methodology:'Calculation Methodology & Sources',privacy:'Privacy Policy',terms:'Terms of Use'}[slug],`GoSpeedRaceway ${slug} information.`,'navigate')),
];
/** No volume or organic difficulty numbers were supplied. Ads competition is not organic difficulty. */
export const keywordResearchNotes='Initial intent map from the supplied brief. No search-volume data has been fabricated. Closely related speed and ratio tools share mathematics but provide distinct workflows; review Search Console evidence before consolidating overlapping application pages.';
