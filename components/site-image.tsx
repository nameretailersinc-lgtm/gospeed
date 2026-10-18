import NextImage,{type ImageProps} from 'next/image';
import {resolveSiteImage} from '@/lib/image-assets';
export default function SiteImage({src,quality=85,...props}:ImageProps){return <NextImage src={typeof src==='string'?resolveSiteImage(src):src} quality={quality} {...props}/>;}
