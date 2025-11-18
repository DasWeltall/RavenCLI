// main.js

window.addEventListener("DOMContentLoaded", () => {
  // INSTALL TABS
  const tabs = document.querySelectorAll(".install-tab");
  const panels = document.querySelectorAll(".code-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");
      tabs.forEach((t) => t.classList.toggle("active", t === tab));
      panels.forEach((panel) => {
        panel.classList.toggle(
          "active",
          panel.getAttribute("data-tab") === target
        );
      });
    });
  });

  // COPY BUTTON
  const copyBtn = document.getElementById("copy-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const activePanel = document.querySelector(".code-panel.active code");
      const text = activePanel
        ? activePanel.textContent.replace(/\u2588?$/, "")
        : "";
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "copied";
        setTimeout(() => (copyBtn.textContent = "copy"), 1200);
      } catch {
        copyBtn.textContent = "error";
        setTimeout(() => (copyBtn.textContent = "copy"), 1200);
      }
    });
  }

  // REAL GITHUB STARS for DasWeltall/RavenCLI (REST API)
  const owner = "DasWeltall";
  const repo = "RavenCLI";
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

  async function updateStars() {
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) return;
      const data = await res.json();
      const stars = data.stargazers_count ?? "--";

      const navStars = document.getElementById("nav-stars");
      const githubStars = document.getElementById("github-stars");

      if (navStars) navStars.textContent = `★ ${stars}`;
      if (githubStars) githubStars.textContent = `★ ${stars}`;
    } catch (e) {
      console.warn("Could not fetch GitHub stars", e);
    }
  }

  updateStars();

  // UNIVERSE / 3D FEATURE GALAXY

  const canvas = document.getElementById("universeCanvas");
  const tooltip = document.getElementById("universeTooltip");
  if (!canvas || !tooltip) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.warn("2D context not supported");
    return;
  }

  function resizeUniverse() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.setTransform(
      window.devicePixelRatio,
      0,
      0,
      window.devicePixelRatio,
      0,
      0
    );
  }

  window.addEventListener("resize", resizeUniverse);
  resizeUniverse();

  // Basis-Features für Universe
  const baseFeatures = [
    // Reconnaissance
    { label: "recon", desc: "Map hosts, ports and services." },
    { label: "asset-discovery", desc: "Find unknown hosts and shadow assets." },
    { label: "web-enum", desc: "Enumerate virtual hosts, directories and technologies." },
    { label: "subdomains", desc: "Discover subdomains via DNS and certificates." },
    { label: "banner-grab", desc: "Collect service banners to fingerprint software." },
    { label: "os-fingerprint", desc: "Guess operating systems from network signatures." },

    // Scanning & enumeration
    { label: "port-scan", desc: "Scan TCP/UDP ports with tuned defaults." },
    { label: "service-detect", desc: "Fingerprint exposed services and versions." },
    { label: "vuln-scan", desc: "Run focused vulnerability checks against services." },
    { label: "web-vulns", desc: "Look for common web misconfigurations and CVEs." },
    { label: "wifi-audit", desc: "Inspect wireless networks for weak encryption." },
    { label: "tls-audit", desc: "Review TLS ciphers, versions and certificates." },

    // Config & hardening
    { label: "linux-hardening", desc: "Check Linux hosts against hardening baselines." },
    { label: "ssh-hardening", desc: "Audit SSH configuration and authentication." },
    { label: "password-policy", desc: "Verify password and lockout policies." },
    { label: "firewall-rules", desc: "Summarise and sanity-check firewall policies." },
    { label: "service-pruning", desc: "Flag unnecessary services and daemons." },
    { label: "logging", desc: "Check logging and log-rotation configuration." },

    // Cloud & container
    { label: "cloud-inventory", desc: "List cloud resources across accounts." },
    { label: "s3-permissions", desc: "Detect public or overly permissive buckets." },
    { label: "iam-review", desc: "Highlight dangerous IAM policies and roles." },
    { label: "k8s-rbac", desc: "Inspect Kubernetes cluster roles and bindings." },
    { label: "container-secrets", desc: "Search container images for embedded secrets." },
    { label: "image-hardening", desc: "Check base images against security baselines." },

    // Secrets & supply chain
    { label: "secrets-scan", desc: "Scan repos and configs for API keys and tokens." },
    { label: "dependency-audit", desc: "Check dependencies for known CVEs." },
    { label: "lockfile-diff", desc: "Detect risky dependency drifts over time." },
    { label: "sbom-generate", desc: "Generate a software bill-of-materials." },
    { label: "signed-builds", desc: "Verify signatures for artefacts and images." },

    // Network & traffic
    { label: "packet-capture", desc: "Capture and inspect network traffic for anomalies." },
    { label: "dns-monitor", desc: "Spot suspicious DNS queries and domains." },
    { label: "proxy-detect", desc: "Find transparent proxies and intercept points." },
    { label: "exfil-routes", desc: "Map potential data exfiltration paths." },
    { label: "latency-map", desc: "Visualise latency between key nodes." },

    // Authentication & access
    { label: "auth-matrix", desc: "Summarise who can access which systems." },
    { label: "2fa-coverage", desc: "Measure MFA coverage across accounts." },
    { label: "default-creds", desc: "Check for default or weak credentials." },
    { label: "session-hygiene", desc: "Review session timeouts and revocation." },
    { label: "priv-esc", desc: "Flag potential local privilege escalation paths." },

    // Reporting & workflows
    { label: "reporting", desc: "Generate terminal-native reports of findings." },
    { label: "timeline", desc: "Build a timeline of scans and changes." },
    { label: "export-json", desc: "Export results as JSON for automation." },
    { label: "export-markdown", desc: "Create Markdown reports for tickets." },
    { label: "ticket-sync", desc: "Send key findings into ticketing systems." },

    // Automation & CI
    { label: "ci-checks", desc: "Embed RavenCLI checks into CI pipelines." },
    { label: "nightly-runs", desc: "Schedule nightly baselines against environments." },
    { label: "drift-detect", desc: "Detect config drift between runs." },
    { label: "playbooks", desc: "Codify repeatable blue-team playbooks." },
    { label: "autofix-hints", desc: "Suggest remediation steps for common issues." },

    // Forensics & detection
    { label: "log-anomaly", desc: "Highlight unusual log patterns." },
    { label: "persistence-hunt", desc: "Search for common persistence mechanisms." },
    { label: "malware-traces", desc: "Look for simple malware indicators of compromise." },
    { label: "user-behavior", desc: "Flag risky user behaviour patterns." },

    // Governance & hygiene
    { label: "policy-checks", desc: "Compare hosts against internal security policies." },
    { label: "baseline-compare", desc: "Compare environments against golden images." },
    { label: "compliance-view", desc: "Summarise coverage vs chosen standards." },
    { label: "exceptions", desc: "Track documented risk acceptances." }
  ];

  // daraus ~1000 Universe-Nodes erzeugen
  const features = [];
  const targetCount = 44;

  for (let i = 0; i < targetCount; i++) {
    const base = baseFeatures[i % baseFeatures.length];
    features.push({
      label: `${base.label}-${Math.floor(i / baseFeatures.length) + 1}`,
      desc: base.desc
    });
  }

const nodes = [];
const center = { x: 0, y: 0 };
let angleY = 0;
let angleX = 0.35;

function initNodes() {
  const rect = canvas.getBoundingClientRect();
  center.x = rect.width / 2;
  center.y = rect.height / 2;

  nodes.length = 0;
  const maxRadius = Math.min(center.x, center.y) * 0.8; // etwas Abstand zum Rand

  features.forEach((feat) => {
    const phi = Math.random() * Math.PI * 2;
    const theta = Math.random() * Math.PI;

    // PUNKT-ENTFERNUNG:
    // Punkte liegen zwischen 20% und 100% des maximalen Radius
    const r = maxRadius * (0.5 + 0.8 * Math.random()); // 0.2–1.0 * maxRadius

    const x = r * Math.sin(theta) * Math.cos(phi);
    const y = r * Math.sin(theta) * Math.sin(phi);
    const z = r * Math.cos(theta);

    // LINIEN-LÄNGE:
    // Linien gehen 30–90% des Weges vom Zentrum zum Punkt
    const lineScale = 0.5 + 0.6 * Math.random(); // 0.3–0.9

    nodes.push({ x, y, z, feature: feat, lineScale });
  });
}

initNodes();


  function rotateY(point, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: point.x * cos - point.z * sin,
      y: point.y,
      z: point.x * sin + point.z * cos
    };
  }

  function rotateX(point, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: point.x,
      y: point.y * cos - point.z * sin,
      z: point.y * sin + point.z * cos
    };
  }

  function project(point) {
    const perspective = 600;
    const scale = perspective / (perspective + point.z);
    return {
      x: center.x + point.x * scale,
      y: center.y + point.y * scale,
      scale
    };
  }

  let hoveredNode = null;
  const mouse = { x: 0, y: 0, inside: false };

  // Drag-Rotation
  let isDragging = false;
  let lastDrag = { x: 0, y: 0 };

  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    isDragging = true;
    lastDrag.x = e.clientX - rect.left;
    lastDrag.y = e.clientY - rect.top;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouse.x = x;
    mouse.y = y;
    mouse.inside = true;

    if (isDragging) {
      const dx = x - lastDrag.x;
      const dy = y - lastDrag.y;

      // Drag nach links/rechts dreht um Y, hoch/runter um X
      angleY += dx * 0.005;
      angleX += dy * 0.005;
    }

    lastDrag.x = x;
    lastDrag.y = y;
  });

  canvas.addEventListener("mouseleave", () => {
    mouse.inside = false;
    hoveredNode = null;
    tooltip.style.opacity = 0;
  });

  function renderUniverse() {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    const projected = [];
    nodes.forEach((node) => {
      let p = rotateY(node, angleY);
      p = rotateX(p, angleX);
      const proj = project(p);
      projected.push({ proj, node, depth: p.z });
    });

    // center origin lines mit individuellem lineScale
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.strokeStyle = "#444444";
    ctx.lineWidth = 0.5;
    projected.forEach(({ proj, node }) => {
      const vx = (proj.x - center.x) * node.lineScale;
      const vy = (proj.y - center.y) * node.lineScale;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(vx, vy);
      ctx.stroke();
    });
    ctx.restore();

    hoveredNode = null;
    if (mouse.inside) {
      let minDist = 16;
      projected.forEach(({ proj, node }) => {
        const dx = proj.x - mouse.x;
        const dy = proj.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
          minDist = dist;
          hoveredNode = { proj, node };
        }
      });
    }

    projected.sort((a, b) => a.depth - b.depth);

    const nodeColor =
      getComputedStyle(document.documentElement).getPropertyValue(
        "--node-color"
      ) || "#bcd8ff";

    projected.forEach(({ proj, node }) => {
      const size = 3 + 6 * proj.scale;
      ctx.fillStyle =
        hoveredNode && hoveredNode.node === node ? "#ffffff" : nodeColor;
      ctx.strokeStyle = "#222222";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.rect(proj.x - size / 2, proj.y - size / 2, size, size);
      ctx.fill();
      ctx.stroke();
    });

    if (hoveredNode) {
      tooltip.textContent = `${hoveredNode.node.feature.label}: ${hoveredNode.node.feature.desc}`;
      tooltip.style.left = hoveredNode.proj.x + "px";
      tooltip.style.top = hoveredNode.proj.y + "px";
      tooltip.style.opacity = 1;
    } else {
      tooltip.style.opacity = 0;
    }

    // leichte Auto-Rotation, solange nicht gezogen wird
    if (!isDragging) {
      angleY += 0.003;
      angleX += 0.0007;
    }

    requestAnimationFrame(renderUniverse);
  }

  renderUniverse();
});

