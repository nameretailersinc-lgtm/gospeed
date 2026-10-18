/** Pure mathematics. Length m, mass kg, power kW, speed m/s, torque Nm. */
export const UNITS = {inch:0.0254, foot:0.3048, lb:0.45359237, hp:0.7456998715822702, mph:0.44704, lbfFt:1.3558179483314} as const;
export const ratio = (driver:number, driven:number) => driven / driver;
export const speed = (rpm:number, diameter:number, reduction:number) => rpm * Math.PI * diameter / (60 * reduction);
export const pitchDiameter = (pitch:number, teeth:number) => pitch / Math.sin(Math.PI / teeth);
export function chainLength(pitch:number, front:number, rear:number, center:number) {
  const x=center/pitch;
  const links=2*x+(front+rear)/2+(rear-front)**2/(4*Math.PI**2*x);
  const evenLinks=2*Math.ceil((links-1e-10)/2);
  const b=evenLinks-(front+rear)/2;
  const adjustedCenter=pitch*(b+Math.sqrt(b*b-2*(rear-front)**2/Math.PI**2))/4;
  return {links,evenLinks,length:evenLinks*pitch,adjustedCenter};
}
export const quarterMileET = (kg:number, kw:number) => 5.825 * Math.cbrt((kg/UNITS.lb)/(kw/UNITS.hp));
export const trapSpeed = (kg:number, kw:number) => 234 * Math.cbrt((kw/UNITS.hp)/(kg/UNITS.lb)) * UNITS.mph;
export const horsepowerFromET = (kg:number, et:number) => (kg/UNITS.lb) / (et/5.825)**3 * UNITS.hp;
/** NWS vapor-pressure relation, ideal moist air, inverse ISA tropospheric density. */
export function densityAltitude(celsius:number, pressureHpa:number, humidity:number) {
  const vapor=humidity/100*6.1078*10**(7.5*celsius/(237.3+celsius));
  const kelvin=celsius+273.15;
  const density=(pressureHpa-vapor)*100/(287.05*kelvin)+vapor*100/(461.495*kelvin);
  const altitude=44330.77*(1-(density/1.225)**(1/4.25588));
  return {density,altitude,vapor};
}
export const torquePower = (nm:number,rpm:number) => nm*rpm*2*Math.PI/60000;
export const tireDiameter = (widthMm:number, aspect:number, rimIn:number) => rimIn*UNITS.inch+2*widthMm*aspect/100000;
export function statistics(values:number[]) {
  const mean=values.reduce((a,b)=>a+b,0)/values.length;
  return {mean, min:Math.min(...values),max:Math.max(...values),spread:Math.max(...values)-Math.min(...values),sd:Math.sqrt(values.reduce((s,v)=>s+(v-mean)**2,0)/values.length)};
}
