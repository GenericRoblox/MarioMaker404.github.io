const PAGE_SIZE = 18;
console.error(e);
els.list.innerHTML = `<p>Could not load levels.json</p>`;
}
}


function apply() {
const q = (els.q?.value || '').toLowerCase();
let filtered = all.filter(x =>
x.name?.toLowerCase().includes(q) ||
x.description?.toLowerCase().includes(q) ||
x.creator?.toLowerCase().includes(q)
);
const s = els.sort?.value || 'new';
if (s === 'name') filtered.sort((a,b)=>a.name.localeCompare(b.name));
else if (s === 'creator') filtered.sort((a,b)=>(a.creator||'').localeCompare(b.creator||''));
else filtered.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));


page = 0;
view = filtered;
render(true);
}


function render(reset=false){
if(reset) els.list.innerHTML = '';
const start = page * PAGE_SIZE;
const slice = view.slice(start, start + PAGE_SIZE);
for (const lvl of slice) {
els.list.appendChild(card(lvl));
}
page++;
els.more.style.display = (page * PAGE_SIZE < view.length) ? 'inline-block' : 'none';
}


function card(lvl){
const el = document.createElement('article');
el.className = 'card';
el.innerHTML = `
<h3>${esc(lvl.name)}</h3>
<p>${esc(lvl.description||'')}</p>
<div class="meta">
<span>${lvl.creator ? 'By ' + esc(lvl.creator) : ''}</span>
<span>Added: ${new Date(lvl.created_at).toLocaleDateString()}</span>
<a href="https://github.com/YOUR_USER/course-world-site/issues/${lvl.issue_number}" target="_blank">Issue #${lvl.issue_number}</a>
</div>
<div class="codebox" id="code-${lvl.id}">${esc(lvl.code)}</div>
<button class="btn copy" data-id="${lvl.id}">Copy Level Code</button>
`;
el.querySelector('.copy').addEventListener('click', () => copy(lvl.id));
return el;
}


function esc(s){ return (s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); }


async function copy(id){
const code = document.getElementById('code-'+id)?.innerText || '';
try {
await navigator.clipboard.writeText(code);
toast('Level code copied!');
} catch {
// Fallback: select text
const range = document.createRange();
const node = document.getElementById('code-'+id);
range.selectNodeContents(node);
const sel = window.getSelection();
sel.removeAllRanges(); sel.addRange(range);
document.execCommand('copy');
sel.removeAllRanges();
toast('Level code copied!');
}
}


function toast(msg){
const t = document.createElement('div');
t.textContent = msg; t.style.position='fixed'; t.style.bottom='20px'; t.style.left='50%'; t.style.transform='translateX(-50%)'; t.style.background='#20232a'; t.style.border='1px solid #2a2f3a'; t.style.padding='10px 14px'; t.style.borderRadius='12px'; t.style.zIndex=9999; t.style.color='#e8e8ef';
document.body.appendChild(t);
setTimeout(()=>t.remove(), 1200);
}


els.q?.addEventListener('input', apply);
els.sort?.addEventListener('change', apply);
els.more?.addEventListener('click', ()=>render(false));


load();
