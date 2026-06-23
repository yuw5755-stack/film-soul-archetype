async function getStats(){
  const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  try { const r = await fetch(`${base}/api/stats`, {cache:'no-store'}); return await r.json(); }
  catch { return {total:0, roles:{}, refs:{}, message:'本地开发时启动 npm run dev 后查看'}; }
}
export default async function Admin(){
  const s = await getStats();
  const roles = Object.entries(s.roles||{}).sort((a:any,b:any)=>b[1]-a[1]);
  const refs = Object.entries(s.refs||{}).sort((a:any,b:any)=>b[1]-a[1]);
  return <main className="screen"><div className="bg"/><div className="grain"/><div className="wrap"><h1 className="title">数据统计后台</h1><div className="adminGrid"><div className="stat"><span>总测试数</span><br/><b>{s.total||0}</b></div><div className="stat"><span>人格类型数</span><br/><b>{roles.length}</b></div><div className="stat"><span>邀请来源数</span><br/><b>{refs.length}</b></div><div className="stat"><span>存储</span><br/><b>{s.storage||'local'}</b></div></div><div className="card section" style={{marginTop:18}}><h3>人格分布</h3>{roles.map(([k,v]:any)=><p key={k}>{k}：{v}</p>)}<h3>邀请码传播</h3>{refs.map(([k,v]:any)=><p key={k}>{k}：{v}</p>)}</div></div></main>
}
