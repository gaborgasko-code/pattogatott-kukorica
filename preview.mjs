import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const base=path.resolve('dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpeg':'image/jpeg','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8','.woff2':'font/woff2','.ttf':'font/ttf'};
http.createServer(async(req,res)=>{try{let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=path.resolve(base,'.'+pathname);if(file!==base&&!file.startsWith(base+path.sep)){res.writeHead(403);res.end();return;}try{if((await stat(file)).isDirectory())file=path.join(file,'index.html');const data=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data);}catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(path.join(base,'404.html')));}}catch{res.writeHead(400);res.end();}}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
