import {HD} from './image-assets';
export function referenceHero(slug:string){
 if(slug.includes('chain')||slug.includes('sprocket'))return HD.chain;
 if(slug.includes('tire'))return HD.tires;
 if(slug.includes('quarter'))return HD.drag;
 if(slug.includes('highway'))return HD.motorcycle;
 if(slug.includes('converter')||slug.includes('jackshaft')||slug.includes('loss'))return HD.drivetrain;
 return '/torque_horsepower/hero_racing_engine.jpg';
}
