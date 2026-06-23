'use client';

import { useEffect, useRef, useState } from 'react';
import { questions } from '@/lib/questions';
import { getInviteCode, scoreAnswers } from '@/lib/scoring';

export default function Home() {
  const [phase,setPhase]=useState<'start'|'quiz'|'result'>('start');
  const [idx,setIdx]=useState(0);
  const [answers,setAnswers]=useState<number[]>(Array(questions.length).fill(-1));
  const [longText,setLongText]=useState('');
  const [invite,setInvite]=useState('');
  const canvasRef=useRef<HTMLCanvasElement>(null);

  const result = answers.every(x=>x>=0) ? scoreAnswers(answers) : null;

  useEffect(()=>{ setInvite(getInviteCode()); },[]);

  async function finish() {
    const r = scoreAnswers(answers);
    setPhase('result');
    window.scrollTo(0,0);
    fetch('/api/stats',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({role:r.archetype.id, invite, ref:new URLSearchParams(location.search).get('ref')})}).catch(()=>{});
    const resp = await fetch('/api/result',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({archetype:r.archetype, match:r.match})});
    const data = await resp.json();
    setLongText(data.text);
    setTimeout(()=>drawPoster(r.archetype, r.match),80);
  }

  function choose(v:number){ const a=[...answers]; a[idx]=v; setAnswers(a); }
  function next(){ if(answers[idx]<0){alert('请先选择一个答案');return} if(idx<questions.length-1)setIdx(idx+1); else finish(); }
  function share(){
    const url = `${location.origin}${location.pathname}?ref=${invite}`;
    navigator.clipboard?.writeText(url);
    alert('邀请链接已复制：' + url);
  }
  function downloadPoster(){
    const c=canvasRef.current; if(!c)return;
    const a=document.createElement('a'); a.href=c.toDataURL('image/png'); a.download='film-soul-poster.png'; a.click();
  }
  function drawPoster(a:any, match:number){
    const c=canvasRef.current; if(!c)return; const ctx=c.getContext('2d')!;
    c.width=900;c.height=1400;
    const g=ctx.createLinearGradient(0,0,900,1400); g.addColorStop(0,a.palette[0]); g.addColorStop(.55,'#09080d'); g.addColorStop(1,a.palette[1]); ctx.fillStyle=g; ctx.fillRect(0,0,900,1400);
    ctx.fillStyle='rgba(255,255,255,.05)'; for(let i=0;i<80;i++){ctx.beginPath();ctx.arc(Math.random()*900,Math.random()*1400,Math.random()*2+1,0,7);ctx.fill();}
    ctx.strokeStyle='rgba(255,255,255,.18)'; ctx.lineWidth=2; ctx.strokeRect(54,54,792,1292);
    ctx.fillStyle=a.palette[1]; ctx.font='28px sans-serif'; ctx.fillText('FILM SOUL ARCHETYPE',90,130);
    ctx.fillStyle='#fff'; ctx.font='900 96px sans-serif'; ctx.fillText(a.name,90,310);
    ctx.fillStyle=a.palette[1]; ctx.font='48px sans-serif'; ctx.fillText(a.title,90,385);
    ctx.fillStyle='#fff'; ctx.font='34px sans-serif'; wrap(ctx,a.quote,90,530,720,56);
    ctx.fillStyle='rgba(255,255,255,.88)'; ctx.font='30px sans-serif'; ctx.fillText('匹配度  '+match+'%',90,880);
    ctx.fillStyle='rgba(255,255,255,.76)'; ctx.font='28px sans-serif'; wrap(ctx,'你的性格不是为了所有场景设计的。它更像一部电影：有暗场，有长镜头，也有某一刻突然亮起来的命运感。',90,970,720,48);
    ctx.fillStyle=a.palette[1]; ctx.font='26px sans-serif'; ctx.fillText('邀请码 '+invite,90,1260);
  }
  function wrap(ctx:any,text:string,x:number,y:number,max:number,line:number){let l='';[...text].forEach(ch=>{let t=l+ch;if(ctx.measureText(t).width>max){ctx.fillText(l,x,y);l=ch;y+=line}else l=t});ctx.fillText(l,x,y)}

  if(phase==='start') return <main className="screen"><div className="bg"/><div className="grain"/><div className="float f1"/><div className="float f2"/><div className="wrap hero fadeUp"><div className="kicker">FILM SOUL ARCHETYPE</div><h1 className="title">寻找你的<br/>影视原型</h1><p className="sub">36道情境选择题，24个影视人格结果。不是给你贴标签，而是找到那个在银幕里，替你把这副性格活出结果的人。</p><div className="card" style={{marginTop:24}}><p>凭第一秒直觉作答。测完会生成你的影视命运书、电影海报和专属邀请链接。</p><button className="btn full" onClick={()=>setPhase('quiz')}>开始测试</button></div></div></main>;

  if(phase==='quiz') return <main className="screen"><div className="bg"/><div className="grain"/><div className="wrap fadeUp"><div className="progress"><div className="bar" style={{width:`${idx/questions.length*100}%`}}/></div><div className="card"><div className="qno">QUESTION {idx+1} / {questions.length}</div><h2 className="question">{questions[idx][0]}</h2>{questions[idx][1].map((o,j)=><div key={o} className={'opt '+(answers[idx]===j?'on':'')} onClick={()=>choose(j)}><b>{String.fromCharCode(65+j)}.</b> {o}<small>{['行动 / 现实','理性 / 秩序','情感 / 关系','自由 / 自我'][j]}</small></div>)}</div><div className="nav"><button className="btn secondary" onClick={()=>setIdx(Math.max(0,idx-1))}>上一题</button><button className="btn" onClick={next}>{idx===questions.length-1?'生成结果':'下一题'}</button></div></div></main>;

  const a = result!.archetype;
  return <main className="screen"><div className="bg"/><div className="grain"/><div className="wrap fadeUp"><div className="posterBox"><section className="card"><div className="kicker">你的影视原型</div><h1 className="resultTitle">{a.name}</h1><div style={{color:'#f6c453',fontSize:'18px',margin:'8px 0 14px'}}>《{a.film}》</div><span className="pill">{a.title}</span><span className="pill">匹配度 {result!.match}%</span><p className="quote">{a.quote}</p>{a.tags.map(t=><span className="pill" key={t}>{t}</span>)}</section><section><canvas className="posterCanvas" ref={canvasRef}/><button className="btn full" style={{marginTop:12}} onClick={downloadPoster}>保存结果海报</button></section></div><section className="card section" style={{marginTop:18}}><h3>你的影视命运书</h3><p style={{whiteSpace:'pre-line'}}>{longText || '正在生成你的影视命运书……'}</p><h3>专属片单</h3><p>{a.films.join(' · ')}</p><div className="nav"><button className="btn" onClick={share}>复制邀请链接</button><button className="btn secondary" onClick={()=>{setPhase('start');setIdx(0);setAnswers(Array(questions.length).fill(-1));}}>重新测试</button></div></section></div></main>;
}
