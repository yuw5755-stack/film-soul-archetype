import { NextResponse } from 'next/server';

let memory:any = { total:0, roles:{}, refs:{} };

export async function GET(){
  return NextResponse.json({ storage:'memory', ...memory });
}

export async function POST(req:Request){
  const body = await req.json().catch(()=>({}));
  const role = body.role || 'unknown';
  const ref = body.ref || 'direct';

  memory.total += 1;
  memory.roles[role] = (memory.roles[role]||0)+1;
  memory.refs[ref] = (memory.refs[ref]||0)+1;

  return NextResponse.json({ ok:true, storage:'memory' });
}
