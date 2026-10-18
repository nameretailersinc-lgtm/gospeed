'use client';
import {useState,useSyncExternalStore} from 'react';
import Link from 'next/link';
import {Button} from './ui/button';
const KEY='gospeed-privacy-v1';
const subscribe=(cb:()=>void)=>{window.addEventListener('storage',cb);window.addEventListener('privacy-change',cb);return()=>{window.removeEventListener('storage',cb);window.removeEventListener('privacy-change',cb);};};
const snapshot=()=>{try{return localStorage.getItem(KEY)??'';}catch{return 'unavailable';}};
export function PrivacyControls(){const stored=useSyncExternalStore(subscribe,snapshot,()=> 'server');const [open,setOpen]=useState(false);const [failed,setFailed]=useState(false);const [dismissed,setDismissed]=useState(false);
 function save(choice:string){try{localStorage.setItem(KEY,choice);window.dispatchEvent(new Event('privacy-change'));setOpen(false);setFailed(false);}catch{setFailed(true);}}
 return <><button className="footer-privacy" onClick={()=>setOpen(true)}>Privacy preferences</button>{(open||(stored===''&&!dismissed))&&<section className="consent" aria-label="Privacy preferences"><div><strong>Your privacy, your choice.</strong><p>This site uses essential local storage for this preference. Optional analytics and advertising are currently off. <Link href="/privacy">Read our privacy notice.</Link></p>{failed&&<p role="alert">Your browser blocked storage. Optional tracking remains off.</p>}</div><div className="consent-actions"><Button variant="outline" size="sm" onClick={()=>save('essential')}>Essential only</Button><Button size="sm" onClick={()=>save('optional-allowed')}>Allow optional</Button><Button variant="ghost" size="sm" onClick={()=>{setOpen(false);setDismissed(true);}}>Close</Button></div></section>}</>;
}
