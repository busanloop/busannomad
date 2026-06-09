import http from "node:http";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

// --- route.ts 에서 그대로 가져온 가드 로직 ---
function ipBlocked(ip){let a=ip;if(isIP(a)===6&&a.toLowerCase().startsWith("::ffff:"))a=a.slice(7);const v=isIP(a);if(v===4){const p=a.split(".").map(Number);if(p.length!==4||p.some(n=>Number.isNaN(n)||n<0||n>255))return true;const[x,y]=p;if(x===0||x===10||x===127)return true;if(x===169&&y===254)return true;if(x===172&&y>=16&&y<=31)return true;if(x===192&&y===168)return true;if(x===100&&y>=64&&y<=127)return true;return false;}if(v===6){const l=a.toLowerCase();if(l==="::1"||l==="::")return true;if(l.startsWith("fe80"))return true;if(l.startsWith("fc")||l.startsWith("fd"))return true;return false;}return true;}
async function assertPublicUrl(raw){let u;try{u=new URL(raw);}catch{throw new Error("invalid url");}if(u.protocol!=="http:"&&u.protocol!=="https:")throw new Error("protocol not allowed");const h=u.hostname.toLowerCase();if(h==="localhost"||h.endsWith(".localhost")||h.endsWith(".local")||h.endsWith(".internal"))throw new Error("host not allowed");if(isIP(h)){if(ipBlocked(h))throw new Error("host not allowed");}else{const r=await lookup(h,{all:true});if(!r.length||r.some(x=>ipBlocked(x.address)))throw new Error("host not allowed");}return u;}
async function safeFetch(start){let url=start;for(let i=0;i<4;i++){const res=await fetch(url,{redirect:"manual",signal:AbortSignal.timeout(8000)});if(res.status>=300&&res.status<400){const loc=res.headers.get("location");if(!loc)return res;url=await assertPublicUrl(new URL(loc,url).toString());continue;}return res;}throw new Error("too many redirects");}

// --- 공개 호스트인 척하다가 localhost로 302 던지는 서버 (SSRF 리다이렉트 시나리오) ---
const server = http.createServer((req,res)=>{
  if(req.url==="/event"){ res.writeHead(302,{Location:"http://127.0.0.1:"+server.address().port+"/internal-secret"}); res.end(); }
  else { res.writeHead(200,{"Content-Type":"text/html"}); res.end("<title>internal</title>"); }
});
await new Promise(r=>server.listen(0,"127.0.0.1",r));
const port = server.address().port;

// 시작 URL은 caller(POST)가 검증하므로, safeFetch는 hop0를 그대로 fetch하고
// 302의 Location(=localhost)을 assertPublicUrl로 검사한다 → 막혀야 정상.
let result;
try { await safeFetch(new URL(`http://127.0.0.1:${port}/event`)); result="NOT BLOCKED ✗"; }
catch(e){ result = e.message==="host not allowed" ? "BLOCKED ✓ ("+e.message+")" : "threw: "+e.message; }
console.log("302 → localhost redirect:", result);

server.close();
