const assert = require('assert');

const BASE_URL = 'http://localhost:5001/api';

async function runTests() {
  console.log('🧪 [OpsCopilot Test Suite] Starting comprehensive integration verification...');

  // 1. Test Health Check
  console.log('  1. Testing GET /api/health...');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const health = await healthRes.json();
  assert.strictEqual(healthRes.status, 200);
  assert.strictEqual(health.status, 'healthy');
  assert.strictEqual(health.ai_provider, 'Nebius Token Factory (NVIDIA Nemotron)');
  console.log('     ✅ Healthcheck passed.');

  // 2. Test Demo SRE Login
  console.log('  2. Testing POST /api/auth/demo-login...');
  const demoLoginRes = await fetch(`${BASE_URL}/auth/demo-login`, { method: 'POST' });
  const demoAuth = await demoLoginRes.json();
  assert.strictEqual(demoLoginRes.status, 200);
  assert.strictEqual(demoAuth.success, true);
  assert.ok(demoAuth.token);
  assert.strictEqual(demoAuth.user.role, 'lead_sre');
  const token = demoAuth.token;
  console.log('     ✅ Demo login & JWT verification passed.');

  // 3. Test GET /api/auth/me
  console.log('  3. Testing GET /api/auth/me with Bearer Token...');
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const me = await meRes.json();
  assert.strictEqual(meRes.status, 200);
  assert.strictEqual(me.success, true);
  assert.strictEqual(me.user.email, 'alex.chen@opscopilot.io');
  console.log('     ✅ Auth token header validation passed.');

  // 4. Test SRE Stats
  console.log('  4. Testing GET /api/incidents/stats...');
  const statsRes = await fetch(`${BASE_URL}/incidents/stats`);
  const stats = await statsRes.json();
  assert.strictEqual(statsRes.status, 200);
  assert.strictEqual(stats.success, true);
  assert.ok(typeof stats.data.total === 'number');
  assert.ok(stats.data.mttrMinutes > 0);
  console.log(`     ✅ Telemetry stats verified (Total incidents: ${stats.data.total}, MTTR: ${stats.data.mttrMinutes}m).`);

  // 5. Test AI Agent Incident Analysis (Hermes Agent Orchestration)
  console.log('  5. Testing POST /api/agent/analyze (K8s OOMKilled log)...');
  const analyzeRes = await fetch(`${BASE_URL}/agent/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'Kubernetes Container OOMKilled in checkout-worker-v2',
      service_name: 'checkout-worker',
      severity: 'CRITICAL',
      environment: 'production',
      incident_description: 'Checkout worker pods crashing repeatedly under promo traffic.',
      log_text: `[2026-09-27T10:14:22.812Z] [ERROR] [cgroup-memory] Memory cgroup out of memory: Killed process 19284 (node) total-vm:1842048kB, anon-rss:524288kB\n[2026-09-27T10:14:23.001Z] [FATAL] Container checkout-worker exited with status 137 (OOMKilled)`
    })
  });
  const incidentData = await analyzeRes.json();
  assert.strictEqual(analyzeRes.status, 201);
  assert.strictEqual(incidentData.success, true);
  const incident = incidentData.data;
  assert.ok(incident.id.startsWith('INC-'));
  assert.strictEqual(incident.status, 'ROOT_CAUSE_IDENTIFIED');
  assert.ok(incident.confidence_score >= 0.9);
  assert.ok(incident.root_cause.summary);
  assert.ok(incident.tavily_sources.length > 0);
  assert.ok(incident.agent_reasoning_steps.length >= 4);
  assert.ok(incident.alert_payload.attachments.length > 0);
  console.log(`     ✅ AI Diagnosis synthesized incident ${incident.id} with ${incident.confidence_score * 100}% confidence (${incident.tavily_sources.length} Tavily sources correlated).`);

  // 6. Test Tavily Real-Time Web Intelligence Refresh
  console.log('  6. Testing POST /api/agent/tavily-search/:id (Tavily AI Search)...');
  const tavilyRes = await fetch(`${BASE_URL}/agent/tavily-search/${incident.id}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const tavilyData = await tavilyRes.json();
  assert.strictEqual(tavilyRes.status, 200);
  assert.strictEqual(tavilyData.success, true);
  assert.ok(tavilyData.data.tavilyResult.sources.length > 0);
  console.log(`     ✅ Tavily AI Search retrieved ${tavilyData.data.tavilyResult.sources.length} live verified sources (${tavilyData.data.tavilyResult.provider}).`);

  // 7. Test Sandbox Execution
  console.log('  7. Testing POST /api/agent/sandbox/:id (isolated container test)...');
  const sandboxRes = await fetch(`${BASE_URL}/agent/sandbox/${incident.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  const sandbox = await sandboxRes.json();
  assert.strictEqual(sandboxRes.status, 200);
  assert.strictEqual(sandbox.success, true);
  assert.strictEqual(sandbox.data.sandboxResult.exitCode, 0);
  assert.strictEqual(sandbox.data.incident.status, 'RESOLVED');
  assert.ok(sandbox.data.sandboxResult.stdout.includes('Pre-check metrics'));
  console.log(`     ✅ Sandbox executed fix in ${sandbox.data.sandboxResult.durationMs}ms (Exit code 0).`);

  // 8. Test Sandbox Destructive Command Security Block
  console.log('  8. Testing Sandbox Security Policy Guard (attempting malicious command)...');
  const badSandboxRes = await fetch(`${BASE_URL}/agent/sandbox/${incident.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      custom_script: 'rm -rf / --no-preserve-root'
    })
  });
  const badSandbox = await badSandboxRes.json();
  assert.strictEqual(badSandbox.data.sandboxResult.status, 'SECURITY_BLOCKED');
  console.log('     ✅ Sandbox security policy successfully blocked malicious command.');

  // 9. Test Escalation to Ultra Max
  console.log('  9. Testing POST /api/agent/escalate/:id (Nemotron Ultra Max re-analysis)...');
  const escalateRes = await fetch(`${BASE_URL}/agent/escalate/${incident.id}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const escalated = await escalateRes.json();
  assert.strictEqual(escalateRes.status, 200);
  assert.strictEqual(escalated.success, true);
  console.log('     ✅ Multi-hop causal escalation completed.');

  // 10. Test Incident Fetch by ID & Status Update
  console.log('  10. Testing GET /api/incidents/:id and status PATCH...');
  const getIncRes = await fetch(`${BASE_URL}/incidents/${incident.id}`);
  const getInc = await getIncRes.json();
  assert.strictEqual(getIncRes.status, 200);
  assert.strictEqual(getInc.data.id, incident.id);

  const patchRes = await fetch(`${BASE_URL}/incidents/${incident.id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status: 'CLOSED' })
  });
  const patched = await patchRes.json();
  assert.strictEqual(patched.data.status, 'CLOSED');
  console.log('     ✅ Incident retrieval & status updates verified.');

  console.log('\n🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! (10/10 passed)');
}

runTests().catch((err) => {
  console.error('\n❌ Test suite failure:', err);
  process.exit(1);
});
