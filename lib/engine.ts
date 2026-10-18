import {z} from 'zod';
import type {Field,Tool} from '@/data/tools';
import {UNITS,ratio,speed,chainLength,quarterMileET,trapSpeed,horsepowerFromET,densityAltitude,statistics,torquePower,tireDiameter,pitchDiameter} from './calculations';
export type UnitSystem='imperial'|'metric';
export type Inputs=Record<string,number>;
export type Result={label:string;value:number;unit:string;primary?:boolean};
export type Calculation={results:Result[];note:string;chart?:{x:number;y:number}[];chartX?:string;chartY?:string};
export function defaults(tool:Tool):Inputs { return Object.fromEntries(tool.fields.map(f=>[f.key,f.default])); }
export function validate(tool:Tool,values:Inputs) {
 const shape:Record<string,z.ZodType>={};
 for(const f of tool.fields){ let rule=z.number().finite().min(f.min,`${f.label} must be at least ${f.min} in canonical units.`).max(f.max,`${f.label} exceeds the supported range.`); if(f.integer)rule=rule.int(`${f.label} needs a whole number.`); shape[f.key]=rule; }
 const checked=z.object(shape).strict().safeParse(values);
 const errors:Record<string,string>={};
 if(!checked.success) for(const issue of checked.error.issues) errors[String(issue.path[0])]=issue.message;
 if(checked.success&&tool.kind==='chain'&&values.center<=(pitchDiameter(values.pitch,values.front)+pitchDiameter(values.pitch,values.rear))/2) errors.center='Shaft spacing must exceed the sum of the pitch radii; these sprockets overlap.';
 return {valid:Object.keys(errors).length===0,errors};
}
export function displayUnit(f:Field,units:UnitSystem) {
 if(f.dimension==='length')return units==='metric'?'mm':'in';
 if(f.dimension==='mass')return units==='metric'?'kg':'lb';
 if(f.dimension==='power')return units==='metric'?'kW':'hp';
 if(f.dimension==='speed')return units==='metric'?'km/h':'mph';
 if(f.dimension==='torque')return units==='metric'?'Nm':'lbf·ft';
 if(f.dimension==='temperature')return units==='metric'?'°C':'°F';
 if(f.dimension==='pressure')return units==='metric'?'hPa':'inHg';
 return (units==='imperial'?f.imperialUnit:undefined)??f.metricUnit??'';
}
export function toDisplay(value:number,f:Field,units:UnitSystem):number {
 const metric=units==='metric';
 switch(f.dimension){case 'length':return value/(metric?0.001:UNITS.inch);case 'mass':return value/(metric?1:UNITS.lb);case 'power':return value/(metric?1:UNITS.hp);case 'speed':return metric?value*3.6:value/UNITS.mph;case 'torque':return value/(metric?1:UNITS.lbfFt);case 'temperature':return metric?value:value*1.8+32;case 'pressure':return metric?value:value/33.8638866667;default:return value;}
}
export function fromDisplay(value:number,f:Field,units:UnitSystem):number {
 const zero=toDisplay(0,f,units); return (value-zero)/(toDisplay(1,f,units)-zero);
}
export function calculate(tool:Tool,v:Inputs,units:UnitSystem='imperial'):Calculation {
 const validation=validate(tool,v); if(!validation.valid)throw new Error(Object.values(validation.errors).join(' '));
 const results:Result[]=[]; let note=tool.interpretation; let chart:Calculation['chart']; let chartX:string|undefined; let chartY:string|undefined;
 const r=(label:string,value:number,unit:string,primary=false)=>results.push({label,value,unit,primary});
 const velocity=(value:number,label='Theoretical speed')=>{r(label,value/UNITS.mph,'mph',true);r('Metric speed',value*3.6,'km/h');};
 const length=(label:string,value:number,primary=false)=>r(label,value/(units==='metric'?0.001:UNITS.inch),units==='metric'?'mm':'in',primary);
 const powerOut=(label:string,value:number,primary=false)=>{r(label,value/UNITS.hp,'hp',primary);r('Metric power',value,'kW');};
 switch(tool.kind){
  case 'gearing':case 'jackshaft':case 'direct-speed':case 'gearing-chart':{
   const reduction=tool.kind==='direct-speed'?v.ratio:tool.kind==='gearing-chart'?5:ratio(v.front,v.rear)*(v.jackIn??1)/(v.jackOut??1)*(v.jack2In??1)/(v.jack2Out??1)*(v.converter??1)*(v.primary??1)*(v.gear??1);
   r('Overall reduction',reduction,':1',true);r('Wheel speed',v.rpm/reduction,'rpm');velocity(speed(v.rpm,v.diameter,reduction));
   if(tool.kind==='jackshaft'){r('First-stage reduction',v.jackIn/v.front,':1');r('Second-stage reduction',v.rear/v.jackOut,':1');}
   chart=Array.from({length:7},(_,i)=>{const rpm=v.rpm*i/6;return {x:rpm,y:speed(rpm,v.diameter,reduction)/(units==='metric'?1/3.6:UNITS.mph)};});chartX='Engine RPM';chartY=units==='metric'?'km/h':'mph';
   if(tool.kind==='gearing-chart')note='The headline result uses 12/60 (5:1). The table below compares other direct-drive combinations.';
   break;
  }
  case 'sprocket':{const current=ratio(v.front,v.rear),proposed=ratio(v.front,v.proposed);r('Current reduction',current,':1',true);r('Proposed reduction',proposed,':1',true);r('Reduction change',(proposed/current-1)*100,'%');r('Fixed-RPM speed change',(current/proposed-1)*100,'%');break;}
  case 'chain':{const c=chainLength(v.pitch,v.front,v.rear,v.center);r('Calculated chain pitches',c.links,'pitches');r('Selected even link count',c.evenLinks,'links',true);length('Selected chain length',c.length);length('Revised center distance',c.adjustedCenter);break;}
  case 'from-rpm':r('Inferred overall reduction',v.rpm*Math.PI*v.diameter/(60*v.speed),':1',true);break;
  case 'tire-gearing':r('Required new reduction',v.ratio*v.newDiameter/v.oldDiameter,':1',true);r('Speed change with original gears',(v.newDiameter/v.oldDiameter-1)*100,'%');r('RPM change at equal road speed',(v.oldDiameter/v.newDiameter-1)*100,'%');break;
  case 'quarter':r('Empirical quarter-mile ET',quarterMileET(v.mass,v.power),'s',true);velocity(trapSpeed(v.mass,v.power),'Empirical trap speed');break;
  case 'trap':velocity(trapSpeed(v.mass,v.power),'Empirical trap speed');break;
  case 'et-hp':powerOut('Model-implied power',horsepowerFromET(v.mass,v.et),true);break;
  case 'eighth':r('Extrapolated quarter-mile ET',v.eighth*v.factor,'s',true);r('Assumed conversion factor',v.factor,'×');break;
  case 'dial':{const s=statistics([v.pass1,v.pass2,v.pass3]);r('Planning dial-in',s.mean+v.margin,'s',true);r('Mean measured ET',s.mean,'s');r('Observed spread',s.spread,'s');r('Population standard deviation',s.sd,'s');break;}
  case 'density':{const d=densityAltitude(v.temperature,v.pressure,v.humidity);r('Estimated density altitude',d.altitude/(units==='metric'?1:UNITS.foot),units==='metric'?'m':'ft',true);r('Moist-air density',d.density,'kg/m³');r('Relative density',d.density/1.225*100,'% ISA sea level');break;}
  case 'power-weight':r('Power per metric tonne',v.power/v.mass*1000,'kW/tonne',true);r('Power per US short ton',(v.power/UNITS.hp)/(v.mass/UNITS.lb/2000),'hp/US ton');r('Weight per horsepower',(v.mass/UNITS.lb)/(v.power/UNITS.hp),'lb/hp');break;
  case 'acceleration':{const a=v.acceleration*9.80665,target=60*UNITS.mph,t=target/a; r('Idealized time to 60 MPH',t,'s',true);r('Constant-acceleration distance',target**2/(2*a)/(units==='metric'?1:UNITS.foot),units==='metric'?'m':'ft');r('Entered average acceleration',a,'m/s²');break;}
  case 'torque-power':powerOut('Calculated power',torquePower(v.torque,v.rpm),true);break;
  case 'wheel-power':powerOut('Estimated wheel power',v.power*(1-v.loss/100),true);r('Assumed loss',v.loss,'%');break;
  case 'tire':{const d=tireDiameter(v.width,v.aspect,v.rim);length('Nominal tire diameter',d,true);length('Sidewall height',v.width*v.aspect/100000);length('Geometric circumference',Math.PI*d);break;}
  case 'circumference':length('Geometric circumference',Math.PI*v.diameter,true);r('Revolutions per mile',1609.344/(Math.PI*v.diameter),'rev/mile');r('Revolutions per kilometer',1000/(Math.PI*v.diameter),'rev/km');break;
  case 'pitch':length('Pitch circle diameter',pitchDiameter(v.pitch,v.teeth),true);length('Pitch circle radius',pitchDiameter(v.pitch,v.teeth)/2);break;
  case 'chain-speed':r('Average chain speed',v.pitch*v.front*v.rpm/60,'m/s',true);r('Average chain speed',v.pitch*v.front*v.rpm/60/UNITS.foot*60,'ft/min');r('Driven shaft speed',v.rpm*v.front/v.rear,'rpm');break;
 }
 if(results.some(x=>!Number.isFinite(x.value)))throw new Error('These inputs exceed the supported calculation range.');
 return {results,note,chart,chartX,chartY};
}
export function formatNumber(n:number,digits=2){return new Intl.NumberFormat('en-US',{maximumFractionDigits:digits,minimumFractionDigits:Math.abs(n)<100?digits:0}).format(Object.is(n,-0)?0:n);}
