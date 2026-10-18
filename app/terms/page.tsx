import {InfoPage,infoPages} from '@/components/info-page';
import {metadata} from '@/lib/seo';
export const generateMetadata=()=>metadata(infoPages.terms.title,infoPages.terms.description,'/terms');
export default function Page(){return <InfoPage slug="terms"/>;}
