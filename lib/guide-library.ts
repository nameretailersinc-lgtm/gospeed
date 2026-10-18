import type {Guide} from '@/data/guides';
import {guideHero} from './guide-presentation';
import {HD} from './image-assets';

export const guideTopics=['Go-kart','Mini bike','Motorcycle','Dirt bike','Drivetrain','Tires','Drag racing','Performance','Engineering'];
export const guideLevels=['Beginner','Intermediate'] as const;
export const guideTypes=['How-to guide','Technical explanation','Reference walkthrough'] as const;
const featuredOrder=['calculate-go-kart-gear-ratios','torque-vs-horsepower','sprocket-pitch-diameter','motorcycle-highway-rpm','gear-ratio-speed-formula','tire-diameter-gearing','quarter-mile-et-estimation','dirt-bike-gearing','mini-bike-gear-ratios','power-to-weight','go-kart-chain-sizes','final-drive-ratio','go-kart-jackshaft-gearing','motorcycle-chain-length','tire-speedometer'];
export const guideFeaturedRank=(guide:Guide)=>{const rank=featuredOrder.indexOf(guide.slug);return rank<0?featuredOrder.length:rank;};
const intermediate=new Set(['go-kart-jackshaft-gearing','go-kart-torque-converter-ratios','motorcycle-chain-length','gear-ratio-from-rpm','sprocket-pitch-diameter','chain-drive-calculations','trap-speed-horsepower']);
const walkthroughs=new Set(['go-kart-gear-ratio-chart','eighth-to-quarter-mile','tire-speedometer']);
const howTos=new Set(['calculate-go-kart-gear-ratios','go-kart-speed-from-rpm','mini-bike-sprocket-selection','motorcycle-highway-rpm','dirt-bike-gearing','dirt-bike-sprocket-selection','gear-ratio-from-rpm','rpm-to-mph']);
export const guideLevel=(guide:Guide)=>intermediate.has(guide.slug)?'Intermediate':'Beginner';
export const guideType=(guide:Guide)=>walkthroughs.has(guide.slug)?'Reference walkthrough':howTos.has(guide.slug)?'How-to guide':'Technical explanation';
export function guideReadingMinutes(guide:Guide){
 const text=[guide.title,guide.intro,guide.example,guide.caution,...guide.sections.flatMap(s=>[s.heading,s.text,...(s.paragraphs??[]),...(s.steps??[])]),...guide.faqs.flatMap(f=>[f.question,f.answer])].join(' ');
 return Math.max(1,Math.ceil(text.trim().split(/\s+/).length/200));
}
export function guideImage(guide:Guide){
 if(guide.slug==='torque-vs-horsepower')return '/torque_horsepower/hero_racing_engine.jpg';
 if(guide.slug.includes('jackshaft')||guide.slug.includes('converter'))return HD.drivetrain;
 if(guide.slug.includes('sprocket-selection')||guide.slug==='go-kart-sprocket-sizes')return HD.chain;
 if(guide.slug.includes('speed-from')||guide.slug==='rpm-to-mph'||guide.slug==='motorcycle-highway-rpm')return HD.rpm;
 return guideHero(guide);
}
export const guideDate=(guide:Guide)=>new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(guide.updated+'T00:00:00Z'));
