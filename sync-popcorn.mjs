import {readdirSync,statSync,mkdirSync,readFileSync,writeFileSync,copyFileSync} from 'node:fs';
import path from 'node:path';
// Export the built website to the existing ggabor.online repository.
function copy(dir,relative=''){
 for(const name of readdirSync(dir)){
  const source=path.join(dir,name),rel=path.join(relative,name),dest=path.join('root-site/popcorn',rel);
  if(statSync(source).isDirectory()){mkdirSync(dest,{recursive:true});copy(source,rel);continue;}
  mkdirSync(path.dirname(dest),{recursive:true});
  if(/\.(html|css|js|txt)$/.test(name)){
   let text=readFileSync(source,'utf8').replace(/((?:href|src|action|data-gallery)=["'])\/(?!\/)/g,'$1/popcorn/').replace(/(url\(["']?)\/(?!\/)/g,'$1/popcorn/');
   writeFileSync(dest,text);
  }else copyFileSync(source,dest);
 }
}
copy('dist');
console.log('Exported website to root-site/popcorn');
