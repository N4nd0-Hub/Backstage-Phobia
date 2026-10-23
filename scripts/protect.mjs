// Build a password-protected entry for the standalone Backstage.
// node scripts/protect.mjs SOURCE.html index.html < password-on-stdin
// No password is stored in the generated page or in this script.
import {readFile,writeFile} from 'node:fs/promises';
import {createInterface} from 'node:readline';
import {webcrypto} from 'node:crypto';
const [sourcePath,outputPath]=process.argv.slice(2);
if(!sourcePath||!outputPath)throw Error('Informe os caminhos de origem e destino.');
const rl=createInterface({input:process.stdin,terminal:false});
let password='';
for await(const line of rl){password=line;break;}
rl.close();process.stdin.pause();
if(!password)throw Error('Informe uma senha não vazia pela entrada padrão.');
const source=await readFile(sourcePath,'utf8');
if(source.includes('id="protectedPayload"'))throw Error('A origem já está protegida. Use o HTML original do aplicativo.');
const salt=webcrypto.getRandomValues(new Uint8Array(16));
const iv=webcrypto.getRandomValues(new Uint8Array(12));
const iterations=600000;
const rawKey=await webcrypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
const key=await webcrypto.subtle.deriveKey({name:'PBKDF2',salt,iterations,hash:'SHA-256'},rawKey,{name:'AES-GCM',length:256},false,['encrypt']);
password='';
const encrypted=await webcrypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(source));
const b64=bytes=>Buffer.from(bytes).toString('base64');
const payload=JSON.stringify({version:1,iterations,salt:b64(salt),iv:b64(iv),data:b64(encrypted)});
const output=`<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#19151f"><meta name="robots" content="noindex,nofollow,noarchive">
<meta name="description" content="Backstage // Phobia — acesso ao arquivo pessoal do mestre.">
<title>Backstage // Phobia — Acesso pessoal</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%2317141c'/%3E%3Cpath d='M15 47V17h20q14 0 14 12T35 41H25v6zm10-16h10q5 0 5-3t-5-3H25z' fill='%23ef2b97'/%3E%3C/svg%3E">
<style>
:root{color-scheme:dark;font-family:Arial,Helvetica,sans-serif;color:#f6eddc;background:#19151f}*{box-sizing:border-box}body{margin:0;min-height:100dvh;display:grid;place-items:center;padding:28px;background:radial-gradient(ellipse at 70% 15%,#50304f55,transparent 55%),repeating-linear-gradient(135deg,#ffffff03 0 1px,transparent 1px 22px),#19151f}body::before{content:'';position:fixed;top:0;left:0;right:0;height:5px;background:#ef2b97}.frame{width:min(100%,435px)}.identity{display:flex;gap:11px;align-items:center;margin:0 0 33px}.symbol{width:39px;height:43px;display:grid;place-items:center;background:#ef2b97;color:#fff;font-size:33px;font-weight:900;transform:rotate(-7deg)}.identity b{font-size:20px;letter-spacing:-.7px;font-style:italic}.identity small{display:block;font:8px/1.6 'Courier New',monospace;letter-spacing:2.1px;color:#af9bbd;margin-top:5px}.panel{padding:32px;background:#f2ead6;color:#211b27;border:1px solid #120f18;box-shadow:6px 6px 0 #0e0b14}.eyebrow{font:700 9px 'Courier New',monospace;color:#ba2578;letter-spacing:1.8px;margin-bottom:21px;display:flex;gap:8px;align-items:center}.eyebrow svg{width:14px;height:14px}h1{font-size:32px;line-height:1.04;letter-spacing:-1.4px;margin:0 0 14px}p{font-size:12px;line-height:1.7;color:#70636c;margin:0 0 27px}label{font:700 9px 'Courier New',monospace;letter-spacing:1.1px;display:block;margin-bottom:9px}.password-field{display:flex;align-items:center;border:1px solid #b9acb9;background:#fff9ee;border-radius:3px}.password-field:focus-within{outline:2px solid #ef2b97;outline-offset:2px}input{color-scheme:light;background:transparent;color:#211b27;min-width:0;width:100%;border:0;padding:13px 12px;font:16px Arial,sans-serif;outline:0}button{font:700 11px Arial,sans-serif;cursor:pointer}button:focus-visible{outline:3px solid #69cddf;outline-offset:3px}#togglePassword{border:0;background:transparent;color:#6f5b6e;padding:12px;min-width:67px;align-self:stretch}#unlock{width:100%;margin-top:18px;padding:13px 15px;border:1px solid #23192c;background:#ef2b97;color:white;text-align:left;box-shadow:2px 2px 0 #23192c;display:flex;justify-content:space-between;align-items:center;border-radius:3px;min-height:44px}#unlock:hover{background:#da2388}button:disabled{opacity:.55;cursor:wait}#feedback{font-size:11px;line-height:1.6;min-height:19px;color:#a02c51;margin-top:14px}footer{font:8px/1.8 'Courier New',monospace;letter-spacing:1.4px;color:#a38cae;display:flex;justify-content:space-between;gap:14px;margin-top:23px}.signal{color:#bfdf81}noscript{display:block;background:#3b2631;color:#ffe1dc;font-size:12px;line-height:1.7;padding:15px;margin-top:22px}@media(max-width:480px){body{padding:22px}.panel{padding:27px 23px}.identity{margin-bottom:27px}h1{font-size:30px}footer{font-size:7px;letter-spacing:1px}}
</style>
</head>
<body>
<main class="frame">
<div class="identity"><span class="symbol" aria-hidden="true">P</span><div><b>BACKSTAGE // PHOBIA</b><small>THE GAME MASTER'S ARCHIVE</small></div></div>
<section class="panel" aria-labelledby="accessTitle">
<div class="eyebrow"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3"/></svg>ARQUIVO PESSOAL / ACESSO RESTRITO</div>
<h1 id="accessTitle">Nos bastidores,<br>só com a chave.</h1>
<p>Digite sua senha para abrir o arquivo do mestre.</p>
<form id="accessForm">
<label for="accessPassword">SENHA DE ACESSO</label>
<div class="password-field"><input id="accessPassword" type="password" autocomplete="current-password" autocapitalize="none" spellcheck="false" aria-describedby="feedback" required><button type="button" id="togglePassword" aria-label="Mostrar senha" aria-pressed="false">Mostrar</button></div>
<button type="submit" id="unlock"><span>Abrir Backstage</span><span aria-hidden="true">→</span></button>
<div id="feedback" role="status" aria-live="polite"></div>
</form>
</section>
<footer><span class="signal">● ESPAÇO DO MESTRE</span><span>PERSONA — PHOBIA / 2000</span></footer>
<noscript>Ative o JavaScript no navegador para abrir seu arquivo.</noscript>
</main>
<script type="application/json" id="protectedPayload">${payload}</script>
<script>
(()=>{
'use strict';
const form=document.getElementById('accessForm'),input=document.getElementById('accessPassword'),toggle=document.getElementById('togglePassword'),button=document.getElementById('unlock'),feedback=document.getElementById('feedback');
const decode=value=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
const payload=JSON.parse(document.getElementById('protectedPayload').textContent);
toggle.addEventListener('click',()=>{const show=input.type==='password';input.type=show?'text':'password';toggle.textContent=show?'Ocultar':'Mostrar';toggle.setAttribute('aria-label',show?'Ocultar senha':'Mostrar senha');toggle.setAttribute('aria-pressed',String(show));input.focus()});
input.addEventListener('input',()=>{input.removeAttribute('aria-invalid');feedback.textContent=''});
form.addEventListener('submit',async event=>{
event.preventDefault();if(button.disabled)return;
if(!globalThis.crypto?.subtle){feedback.textContent='Abra o endereço com HTTPS em um navegador atualizado para acessar o arquivo.';return}
button.disabled=true;toggle.disabled=true;form.setAttribute('aria-busy','true');feedback.textContent='Abrindo seu arquivo…';
try{
const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(input.value),'PBKDF2',false,['deriveKey']);
const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:decode(payload.salt),iterations:payload.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(payload.iv)},key,decode(payload.data));
input.value='';
const html=new TextDecoder('utf-8',{fatal:true}).decode(plain);
document.open();document.write(html);document.close();
}catch{
feedback.textContent='Senha incorreta. Confira maiúsculas, minúsculas e tente novamente.';
input.setAttribute('aria-invalid','true');input.focus();input.select();
}finally{button.disabled=false;toggle.disabled=false;form.removeAttribute('aria-busy')}
});
})();
</script>
</body>
</html>`;
await writeFile(outputPath,output,'utf8');
console.log('Entrada protegida gerada. Nenhuma senha foi gravada em texto aberto.');
