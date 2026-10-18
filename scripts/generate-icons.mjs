import {readFile,writeFile} from 'node:fs/promises';
import {Buffer} from 'node:buffer';
import {fileURLToPath,URL} from 'node:url';
import sharp from 'sharp';

// Keep the browser and Apple icons in sync with the vector brand mark.
const source=await readFile(new URL('../app/icon.svg',import.meta.url));
await sharp(source).resize(180,180).png().toFile(fileURLToPath(new URL('../app/apple-icon.png',import.meta.url)));
const sizes=[16,32,48];
const frames=await Promise.all(sizes.map(size=>sharp(source).resize(size,size).png().toBuffer()));
const header=Buffer.alloc(6+16*frames.length);
header.writeUInt16LE(1,2);header.writeUInt16LE(frames.length,4);
let offset=header.length;
frames.forEach((frame,i)=>{const entry=6+i*16;header[entry]=sizes[i];header[entry+1]=sizes[i];header.writeUInt16LE(1,entry+4);header.writeUInt16LE(32,entry+6);header.writeUInt32LE(frame.length,entry+8);header.writeUInt32LE(offset,entry+12);offset+=frame.length;});
await writeFile(new URL('../app/favicon.ico',import.meta.url),Buffer.concat([header,...frames]));
