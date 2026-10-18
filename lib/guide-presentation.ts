import type {Guide} from '@/data/guides';
import {HD} from './image-assets';

export function guideHero(guide: Guide) {
  if (guide.slug === 'sprocket-pitch-diameter') return '/sprocket_geometry/hero_sprocket_chain.jpg';
  if (guide.slug === 'torque-vs-horsepower') return '/torque_horsepower/hero_racing_engine.jpg';
  if (guide.source === 'chain') return HD.chain;
  if (guide.category === 'Tires') return HD.tires;
  if (guide.category === 'Drag racing') return HD.drag;
  if (guide.category === 'Motorcycle') return HD.motorcycle;
  if (guide.category === 'Dirt bike') return HD.dirtBike;
  if (guide.category === 'Mini bike') return HD.miniBike;
  if (guide.category === 'Performance' || guide.category === 'Drivetrain') return HD.drivetrain;
  return HD.kart;
}
