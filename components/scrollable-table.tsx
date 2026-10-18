import type {ReactNode} from 'react';

/** Keyboard access is necessary when numeric tables overflow narrow viewports. */
export function ScrollableTable({children,label,live=false}:{children:ReactNode;label:string;live?:boolean}){
 // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Named region supports keyboard scrolling.
 return <div className="table-scroll" role="region" aria-label={label} aria-live={live?'polite':undefined} tabIndex={0}>{children}</div>;
}
