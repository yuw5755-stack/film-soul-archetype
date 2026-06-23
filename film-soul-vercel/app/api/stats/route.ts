import { NextResponse } from 'next/server';
let memory:any = { total:0, roles:{}, refs:{} };

async function getKV(){
  try {
    const mod = await import('@vercel/kv');
    return mod.kv;
  } catch { return null; }
}

export async function GET(){
  const kv:any = await getKV();
  if (kv && process.env.KV_REST_API_URL) {
    const data = await kv.get('film_soul_stats');
    return NextResponse.json({storage:'kv', ...(data || memory)});
  }
  return NextResponse.json({storage:'memory', ...memory});
}

export async function POST(req:Request){
  const body = await req.json().catch(()=>({}));
  const role = body.role || 'unknown';
  const ref = body.ref || 'direct';
  const kv:any = await getKV();

  if (kv && process.env.KV_REST_API_URL) {
    const data = (await kv.get('film_soul_stats')) || {total:0, roles:{}, refs:{}};
    data.total += 1;
    data.roles[role] = (data.roles[role]||0)+1;
    data.refs[ref] = (data.refs[ref]||0)+1;
    await kv.set('film_soul_stats', data);
    return NextResponse.json({ok:true, storage:'kv'});
  }

  memory.total += 1;
  memory.roles[role] = (memory.roles[role]||0)+1;
  memory.refs[ref] = (memory.refs[ref]||0)+1;
  return NextResponse.json({ok:true, storage:'memory'});
}
