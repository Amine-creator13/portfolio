/* ── CURSOR ── */
    const cur = document.getElementById('cursor'), ring = document.getElementById('cursor-ring');
    document.addEventListener('mousemove', e => {
      cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px';
      ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a,button,.proj-card,.node-group').forEach(el => {
      el.addEventListener('mouseenter', () => { ring.style.transform = 'translate(-50%,-50%) scale(2.5)'; cur.style.background = 'transparent' });
      el.addEventListener('mouseleave', () => { ring.style.transform = 'translate(-50%,-50%) scale(1)'; cur.style.background = 'var(--acid)' });
    });

    /* ── NETWORK CANVAS ── */
    const canvas = document.getElementById('net-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, nodes = [], animId;

    function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight }
    resize();
    window.addEventListener('resize', () => { resize(); buildNodes() });

    function rnd(a, b) { return a + Math.random() * (b - a) }
    function buildNodes() {
      nodes = [];
      const count = Math.floor(W / 80);
      for (let i = 0; i < count; i++) {
        nodes.push({ x: rnd(60, W - 60), y: rnd(60, H - 60), vx: rnd(-0.3, 0.3), vy: rnd(-0.3, 0.3), r: rnd(2, 5), pulse: rnd(0, Math.PI * 2) });
      }
    }
    buildNodes();

    function drawNet() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0b0f18'; ctx.fillRect(0, 0, W, H);
      // edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 160) {
            const alpha = (1 - d / 160) * 0.35;
            ctx.strokeStyle = `rgba(200,255,0,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
          }
        }
      }
      // nodes
      const t = Date.now() / 1000;
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 10 || n.x > W - 10) n.vx *= -1;
        if (n.y < 10 || n.y > H - 10) n.vy *= -1;
        const pulse = 0.5 + 0.5 * Math.sin(t * 2 + n.pulse);
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,255,0,${0.4 + 0.6 * pulse})`; ctx.fill();
        // glow
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 8);
        g.addColorStop(0, `rgba(200,255,0,${0.08 * pulse})`); g.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 8, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });
      animId = requestAnimationFrame(drawNet);
    }
    drawNet();

    /* ── SEND MAIL ── */
    function sendMail() {
      const email = document.getElementById('contact-email').value;
      const subj = document.getElementById('contact-subject').value || 'Prise de contact — Portfolio';
      const msg = document.getElementById('contact-msg').value || '';
      const body = email ? `De : ${email}\n\nMessage :\n${msg}` : msg;

      const mailtoLink = document.createElement('a');
      mailtoLink.href = `mailto:aminechahid.mohamedelamine@gmail.com?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
      mailtoLink.click();
    }

    /* ── TOPOLOGY MAP ── */
    const skillData = {
      pentest: {
        label: 'Pentest', icon: '⚔', x: 180, y: 240, color: '#ff2d55',
        detail: '<strong>Nmap · Nessus · OpenVAS · Metasploit · Burp Suite</strong> — Audit grey-box SAE 3.04, compromission totale. Rapport 33 pages. Reconnaissance, exploitation CVE, élévation de privilèges, OWASP Top 10 / PTES.'
      },
      firewall: {
        label: 'Firewall', icon: '🛡', x: 100, y: 150, color: '#c8ff00',
        detail: '<strong>pfSense · iptables · ACL</strong> — VLANs ADMIN/USERS/SERVERS, règles deny-all/permit-by-exception, DMZ, SNAT/DNAT, rate-limiting, logging. Emerging Threats rules avec Suricata.'
      },
      ids: {
        label: 'IDS/IPS', icon: '🔍', x: 270, y: 120, color: '#c8ff00',
        detail: '<strong>Suricata · Snort · SIEM · EDR</strong> — Déploiement, règles personnalisées, analyse de logs, détection d\'intrusions actives, Threat Hunting, réponse aux incidents (IR/DFIR).'
      },
      grc: {
        label: 'GRC', icon: '📋', x: 380, y: 60, color: '#c8ff00',
        detail: '<strong>EBIOS RM · ISO 27001 · ISO 27005 · RGPD · NIS2 · DORA</strong> — Analyse de risques DICP, matrice de criticité, audit de conformité, PSSI, plan de remédiation.'
      },
      crypto: {
        label: 'Crypto', icon: '🔐', x: 440, y: 260, color: '#0a84ff',
        detail: '<strong>RSA · AES · Chiffres affines · MitM · Shor</strong> — TPs R410 : génération de clés RSA, cryptanalyse par fréquence, analyse Man-in-the-Middle, introduction à l\'algorithme de Shor (quantique).'
      },
      python: {
        label: 'Python', icon: '🐍', x: 560, y: 170, color: '#c8ff00',
        detail: '<strong>Python · Flask · Bash · PowerShell · API REST</strong> — SAE 3.02 Tirelire Connectée (lead équipe 5), app TCP/UDP, automatisation. Scripts réseaux, cron, SSH/rsync.'
      },
      linux: {
        label: 'Linux', icon: '🐧', x: 680, y: 110, color: '#f0ece3',
        detail: '<strong>Linux Debian / Kali · Windows Server / AD</strong> — Administration système, shell avancé, scripting Bash, gestion des services, permissions, sécurisation, VMware/VirtualBox, Arduino.'
      },
      reseau: {
        label: 'Réseaux', icon: '🌐', x: 760, y: 260, color: '#bf5fff',
        detail: '<strong>TCP/IP · VLAN · STP · VPN · DMZ · Cisco</strong> — OSPF, BGP, MPLS, RIP, EIGRP, MP-BGP. Routage, commutation, architecture redondante, DHCP, DNS, FTP, VRF. Wireshark, TCPdump.'
      },
      osint: {
        label: 'OSINT', icon: '🕵', x: 610, y: 360, color: '#ff2d55',
        detail: '<strong>OSINT · CTF · TryHackMe · Root-Me</strong> — Pratique autonome et régulière. Challenges de reconnaissance, exploitation web, forensic, Hydra, SQLmap, John the Ripper.'
      },
      telco: {
        label: 'Télécom', icon: '📡', x: 870, y: 160, color: '#0a84ff',
        detail: '<strong>GSM · OFDM · QAM · Radio Mobile Online · MATLAB</strong> — Simulations de couverture radio GSM (R404), modulations ASK/BPSK/QAM-16 avec Rohde & Schwarz, analyses MATLAB.'
      },
      web: {
        label: 'Web Dev', icon: '💻', x: 490, y: 410, color: '#f0ece3',
        detail: '<strong>HTML5 · CSS3 · JavaScript · PHP · SQL</strong> — Développement d\'applications web, portfolios, interfaces client-serveur, MySQL, MariaDB, Apache, LDAP, GLPI.'
      },
    };
    const edges = [
      ['pentest', 'firewall'], ['pentest', 'ids'], ['pentest', 'osint'], ['pentest', 'grc'],
      ['firewall', 'ids'], ['firewall', 'reseau'], ['firewall', 'linux'],
      ['ids', 'reseau'], ['ids', 'grc'], ['crypto', 'python'], ['crypto', 'pentest'],
      ['python', 'linux'], ['python', 'web'], ['linux', 'reseau'],
      ['reseau', 'telco'], ['osint', 'web'], ['osint', 'python'], ['grc', 'crypto'],
    ];
    const svgEl = document.getElementById('topo-svg');
    const NS = 'http://www.w3.org/2000/svg';
    // edges
    const gEdges = document.createElementNS(NS, 'g');
    edges.forEach(([a, b]) => {
      const na = skillData[a], nb = skillData[b];
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', na.x); line.setAttribute('y1', na.y);
      line.setAttribute('x2', nb.x); line.setAttribute('y2', nb.y);
      line.setAttribute('stroke', 'rgba(240,236,227,0.08)'); line.setAttribute('stroke-width', '1');
      line.classList.add('topo-edge'); line.dataset.a = a; line.dataset.b = b;
      gEdges.appendChild(line);
    });
    svgEl.appendChild(gEdges);
    // nodes
    Object.entries(skillData).forEach(([key, s]) => {
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'node-group');
      g.setAttribute('transform', `translate(${s.x},${s.y})`);
      g.dataset.key = key;
      const outerRing = document.createElementNS(NS, 'circle');
      outerRing.setAttribute('r', '30'); outerRing.setAttribute('fill', 'transparent');
      outerRing.setAttribute('stroke', s.color); outerRing.setAttribute('stroke-width', '1'); outerRing.setAttribute('opacity', '0.25');
      outerRing.classList.add('node-ring');
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('r', '22'); c.setAttribute('fill', '#0d1220');
      c.setAttribute('stroke', s.color); c.setAttribute('stroke-width', '1.5');
      c.classList.add('node-circle');
      const ico = document.createElementNS(NS, 'text');
      ico.setAttribute('y', '1'); ico.textContent = s.icon; ico.classList.add('node-icon');
      const lbl = document.createElementNS(NS, 'text');
      lbl.setAttribute('y', '42'); lbl.textContent = s.label; lbl.classList.add('node-label');
      g.appendChild(outerRing); g.appendChild(c); g.appendChild(ico); g.appendChild(lbl);
      svgEl.appendChild(g);
      g.addEventListener('click', () => {
        document.querySelectorAll('.topo-edge').forEach(e => {
          const active = e.dataset.a === key || e.dataset.b === key;
          e.setAttribute('stroke', active ? s.color : 'rgba(240,236,227,0.08)');
          e.setAttribute('stroke-width', active ? '2' : '1');
        });
        const related = new Set([key]);
        edges.forEach(([a, b]) => { if (a === key) related.add(b); if (b === key) related.add(a) });
        document.querySelectorAll('.node-group').forEach(ng => { ng.style.opacity = related.has(ng.dataset.key) ? '1' : '0.25' });
        const det = document.getElementById('skill-detail');
        det.innerHTML = s.detail; det.classList.add('active');
      });
    });
    let pt = 0;
    function animNodes() {
      pt += 0.018;
      document.querySelectorAll('.node-ring').forEach((r, i) => {
        r.setAttribute('opacity', 0.15 + 0.12 * Math.sin(pt + i * 0.7));
        r.setAttribute('r', 27 + 3 * Math.sin(pt + i * 0.5));
      });
      requestAnimationFrame(animNodes);
    }
    animNodes();

    /* ── SCROLL REVEAL ── */
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => ro.observe(el));