import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createServer } from 'node:http';
import { applyRuntimeSecurity } from '../src/server/runtimeSecurity.ts';

const keys = ['NODE_ENV','APP_URL','QMOOSA_CORS_ALLOWED_ORIGINS','QMOOSA_ENABLE_SIMULATION_MUTATIONS','QMOOSA_ADMIN_TOKEN'];

function saveEnv() {
  return Object.fromEntries(keys.map(k => [k, process.env[k]]));
}
function restoreEnv(env: Record<string,string|undefined>) {
  for (const [k,v] of Object.entries(env)) {
    if (v === undefined) delete process.env[k]; else process.env[k] = v;
  }
}
async function serve(run:(base:string)=>Promise<void>) {
  const app=express();
  app.use(express.json());
  applyRuntimeSecurity(app);
  app.post('/api/agent/execute-plan',(_req,res)=>res.json({executed:true}));
  app.get('/api/health',(_req,res)=>res.json({ok:true}));
  const server=createServer(app);
  await new Promise<void>((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  try {
    const addr=server.address();
    if (!addr || typeof addr==='string') throw new Error('unexpected address');
    await run(`http://127.0.0.1:${addr.port}`);
  } finally {
    await new Promise<void>(resolve=>server.close(()=>resolve()));
  }
}

test('production mutation APIs are disabled by default', async()=>{
  const env=saveEnv();
  try {
    process.env.NODE_ENV='production';
    delete process.env.QMOOSA_ENABLE_SIMULATION_MUTATIONS;
    await serve(async base=>{
      const r=await fetch(base+'/api/agent/execute-plan',{method:'POST',headers:{'content-type':'application/json'},body:'{}'});
      assert.equal(r.status,503);
    });
  } finally { restoreEnv(env); }
});

test('production rejects untrusted browser origins', async()=>{
  const env=saveEnv();
  try {
    process.env.NODE_ENV='production';
    process.env.APP_URL='https://nexus.example';
    await serve(async base=>{
      const denied=await fetch(base+'/api/health',{headers:{origin:'https://attacker.example'}});
      assert.equal(denied.status,403);
      const allowed=await fetch(base+'/api/health',{headers:{origin:'https://nexus.example'}});
      assert.equal(allowed.status,200);
    });
  } finally { restoreEnv(env); }
});

test('production mutation mode rejects weak tokens',()=>{
  const env=saveEnv();
  try {
    process.env.NODE_ENV='production';
    process.env.QMOOSA_ENABLE_SIMULATION_MUTATIONS='true';
    process.env.QMOOSA_ADMIN_TOKEN='short';
    assert.throws(()=>applyRuntimeSecurity(express()),/non-placeholder secret/);
  } finally { restoreEnv(env); }
});
