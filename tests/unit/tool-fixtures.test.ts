import {describe,it,expect} from 'vitest';
import {tools,type Kind} from '@/data/tools';
import {calculate,defaults,type Inputs} from '@/lib/engine';
import {UNITS} from '@/lib/calculations';
/** Goldens chosen for hand-solvable cases; expected values are not computed by the implementation. */
const fixtures:Record<Kind,{inputs:Inputs;label:string;expected:number;tolerance?:number}>={
 gearing:{inputs:{front:12,rear:60,rpm:300,diameter:1/Math.PI,jackIn:1,jackOut:1,jack2In:1,jack2Out:1,converter:1,primary:1,gear:1},label:'Theoretical speed',expected:2.2369362921},
 jackshaft:{inputs:{front:12,jackIn:18,jackOut:12,rear:60,rpm:300,diameter:1/Math.PI},label:'Overall reduction',expected:7.5},
 sprocket:{inputs:{front:12,rear:60,proposed:66},label:'Proposed reduction',expected:5.5},
 chain:{inputs:{front:20,rear:20,pitch:0.0127,center:0.254},label:'Selected chain length',expected:762},
 'gearing-chart':{inputs:{rpm:300,diameter:1/Math.PI},label:'Theoretical speed',expected:2.2369362921},
 'direct-speed':{inputs:{rpm:300,diameter:1/Math.PI,ratio:5},label:'Theoretical speed',expected:2.2369362921},
 'from-rpm':{inputs:{rpm:300,diameter:1/Math.PI,speed:1},label:'Inferred overall reduction',expected:5},
 'tire-gearing':{inputs:{oldDiameter:0.5,newDiameter:1,ratio:4},label:'Required new reduction',expected:8},
 quarter:{inputs:{mass:3200*UNITS.lb,power:400*UNITS.hp},label:'Empirical quarter-mile ET',expected:11.65},
 trap:{inputs:{mass:3200*UNITS.lb,power:400*UNITS.hp},label:'Empirical trap speed',expected:117},
 'et-hp':{inputs:{mass:3200*UNITS.lb,et:11.65},label:'Model-implied power',expected:400},
 eighth:{inputs:{eighth:8,factor:1.57},label:'Extrapolated quarter-mile ET',expected:12.56},
 dial:{inputs:{pass1:12.1,pass2:12.12,pass3:12.08,margin:0.02},label:'Planning dial-in',expected:12.12},
 density:{inputs:{temperature:15,pressure:1013.25,humidity:0},label:'Estimated density altitude',expected:0,tolerance:0},
 'power-weight':{inputs:{mass:1000,power:100},label:'Power per metric tonne',expected:100},
 acceleration:{inputs:{acceleration:0.5},label:'Idealized time to 60 MPH',expected:5.470245,tolerance:5},
 'torque-power':{inputs:{torque:745.6998715822702/(2*Math.PI),rpm:60},label:'Calculated power',expected:1},
 'wheel-power':{inputs:{power:400*UNITS.hp,loss:15},label:'Estimated wheel power',expected:340},
 tire:{inputs:{width:205,aspect:55,rim:16},label:'Nominal tire diameter',expected:631.9},
 circumference:{inputs:{diameter:1/Math.PI},label:'Revolutions per mile',expected:1609.344},
 pitch:{inputs:{pitch:0.01,teeth:6},label:'Pitch circle diameter',expected:20},
 'chain-speed':{inputs:{pitch:0.0127,front:12,rear:60,rpm:600},label:'Driven shaft speed',expected:120},
};
describe.each(tools)('hand-checked fixture: $name',tool=>{
 it('matches the independent expected output',()=>{const fixture=fixtures[tool.kind];const values=defaults(tool);for(const field of tool.fields)if(field.key in fixture.inputs)values[field.key]=fixture.inputs[field.key];const result=calculate(tool,values,'metric').results.find(r=>r.label===fixture.label);expect(result,`Missing expected result ${fixture.label}`).toBeDefined();expect(result!.value).toBeCloseTo(fixture.expected,fixture.tolerance??8);});
});
