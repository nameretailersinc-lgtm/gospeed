const ROOT='/images/hd/';
export const HD={kart:ROOT+'kart-hero.png',kartRear:ROOT+'kart-rear.png',car:ROOT+'car-hero.png',chain:ROOT+'chain-drive.png',drivetrain:ROOT+'drivetrain.png',motorcycle:ROOT+'motorcycle.png',tires:ROOT+'tires.png',rpm:ROOT+'rpm-gauge.png',workbench:ROOT+'engineering-workbench.png',dirtBike:ROOT+'dirt-bike.png',miniBike:ROOT+'mini-bike.png',drag:ROOT+'drag-racing.png',blueprint:ROOT+'engineering-blueprint.png'} as const;
/** Keep original reference crops intact; every rendered photo uses a detailed replacement. */
export function resolveSiteImage(src:string):string{
 if(src.startsWith('/sprocket_geometry/')||src.startsWith('/torque_horsepower/'))return src;
 if(src.startsWith(ROOT))return src;
 const name=src.toLowerCase();
 if(name.includes('technical-blueprint'))return HD.blueprint;
 if(name.includes('engineering-laptop'))return HD.workbench;
 if(name.includes('community-racing')||name.includes('footer-')||name.includes('quarter-mile-weight'))return HD.kartRear;
 if(name.includes('hero-kart')||name.includes('hero-go-kart')||name.includes('category-go-kart')||name.includes('calculator-kart-speed'))return HD.kart;
 if(name.includes('mini-bike')||name.includes('category-kart-cockpit'))return HD.miniBike;
 if(name.includes('motorcycle'))return HD.motorcycle;
 if(name.includes('dirt-bike')||name.includes('rally-offroad'))return HD.dirtBike;
 if(name.includes('tire'))return HD.tires;
 if(name.includes('rpm')||name.includes('kart-speed')||name.includes('zero-to-sixty'))return HD.rpm;
 if(name.includes('trap-speed')||name.includes('quarter-mile')||name.includes('et-to-horsepower')||name.includes('drag-racing'))return HD.drag;
 if(name.includes('sprocket')||name.includes('chain-')||name.includes('chain-length'))return HD.chain;
 if(name.includes('gear')||name.includes('drivetrain')||name.includes('converter')||name.includes('jackshaft')||name.includes('power')||name.includes('engine')||name.includes('torque'))return HD.drivetrain;
 if(name.includes('article-')){const n=Number(name.match(/article-(\d+)/)?.[1]??1);return [HD.kart,HD.car,HD.chain,HD.motorcycle,HD.drivetrain,HD.drag,HD.miniBike,HD.rpm,HD.tires][(n-1)%9];}
 return HD.car;
}
