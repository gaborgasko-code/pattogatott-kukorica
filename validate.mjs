import {readFileSync,readdirSync,statSync,existsSync} from 'node:fs';
import path from 'node:path';
const base=path.resolve(process.argv[2]||'dist');const errors=[];let pages=0,links=0,images=0;
function walk(dir){return readdirSync(dir).flatMap(n=>{const p=path.join(dir,n);return statSync(p).isDirectory()?walk(p):[p];});}
for(const file of walk(process.argv[3]?path.join(base,process.argv[3]):base).filter(f=>f.endsWith('.html'))){pages++;const html=readFileSync(file,'utf8');
if(!html.includes('<html lang="hu">'))errors.push(`${file}: language missing`);
if((html.match(/<h1[ >]/g)||[]).length!==1)errors.push(`${file}: expected one h1`);
if(/<title>[^<]*<br/.test(html))errors.push(`${file}: invalid title`);
for(const [,kind,url] of html.matchAll(/\b(href|src)="([^"]+)"/g)){
 if(!url.startsWith('/')&&!url.startsWith('#'))continue;
 const [rawPath,fragment]=url.split('#');const pathname=rawPath.split('?')[0];
 let target=pathname?path.join(base,decodeURIComponent(pathname)):file;
 if(existsSync(target)&&statSync(target).isDirectory())target=path.join(target,'index.html');
 if(!existsSync(target))errors.push(`${file}: missing ${url}`);
 else if(fragment&&target.endsWith('.html')&&!readFileSync(target,'utf8').includes(`id="${fragment}"`))errors.push(`${file}: missing fragment ${url}`);
 if(kind==='src')images++;else links++;
}
for(const tag of html.matchAll(/<img\b[^>]*>/g)){if(!tag[0].includes('alt="'))errors.push(`${file}: missing image alt`);}
}
console.log(JSON.stringify({pages,localLinksChecked:links,localAssetsChecked:images,errors},null,2));if(errors.length)process.exit(1);
