import {InfoPage,infoPages} from '@/components/info-page';
import {metadata} from '@/lib/seo';
export const generateMetadata=()=>metadata(infoPages.privacy.title,infoPages.privacy.description,'/privacy');
export default function Page(){return <InfoPage slug="privacy"/>;}
