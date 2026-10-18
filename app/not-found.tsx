import Link from 'next/link';
import {Flag,ArrowRight} from 'lucide-react';
import {Button} from '@/components/ui/button';
export default function NotFound(){return <div className="container not-found"><Flag size={38}/><span className="eyebrow">404 / OFF THE RACING LINE</span><h1>This page isn’t on the circuit.</h1><p>Find the calculation you need in our tool directory.</p><Button asChild><Link href="/calculators">Explore calculators <ArrowRight size={16}/></Link></Button></div>;}
