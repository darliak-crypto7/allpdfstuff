/* ============================================================
   AllPDFStuff — Shared App Logic
   Extracted from index.html (auth, uploads, iLovePDF API, Stripe,
   nav, modal, toast). Used by index.html AND every dedicated
   tool landing page so behavior stays identical everywhere.

   Requires (loaded before this file):
     <script src="https://js.stripe.com/v3/"></script>
     <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

   Tool landing pages should call initToolPage('compress') (etc.)
   after the DOM elements exist, to preset the tool and skip the
   multi-tool picker step.
   ============================================================ */

// ── Globals accessible to onclick= handlers ──
let sb = null;
let _stripe = null;
let user = null;
let tool = 'compress';
const PRO = []; // pdf-to-word available to all logged-in users

// ── Init libraries once DOM + scripts are ready ──
document.addEventListener('DOMContentLoaded', function() {
  const {createClient} = supabase;
  sb = createClient('https://pzimfguaqqcktokwwdeq.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6aW1mZ3VhcXFja3Rva3d3ZGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3OTQ4MTEsImV4cCI6MjA4OTM3MDgxMX0.OoxZQ4J0xltJYsa6T7Z0IlCueZGHgvEF97EJDO3LUaY');
  sb.auth.onAuthStateChange((_,s)=>{user=s?.user||null;rNav();});
  sb.auth.getSession().then(({data:{session}})=>{user=session?.user||null;rNav();});
  const ov=document.getElementById('ov');
  if(ov) ov.addEventListener('click',e=>{if(e.target===ov)closeModal();});
});
function getStripe(){
  if(!_stripe){
    if(typeof Stripe==='undefined'){toast('err','❌ Payment system not loaded. Please refresh.');return null;}
    _stripe=Stripe('pk_live_51TBygSJEuTHMKBHAkY5CekZDzRCpWHy16X8jJ1FPGHimrLwFxNnKxjt7tB6RtOgGT6WdEEw7uXhopoO0oI85D7AK00M2ZM839H');
  }
  return _stripe;
}

function rNav(){
  const el=document.getElementById('navAuth');
  if(!el) return;
  if(user){
    const i=(user.email||'U')[0].toUpperCase();
    const d=new Date();
    const k='pdfu_'+d.getFullYear()+'_'+(d.getMonth()+1);
    const used=parseInt(localStorage.getItem(k)||'0');
    const pro=isPro();
    const limit=pro?50:5;
    const remaining=Math.max(0,limit-used);
    el.innerHTML=`<div class="u-menu"><div class="u-av" onclick="tDrop()">${i}</div><div class="u-drop" id="uDrop"><div style="padding:9px 11px;font-size:.78rem;color:var(--mut);border-bottom:1px solid var(--bdr);margin-bottom:4px">${remaining} task${remaining!==1?'s':''} left this month</div><a href="/account.html">👤 My Account</a><a href="/#pricing">⭐ Upgrade</a><div class="udiv"></div><button onclick="doLogout()">🚪 Sign out</button></div></div>`;
  }
  else el.innerHTML=`<button class="btn-ghost" onclick="openModal('login')">Sign in</button><a href="/#pricing" class="btn-pill">Get Pro →</a>`;
}
function tDrop(){document.getElementById('uDrop')?.classList.toggle('open');}
document.addEventListener('click',e=>{if(!e.target.closest('.u-menu'))document.getElementById('uDrop')?.classList.remove('open');});

function openModal(t){document.getElementById('ov').classList.add('open');sw(t);}
function closeModal(){document.getElementById('ov').classList.remove('open');}
function sw(t){document.getElementById('lpane').style.display=t==='login'?'block':'none';document.getElementById('spane').style.display=t==='signup'?'block':'none';}

function sa(id,msg){const el=document.getElementById(id);el.textContent=msg;el.style.display='block';}
function ha(...ids){ids.forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none';});}

async function doForgotPassword(){
  const email = document.getElementById('lem').value.trim();
  if(!email){sa('lerr','Please enter your email address first.');return;}
  const{error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:'https://www.allpdfstuff.com/account.html'});
  if(error)sa('lerr',error.message);
  else{ha('lerr');sa('lok','✅ Password reset email sent! Check your inbox.');}
}

async function doLogin(){
  ha('lok','lerr');
  const email=document.getElementById('lem').value.trim(),pass=document.getElementById('lpw').value;
  if(!email||!pass){sa('lerr','Please fill in all fields.');return;}
  const{error}=await sb.auth.signInWithPassword({email,password:pass});
  if(error)sa('lerr',error.message);
  else{sa('lok','Signed in!');setTimeout(closeModal,1100);toast('ok','✅ Welcome back!');}
}
async function doSignup(){
  ha('sok','serr');
  const name=document.getElementById('snm').value.trim(),email=document.getElementById('sem').value.trim(),pass=document.getElementById('spw').value;
  const marketing=document.getElementById('smarketing').checked;
  if(!name||!email||!pass){sa('serr','Please fill in all fields.');return;}
  if(pass.length<8){sa('serr','Password must be at least 8 characters.');return;}
  const{error}=await sb.auth.signUp({email,password:pass,options:{data:{full_name:name,marketing_consent:marketing,marketing_consent_date:new Date().toISOString()}}});
  if(error)sa('serr',error.message);
  else{sa('sok','Account created! Check your email.');toast('ok','🎉 Account created!');}
}
async function doLogout(){await sb.auth.signOut();toast('ok','👋 Signed out');}

function selectTool(t){
  tool = t;
  document.querySelectorAll('.pill').forEach(b=>b.classList.toggle('on',b.dataset.tool===t));
  const lbl={compress:'Click to upload your PDF to compress',merge:'Click to upload PDFs to merge',split:'Click to upload your PDF to split','pdf-to-jpg':'Click to upload your PDF to convert to JPG','word-to-pdf':'Click to upload your Word document',rotate:'Click to upload your PDF to rotate','extract-text':'Click to upload your PDF to extract text',
       'page-numbers':'Click to upload your PDF to add page numbers',
       'ocr-pdf':'Click to upload your scanned PDF',
       watermark:'Click to upload your PDF to watermark',
       'remove-watermark':'Click to upload your PDF to remove watermark',
       repair:'Click to upload your damaged PDF to repair',
       unlock:'Click to upload your password-protected PDF',
       'protect-pdf':'Click to upload your PDF to password protect',
       'pdf-to-pdfa':'Click to upload your PDF to convert to PDF/A',
       'convert-image':'Click to upload your image to convert to PDF','pdf-to-excel':'Click to upload your PDF → Excel'};
  const dropT=document.getElementById('dropT');
  if(dropT) dropT.textContent=lbl[t]||'Click to upload';
  const fi=document.getElementById('fileInput');
  if(fi) fi.accept=t==='convert-image'?'.jpg,.jpeg,.png,.tiff,.gif,.bmp':(t==='word-to-pdf'?'.doc,.docx':'.pdf');
  sh('dropZ');hd('procW');hd('resW');
}
function sh(id){const el=document.getElementById(id);if(el)el.style.display='block';}
function hd(id){const el=document.getElementById(id);if(el)el.style.display='none';}
function shf(id){const el=document.getElementById(id);if(el)el.style.display='flex';}

// Pending file waiting for tool selection
let pendingFile = null;

function onOver(e){e.preventDefault();document.getElementById('dropZ').classList.add('over');}
function onLeave(){document.getElementById('dropZ').classList.remove('over');}
function onDrop(e){
  e.preventDefault();
  document.getElementById('dropZ').classList.remove('over');
  const files=Array.from(e.dataTransfer.files);
  if(files.length>0) showPicker(files);
}
function onSel(e){
  const files=Array.from(e.target.files);
  if(files.length>0) showPicker(files);
}

// Show the tool picker after file is selected
function showPicker(files){
  // Block guests before they can even upload
  if(!user){
    toast('err','⭐ Please sign in or create a free account to use our tools');
    openModal('signup');
    return;
  }
  // Accept either single file or array
  if(!Array.isArray(files)) files=[files];
  pendingFile = files;

  // Dedicated single-tool landing pages preset the tool and skip the
  // multi-tool picker UI entirely — jump straight into pickAndGo().
  if(window.PRESET_TOOL){
    pickAndGo(window.PRESET_TOOL);
    return;
  }

  const count = files.length;
  const name = count>1 ? count+' files selected' : (files[0].name.length>30 ? files[0].name.substring(0,27)+'...' : files[0].name);
  const pfn=document.getElementById('pickerFileName');
  if(pfn) pfn.textContent = name;
  // If multiple files dropped, auto-select merge
  if(count>1){
    document.querySelectorAll('#toolPicker .pill').forEach(b=>b.classList.remove('on'));
    const mergeBtn=document.querySelector('#toolPicker .pill[onclick*="merge"]');
    if(mergeBtn)mergeBtn.classList.add('on');
  }
  document.getElementById('dropZ').style.display = 'none';
  document.getElementById('toolPicker').style.display = 'block';
  document.getElementById('procW').style.display = 'none';
  document.getElementById('resW').style.display = 'none';
}

// User picks a tool from the picker
function cancelWatermark(){
  document.getElementById('watermarkPanel').style.display='none';
  document.getElementById('dropZ').style.display='block';
  pendingFile=null;
}

function applyWatermark(){
  const txt = document.getElementById('wmText').value.trim();
  if(!txt){toast('err','❌ Please enter watermark text');return;}
  window._watermarkText = txt;
  window._watermarkColor = document.getElementById('wmColor').value;
  window._watermarkSize = parseInt(document.getElementById('wmSize').value)||40;
  window._watermarkOpacity = parseInt(document.getElementById('wmOpacity').value)||50;
  document.getElementById('watermarkPanel').style.display='none';
  if(pendingFile){
    const files=Array.isArray(pendingFile)?pendingFile:[pendingFile];
    go(files[0]);
  }
}

function pickAndGo(t){
  if(t==='pdf-to-excel'){
    toast('err','📊 PDF to Excel coming soon! Try PDF to Word instead.');
    return;
  }

  // ALL tools require a signed-in account
  if(!user){
    toast('err','⭐ Please sign in or create a free account to use this tool');
    openModal('signup');
    return;
  }

  // Pro-only tools
  if(['split','pdf-to-jpg','extract-text','repair','unlock','protect-pdf','pdf-to-pdfa','convert-image','page-numbers','ocr-pdf','watermark'].includes(t)&&!isPro()){
    toast('err','⭐ This is a Pro tool — upgrade your plan to unlock it');
    closeModal();setTimeout(()=>{window.location.href='/#pricing';},300);
    return;
  }

  // Protect PDF needs a password
  if(t==='protect-pdf'){
    const pw=prompt('Set a password for this PDF:','');
    if(!pw) return;
    tool=t;
    const tp=document.getElementById('toolPicker');
    if(tp) tp.style.display='none';
    if(pendingFile){
      const files=Array.isArray(pendingFile)?pendingFile:[pendingFile];
      const f=files[0];
      // store password temporarily on the go call
      window._protectPw=pw;
      go(f);
    }
    return;
  }
  // Watermark needs text input — show panel instead of processing immediately
  if(t==='watermark'){
    tool = t;
    const tp=document.getElementById('toolPicker');
    if(tp) tp.style.display='none';
    document.getElementById('watermarkPanel').style.display='block';
    const f=pendingFile?(Array.isArray(pendingFile)?pendingFile[0]:pendingFile):null;
    const fn=f?f.name:'your file';
    document.getElementById('wmFileName').textContent=fn.length>30?fn.substring(0,27)+'...':fn;
    return;
  }
  tool = t;
  const tp=document.getElementById('toolPicker');
  if(tp) tp.style.display = 'none';
  if(pendingFile){
    const files=Array.isArray(pendingFile)?pendingFile:[pendingFile];
    if(t==='merge') go(files[0], files);
    else go(files[0]);
  }
}

// Cancel - go back to drop zone
function cancelPick(){
  pendingFile = null;
  const tp=document.getElementById('toolPicker'); if(tp) tp.style.display = 'none';
  const wp=document.getElementById('watermarkPanel'); if(wp) wp.style.display = 'none';
  document.getElementById('dropZ').style.display = 'block';
  document.getElementById('fileInput').value = '';
}

function isPro(){
  if(!user) return false;
  // Admin accounts always have Pro access
  const admins=['darliak7@gmail.com','kongsomd_7@hotmail.com'];
  if(admins.includes(user.email)) return true;
  return user.user_metadata?.plan==='pro'||user.user_metadata?.plan==='business';
}
function chkLimit(){
  const d=new Date();
  const k='pdfu_'+d.getFullYear()+'_'+(d.getMonth()+1);
  const n=parseInt(localStorage.getItem(k)||'0');
  if(isPro()) return n<50; // Pro = 50 tasks per month
  return n<5; // Free = 5 tasks per month
}
function incLimit(){
  const d=new Date();
  const k='pdfu_'+d.getFullYear()+'_'+(d.getMonth()+1);
  const n=parseInt(localStorage.getItem(k)||'0');
  localStorage.setItem(k,n+1);
  rNav(); // Refresh the task counter in the dropdown immediately after each task
}

async function go(file, allFiles){
  if(tool==='pdf-to-word'&&!user){}
  if(!chkLimit()){toast('err',isPro()?'📋 Monthly limit (50/month) reached — resets next month!':'📋 Monthly limit (5/month) reached — upgrade to Pro for 50 tasks/month!');openModal('signup');return;}
  const max=user?100*1024*1024:10*1024*1024;
  if(file.size>max){toast('err',user?'❌ Max 100 MB':'❌ Max 10 MB free — upgrade to Pro');return;}
  // For merge, need at least 2 files
  if(tool==='merge'&&(!allFiles||allFiles.length<2)){
    toast('err','❌ Merge needs 2+ PDF files — please drop multiple files at once');
    sh('dropZ');hd('procW');hd('resW');
    return;
  }
  hd('dropZ');shf('procW');hd('resW');
  try{
    const r=await api(file,tool,allFiles);
    hd('procW');shf('resW');
    document.getElementById('dlBtn').href=r.url;
    document.getElementById('dlBtn').download=r.fn;
    incLimit(); // Only count successful tasks
    toast('ok','✅ Done!');
  }catch(err){hd('procW');sh('dropZ');toast('err','❌ '+(err.message||'Processing failed'));}
}

async function api(file,t,allFiles){
  const PUB='project_public_c3a9e8f2fc9c20c33b807c9d9f7d1402_tcQsF71c39ce96546f15007dffd2d86e6d2dd';
  const BASE='https://api.ilovepdf.com';
  const map={compress:'compress',merge:'merge',split:'split','pdf-to-jpg':'pdfjpg','word-to-pdf':'officepdf',rotate:'rotate','extract-text':'extract',repair:'repair',unlock:'unlock','protect-pdf':'protect','pdf-to-pdfa':'pdfa','convert-image':'imagepdf','page-numbers':'pagenumber','ocr-pdf':'pdfocr',watermark:'watermark','remove-watermark':'watermark'};
  const at=map[t]||'compress';

  // Step 1: Auth
  const authResp=await fetch(BASE+'/v1/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({public_key:PUB})});
  const authData=await authResp.json();
  if(!authData.token)throw new Error('Auth failed: '+JSON.stringify(authData));
  const token=authData.token;

  // Step 2: Start task
  const startResp=await fetch(BASE+'/v1/start/'+at,{headers:{'Authorization':'Bearer '+token}});
  const startData=await startResp.json();
  if(!startData.task)throw new Error('Start failed: '+JSON.stringify(startData));
  const {server,task}=startData;

  // Step 3: Upload file(s)
  const filesToUpload=(t==='merge'&&allFiles&&allFiles.length>1)?allFiles:[file];
  const uploadedFiles=[];
  for(const f of filesToUpload){
    // Sanitize filename — iLovePDF 500s on long or special-char filenames
    const safeName = f.name.replace(/[^a-zA-Z0-9._-]/g,'_').substring(0,50) || 'document.pdf';
    const fd=new FormData();
    fd.append('task',task);
    fd.append('file',f,safeName);
    const upResp=await fetch('https://'+server+'/v1/upload',{method:'POST',headers:{'Authorization':'Bearer '+token},body:fd});
    const upData=await upResp.json();
    if(!upData.server_filename)throw new Error('Upload failed: '+JSON.stringify(upData));
    uploadedFiles.push({server_filename:upData.server_filename,filename:safeName});
  }

  // Step 4: Process — build clean files array with tool-specific params
  const processFiles=uploadedFiles.map(f=>{
    const obj={server_filename:f.server_filename,filename:f.filename};
    if(t==='rotate') obj.rotate=90;
    return obj;
  });
  const body={task:task,tool:at,files:processFiles};
  if(t==='pdf-to-word') body.outputformat='docx';
  if(t==='word-to-pdf') body.outputformat='pdf';
  if(t==='pdf-to-jpg') body.pdfjpg_mode='pages';
  if(t==='protect-pdf'){body.password=window._protectPw||'password';body.encryption_level=128;}
  if(t==='pdf-to-pdfa'){body.conformance='pdfa-1b';}
  if(t==='watermark'){body.mode='text';body.text=window._watermarkText||'CONFIDENTIAL';body.font_size=window._watermarkSize||40;body.font_color=window._watermarkColor||'#FF0000';body.transparency=window._watermarkOpacity||50;body.vertical_position='middle';body.horizontal_position='center';}
  if(t==='ocr-pdf') body.language='eng';
  if(t==='page-numbers'){body.facing_pages=false;body.vertical_position='bottom';body.horizontal_position='center';body.font_size=14;body.font_color='#000000';}
  const prResp=await fetch('https://'+server+'/v1/process',{method:'POST',headers:{'Authorization':'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!prResp.ok){const e=await prResp.text();throw new Error('Process failed: '+e);}

  // Step 5: Download
  const dlResp=await fetch('https://'+server+'/v1/download/'+task,{headers:{'Authorization':'Bearer '+token}});
  if(!dlResp.ok)throw new Error('Download failed: '+dlResp.status);
  const blob=await dlResp.blob();

  // Step 6: Return correct file type
  const extMap={'extract-text':'txt','repair':'pdf','unlock':'pdf','protect-pdf':'pdf','pdf-to-pdfa':'pdf','convert-image':'pdf','page-numbers':'pdf','ocr-pdf':'pdf',watermark:'pdf','remove-watermark':'pdf','pdf-to-excel':'xlsx','pdf-to-jpg':'zip','split':'zip','merge':'pdf','compress':'pdf','rotate':'pdf','word-to-pdf':'pdf'};
  const ext=extMap[t]||'pdf';
  const mimeMap={txt:'text/plain',jpg:'image/jpeg',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',zip:'application/zip',pdf:'application/pdf'};
  const typedBlob=new Blob([blob],{type:mimeMap[ext]||'application/octet-stream'});
  const baseName=file.name.replace(/\.[^/.]+$/,'');
  return{url:URL.createObjectURL(typedBlob),fn:baseName+'.'+ext};
}

function resetUp(){pendingFile=null;document.getElementById('dropZ').style.display='block';document.getElementById('toolPicker').style.display='none';hd('procW');hd('resW');document.getElementById('fileInput').value='';const dropT=document.getElementById('dropT');if(dropT)dropT.textContent='Drop your file here to get started';}
async function handleSub(p){
  if(!user){openModal('signup');return;}
  // Redirect to Stripe Payment Link
  if(p==='pro'){
    window.location.href='https://buy.stripe.com/4gM00kf9Igxo2798NX1ck00';
  }
}

function toggleMobileMenu(){
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobMenu').classList.toggle('open');
}
function closeMobileMenu(){
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobMenu').classList.remove('open');
}
function toast(type,msg){const el=document.getElementById('tst');document.getElementById('tmsg').textContent=msg;el.className='toast '+type+' show';setTimeout(()=>el.classList.remove('show'),3500);}

// ── Dedicated tool landing pages call this once, after the DOM is
//    parsed, to preset which tool the upload widget should run and
//    skip the multi-tool picker step. ──
function initToolPage(toolId){
  window.PRESET_TOOL = toolId;
  selectTool(toolId);
}
