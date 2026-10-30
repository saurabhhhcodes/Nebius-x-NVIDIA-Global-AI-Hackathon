export const fallbackIncident = {
  id: 'INC-674644-1884',
  title: 'Production Checkout Service Pod CrashLoopBackOff (OOMKilled - Exit Code 137)',
  service_name: 'checkout-service',
  severity: 'P1 - Critical',
  environment: 'production-us-east-1',
  status: 'INVESTIGATING',
  incident_description: 'Checkout-service pod in production-us-east-1 crashing repeatedly with exit code 137 during flash sale traffic peak.',
  log_text: `2026-10-30T13:01:22.841Z [ERROR] [checkout-service] java.lang.OutOfMemoryError: Java heap space
2026-10-30T13:01:23.002Z [WARN]  [kubelet] Pod checkout-service-7d498b584b-r9x2q memory cgroup limit reached: 512MiB
2026-10-30T13:01:23.119Z [FATAL] [kernel] Memory cgroup out of memory: Killed process 4188 (java) total-vm:1894420kB, anon-rss:524112kB
2026-10-30T13:01:23.450Z [ERROR] [k8s-event] Container checkout-app in pod checkout-service-7d498b584b-r9x2q terminated with Exit Code 137 (OOMKilled)`,
  anomaly_signature: 'FATAL: Memory cgroup out of memory: Killed process 4188 (java) total-vm:1894420kB, anon-rss:524112kB',
  confidence_score: 0.98,
  root_cause: {
    summary: 'Container memory limit saturation (Exit Code 137) caused by unconstrained JVM heap growth exceeding the 512Mi cgroup boundary.',
    primary_subsystem: 'Kubernetes Cgroup / JVM Memory Management',
    trigger_event: '250% traffic spike during flash sale triggering concurrent shopping cart session allocations in heap',
    impact_assessment: 'Service availability dropped to 82%; 450+ checkout payment attempts aborted before rollback/patch'
  },
  suggested_fix: {
    summary: 'Increase deployment container memory limit from 512Mi to 1536Mi and configure JVM MaxRAMPercentage to 75% for cgroup awareness.',
    estimated_downtime: '0 minutes (Rolling update with zero downtime)',
    risk_level: 'LOW' as const,
    steps: [
      'Patch checkout-service deployment with updated memory limit and cgroup heap flags',
      'Verify rolling update with kubectl rollout status',
      'Monitor container memory utilization in Prometheus/Grafana to ensure RSS stabilizes under 75%'
    ]
  },
  fix_script: `kubectl patch deployment checkout-service -n production --type='json' -p='[
  {"op": "replace", "path": "/spec/template/spec/containers/0/resources/limits/memory", "value": "1536Mi"},
  {"op": "replace", "path": "/spec/template/spec/containers/0/resources/requests/memory", "value": "768Mi"}
]'
kubectl rollout status deployment/checkout-service -n production --timeout=120s`,
  rollback_script: `kubectl rollout undo deployment/checkout-service -n production`,
  model_used: 'NVIDIA Nemotron-3 Ultra via Nebius Token Factory',
  reasoning_steps: [
    {
      step_number: 1,
      phase: 'Log Ingestion & Anomaly Signature Extraction',
      action: 'Parsed stack traces, isolated Exit Code 137 and cgroup OOM fatal markers',
      findings: 'Found OutOfMemoryError and kernel cgroup killer termination signal.',
      status: 'COMPLETED' as const
    },
    {
      step_number: 2,
      phase: 'Tavily Real-Time Web Intelligence & CVE Check',
      action: 'Queried Tavily AI Search for live GitHub issues and official Kubernetes docs',
      findings: 'Correlated official Kubernetes memory limit guide and known JVM container cgroup issues (match score: 98%).',
      status: 'COMPLETED' as const
    },
    {
      step_number: 3,
      phase: 'Infrastructure Telemetry Correlation',
      action: 'Correlated container RSS against 512MiB limit during traffic surge',
      findings: 'Anon-RSS reached 524,112kB right at termination timestamp.',
      status: 'COMPLETED' as const
    },
    {
      step_number: 4,
      phase: 'Hermes Causal Hypothesis Validation',
      action: 'Evaluated causal fault pattern with NVIDIA Nemotron-3 Ultra on Nebius Token Factory',
      findings: 'Hypothesis confirmed: heap exhaustion under concurrency with insufficient pod cgroup headroom.',
      status: 'COMPLETED' as const
    },
    {
      step_number: 5,
      phase: 'Remediation Script Synthesis & Safety Checks',
      action: 'Formulated declarative Kubernetes patch with AST blocklist validation and rollback plan',
      findings: 'Generated declarative patch with 0ms projected downtime.',
      status: 'COMPLETED' as const
    }
  ],
  tavily_sources: [
    {
      title: 'Kubernetes Docs: Assign Memory Resources to Containers and Pods',
      url: 'https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/',
      snippet: 'When a container exceeds its memory limit, it may be terminated. If it is restartable, the kubelet restarts it with exit code 137.',
      score: 0.98,
      domain: 'kubernetes.io'
    },
    {
      title: 'GitHub Issue #4489: Spring Boot JVM MaxRAMPercentage cgroup v2 allocation in Kubernetes',
      url: 'https://github.com/kubernetes/kubernetes/issues/4489',
      snippet: 'JVM applications require -XX:MaxRAMPercentage=75.0 when running inside container boundaries to avoid kernel OOM kills.',
      score: 0.94,
      domain: 'github.com'
    },
    {
      title: 'AWS EKS Troubleshooting: Pods OOMKilled with Exit Code 137',
      url: 'https://repost.aws/knowledge-center/eks-pod-oomkilled-137',
      snippet: 'Verify pod spec resource limits and kernel dmesg output for total-vm and anon-rss metrics.',
      score: 0.91,
      domain: 'aws.amazon.com'
    }
  ],
  sandbox_result: {
    success: true,
    sandboxId: 'sbx-sim-c198f4',
    environment: 'Simulated Isolated Kubernetes Pod Sandbox',
    exitCode: 0,
    durationMs: 742,
    stdout: `[sandbox@k8s-sim] AST Security Policy Guard: PASSED (No destructive commands)
[sandbox@k8s-sim] Applying patch to deployment/checkout-service...
deployment.apps/checkout-service patched
[sandbox@k8s-sim] Waiting for rollout to finish: 1 of 3 updated replicas are available...
[sandbox@k8s-sim] Waiting for rollout to finish: 2 of 3 updated replicas are available...
[sandbox@k8s-sim] deployment "checkout-service" successfully rolled out.
[sandbox@k8s-sim] Simulating 1,000 synthetic HTTP checkout requests...
[sandbox@k8s-sim] Verification test PASSED: Error rate: 0.00%, P99 Latency: 42ms (down from 1,840ms).`,
    stderr: '',
    executedAt: '2026-10-30T13:03:15.000Z',
    status: 'VERIFIED'
  },
  alert_payload: {
    slack: {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🚨 [P1 Critical] Incident INC-674644-1884 Diagnosed by OpsCopilot'
          }
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: '*Service:*\ncheckout-service' },
            { type: 'mrkdwn', text: '*Confidence:*\n98% (Nemotron-3 Ultra)' },
            { type: 'mrkdwn', text: '*Root Cause:*\nCgroup Memory Saturation' },
            { type: 'mrkdwn', text: '*Sandbox Status:*\n✅ Verified (Exit Code 0)' }
          ]
        }
      ]
    },
    teams: {
      type: 'AdaptiveCard',
      version: '1.4',
      body: [
        {
          type: 'TextBlock',
          text: '🚨 OpsCopilot Incident Alert: checkout-service',
          weight: 'Bolder',
          size: 'Medium'
        },
        {
          type: 'TextBlock',
          text: 'Root Cause: Container memory limit saturation (Exit Code 137). Remediation patch verified in sandbox.'
        }
      ]
    }
  },
  created_at: '2026-10-30T13:01:22.000Z',
  updated_at: '2026-10-30T13:03:15.000Z'
};

export const fallbackStats = {
  total: 8,
  statusCounts: {
    'INVESTIGATING': 1,
    'RESOLVED': 6,
    'MITIGATED': 1
  },
  severityCounts: {
    'P1 - Critical': 2,
    'P2 - High': 3,
    'P3 - Medium': 2,
    'P4 - Low': 1
  },
  topServices: [
    { service_name: 'checkout-service', count: 3 },
    { service_name: 'payment-gateway', count: 2 },
    { service_name: 'auth-service', count: 2 },
    { service_name: 'inventory-db', count: 1 }
  ],
  recent: [
    {
      id: 'INC-674644-1884',
      title: 'Production Checkout Service Pod CrashLoopBackOff (OOMKilled - Exit Code 137)',
      service_name: 'checkout-service',
      severity: 'P1 - Critical',
      status: 'INVESTIGATING',
      created_at: '2026-10-30T13:01:22.000Z'
    },
    {
      id: 'INC-551920-8841',
      title: 'PostgreSQL Lock Contention on Orders Table during Concurrent Settlement',
      service_name: 'payment-gateway',
      severity: 'P2 - High',
      status: 'RESOLVED',
      created_at: '2026-10-30T09:14:00.000Z'
    },
    {
      id: 'INC-419082-3110',
      title: 'Redis Cluster MaxMemory Exhaustion with High Latency Timeouts',
      service_name: 'auth-service',
      severity: 'P2 - High',
      status: 'RESOLVED',
      created_at: '2026-10-29T18:22:10.000Z'
    }
  ],
  mttrMinutes: 4.2,
  automatedFixSuccessRate: 98.4
};
