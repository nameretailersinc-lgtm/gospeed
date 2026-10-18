import {InfoPage,infoPages} from '@/components/info-page';
import {metadata} from '@/lib/seo';
export const generateMetadata=()=>metadata(infoPages.contact.title,infoPages.contact.description,'/contact');
export default function Page(){return <InfoPage slug="contact"/>;}
