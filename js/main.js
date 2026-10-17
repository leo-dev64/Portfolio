const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
const EMAIL = 'Lienardleo09@gmail.com';
const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);
const now = new Date();
const age = now.getFullYear() - 2009 - (now < new Date(now.getFullYear(), 7, 17) ? 1 : 0);
$('#age').textContent = age; $('#yr').textContent = now.getFullYear();

/* boot: short, once per session */
const boot = $('#boot');
const seen = (() => { try { return sessionStorage.getItem('b'); } catch (e) { return 1; } })();
let endBoot = () => { boot.classList.add('done'); startTyping(); endBoot = () => {}; };
if (reduce || seen) endBoot();
else {
  try { sessionStorage.setItem('b', 1); } catch (e) {}
  const lines = ['$ dhclient eth0', 'DHCPACK → 192.168.10.42/24', '$ ping -c1 leodev.fr', '64 bytes: icmp_seq=1 ttl=64 time=0.42 ms', '> Connexion établie.'];
  let i = 0;
  (function step() { if (i > lines.length) return endBoot(); $('#bootTxt').textContent = lines.slice(0, i++).join('\n'); setTimeout(step, i > lines.length ? 350 : 170); })();
  boot.addEventListener('click', () => endBoot());
  addEventListener('keydown', () => endBoot(), { once: true });
}

/* typewriter */
function startTyping() {
  if (reduce) return;
  const roles = ['Réseaux & infrastructure', 'Cisco Packet Tracer', 'Parcours Cisco NetAcad', 'Cybersécurité · Root-Me Pro', 'Bac pro CIEL IT'];
  const el = $('#type'); let r = 0, k = roles[0].length, del = true;
  setTimeout(function t() {
    el.textContent = roles[r].slice(0, k);
    if (!del && k++ === roles[r].length) { del = true; return setTimeout(t, 1800); }
    if (del && k-- === 0) { del = false; r = (r + 1) % roles.length; k = 0; }
    setTimeout(t, del ? 30 : 65);
  }, 1800);
}

/* split headings into letters (spaces stay real spaces so lines can wrap) */
$$('.split').forEach(h => {
  let d = 0;
  const walk = node => [...node.childNodes].forEach(ch => {
    if (ch.nodeType !== 3) return ch.nodeName === 'BR' || walk(ch);
    const f = document.createDocumentFragment();
    ch.textContent.split(/(\s+)/).forEach(w => {
      if (!w) return;
      if (/^\s+$/.test(w)) return f.append(' ');
      const word = document.createElement('span'); word.style.whiteSpace = 'nowrap';
      [...w].forEach(l => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = l; s.style.transitionDelay = (d++ * 22) + 'ms'; word.append(s); });
      f.append(word);
    });
    ch.replaceWith(f);
  });
  walk(h);
});

/* reveal + counters */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
  e.target.querySelectorAll('[data-n]').forEach(count);
}), { threshold: .12, rootMargin: '0px 0px -5% 0px' });
$$('.rv,.split').forEach(el => io.observe(el));
function count(el) {
  if (reduce) return;
  const to = +el.dataset.n, suf = el.dataset.s || '', t0 = performance.now();
  requestAnimationFrame(function f(t) {
    const p = Math.min(1, (t - t0) / 1400);
    el.textContent = Math.round(to * (1 - (1 - p) ** 3)) + suf;
    if (p < 1) requestAnimationFrame(f);
  });
}

/* nav: burger, scrolled state, active link; timeline progress — one rAF per scroll */
const nav = $('#nav'), burger = $('#burger'), tl = $('#tl'), fill = $('#tlFill'), jobs = tl.querySelectorAll('.job');
const links = [...$$('nav ul a')], secs = links.map(a => $(a.hash));
burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
links.forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));
let ticking = false;
function onScroll() {
  ticking = false;
  nav.classList.toggle('scrolled', scrollY > 10);
  const mid = innerHeight * .6, r = tl.getBoundingClientRect();
  fill.style.setProperty('--p', Math.max(0, Math.min(1, (mid - r.top) / r.height)));
  jobs.forEach(j => j.classList.toggle('on', j.getBoundingClientRect().top + 36 < mid));
  let cur = -1; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .4) cur = i; });
  links.forEach((a, i) => a.classList.toggle('act', i === cur));
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

/* pointer effects, desktop only */
if (fine && !reduce) {
  document.body.classList.add('fx');
  const dot = $('.cur.dot'), ring = $('.cur.ring'), bg = $('#bg');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, raf = 0;
  const loop = () => {
    rx += (mx - rx) * .2; ry += (my - ry) * .2;
    ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    raf = Math.abs(mx - rx) + Math.abs(my - ry) > .5 ? requestAnimationFrame(loop) : 0;
  };
  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
    bg.style.setProperty('--mx', mx + 'px'); bg.style.setProperty('--my', my + 'px');
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  $$('a,button,.tilt,.photo,input,.node,.chip').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hot'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hot'));
  });
  const tilt = (el, target, deg) => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      el.style.setProperty('--x', x + 'px'); el.style.setProperty('--y', y + 'px');
      target.style.transform = `perspective(800px) rotateX(${(y / r.height - .5) * -deg}deg) rotateY(${(x / r.width - .5) * deg}deg)`;
    });
    el.addEventListener('mouseleave', () => target.style.transform = '');
  };
  $$('.tilt').forEach(c => tilt(c, c, +c.dataset.d));
  tilt($('#photo'), $('#photo .frame'), 12);
  // magnetic buttons
  $$('.btn').forEach(b => {
    b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
    b.addEventListener('mouseleave', () => b.style.transform = '');
  });
  $$('.kpis [data-n]').forEach(n => n.parentNode.addEventListener('mouseenter', () => count(n)));
}

/* photo: tap toggles the colour reveal on touch screens */
$('#photo').addEventListener('click', e => e.currentTarget.classList.toggle('on'));

/* topology info */
const roles = {
  pc1: '<b>PC-01</b> · VLAN 10 · 192.168.10.10/24 · passerelle 192.168.10.1',
  srv: '<b>SRV</b> · serveur DHCP / DNS · 192.168.10.2/24',
  pc2: '<b>PC-02</b> · VLAN 20 · 192.168.20.10/24 · isolé du VLAN 10 par le switch',
  sw: '<b>SW1</b> · switch 2960 · ports access par VLAN, trunk 802.1Q vers R1',
  r1: '<b>R1</b> · routeur · routage inter-VLAN (router-on-a-stick) + NAT vers le WAN',
  wan: '<b>WAN</b> · accès Internet via R1',
};
const info = $('#info'), lnks = $$('.lnk');
$$('.node').forEach(n => {
  const show = () => { info.innerHTML = '<b>&gt;</b> ' + roles[n.dataset.k]; lnks.forEach(l => l.classList.toggle('hot', l.dataset.l === n.dataset.k || n.dataset.k === 'sw')); };
  n.addEventListener('mouseenter', show); n.addEventListener('focus', show); n.addEventListener('click', show);
});

/* particles: network of points reacting to the pointer */
const cv = $('#net'), cx = cv.getContext('2d');
let W = 0, H = 0, pts = [], mouse = { x: -999, y: -999 }, netRaf = 0;
function sizeNet() {
  const dpr = Math.min(devicePixelRatio || 1, 2), w = innerWidth;
  const reseed = w !== W; // mobile URL-bar resizes only change the height: keep the points
  W = w; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (reseed || !pts.length) pts = Array.from({ length: Math.min(80, Math.floor(W * H / 17000)) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }));
  if (reduce) drawNet(false);
}
function drawNet(move = true) {
  cx.clearRect(0, 0, W, H);
  for (const p of pts) {
    if (move) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < 25600 && d2 > 1) { const d = Math.sqrt(d2); p.x += dx / d * .9; p.y += dy / d * .9; }
    }
  }
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const a = pts[i], b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
    if (d2 < 16900) { cx.strokeStyle = `rgba(255,45,70,${(1 - Math.sqrt(d2) / 130) * .35})`; cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke(); }
  }
  cx.fillStyle = 'rgba(255,45,70,.8)';
  for (const p of pts) { cx.beginPath(); cx.arc(p.x, p.y, 1.6, 0, 7); cx.fill(); }
}
function netLoop() { drawNet(); netRaf = requestAnimationFrame(netLoop); }
addEventListener('resize', sizeNet);
addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
sizeNet();
if (!reduce) {
  netLoop();
  // no CPU use while the tab is hidden
  document.addEventListener('visibilitychange', () => { cancelAnimationFrame(netRaf); if (!document.hidden) netLoop(); });
}

/* terminal */
const out = $('#out'), inp = $('#in');
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const print = h => { const d = document.createElement('div'); d.innerHTML = h; out.append(d); while (out.childElementCount > 30) out.firstChild.remove(); };
const slow = arr => (arr.forEach((l, i) => setTimeout(() => print(l), reduce ? 0 : i * 260)), null); // null = déjà géré
const hist = []; let hi = 0;
const FILES = {
  'README.md': '# portfolio de Léo\nUn terminal interactif : tape « help ».\nLe reste, c\'est à toi de le trouver.',
  'cv.txt': 'Léo Liénard — Bac pro CIEL IT\nStages  : OCI (2025) · LDE (2023, 2025, 2026)\nCertifs : Cisco NetAcad · Root-Me Pro · ANSSI · PIX 800\nLangues : français natif · anglais B1',
  'skills.txt': 'Packet Tracer (maîtrise) · IPv4 & sous-réseaux · VLAN · routage · Exchange · télécoms · bases de données',
};
const HIDDEN = {
  '.secret': 'LEO{tu_lis_le_code_toi_aussi}\n\nBravo, tu as trouvé le fichier caché. Un profil réseau curieux comme toi ? Tape « contact ».',
  '.bash_history': 'ping 8.8.8.8\nip a\nsudo apt update\nvim reseau.conf\n:q!\n:q!\n:q!\nhistory | grep "comment quitter vim"',
  '/etc/passwd': 'root:x:0:0:root:/root:/bin/bash\nleo:x:1000:1000:Léo Liénard,,,:/home/leo:/bin/bash\n(rien d\'intéressant ici, désolé)',
};
const fileOf = (map, n) => Object.keys(map).find(k => k.toLowerCase() === n.toLowerCase());
const IPCFG = 'eth0: inet 192.168.10.42/24  gateway 192.168.10.1  vlan 10\n      statut : motivé · disponible pour un stage / une alternance';
const cmds = {
  help: () => 'Portfolio : whoami · skills · certifs · xp · contact\nFichiers  : ls · cat &lt;fichier&gt; · pwd · cd\nRéseau    : ip a · ping · traceroute · nslookup · ss · show vlan\nSystème   : uname -a · uptime · date · hostname · id · neofetch · history · echo\nTerminal  : clear · man &lt;cmd&gt; · ↑/↓ historique · Tab pour compléter',
  whoami: () => `leo — Léo Liénard, ${age} ans, Bac pro CIEL IT, orienté réseau & infrastructure.`,
  id: () => 'uid=1000(leo) gid=1000(leo) groupes=1000(leo),27(sudo),100(ciel),101(netacad)',
  skills: () => FILES['skills.txt'],
  certifs: () => 'Cisco NetAcad · Root-Me Pro · SecNumacadémie ANSSI (100%) · PIX 800',
  xp: () => 'OCI — réseau, télécoms, Exchange (2025)\nLDE — bases de données (2023 · 2025 · 2026)',
  pwd: () => '/home/leo',
  cd: () => '(portfolio en lecture seule : tu restes dans /home/leo)',
  ls: a => 'README.md  cv.txt  skills.txt' + (a.some(x => /^-\w*a/.test(x)) ? '  .bash_history  .secret' : ''),
  cat: a => {
    if (!a[0]) return 'cat: fichier manquant';
    const k = fileOf(FILES, a[0]), h = fileOf(HIDDEN, a[0]);
    if (k) return esc(FILES[k]);
    if (h) return esc(HIDDEN[h]);
    if (/^\/etc\/shadow$/.test(a[0])) return 'cat: /etc/shadow: Permission non accordée';
    return `cat: ${esc(a[0])}: Aucun fichier ou dossier de ce nom`;
  },
  ip: () => IPCFG,
  ping: a => {
    const h = esc(a[0] || 'leodev.fr');
    slow([`PING ${h} : 56 octets de données`, ...[1, 2, 3].map(i => `64 octets de ${h} : icmp_seq=${i} ttl=64 temps=${(Math.random() * .5 + .2).toFixed(2)} ms`),
      ...(/^(localhost|127\.0\.0\.1)$/.test(a[0]) ? ['There\'s no place like 127.0.0.1'] : []), `--- ${h} : 3 paquets transmis, 0% perte ---`]);
  },
  traceroute: () => slow(['traceroute vers leo (motivation)', ' 1  bac-pro-ciel        1 ms', ' 2  packet-tracer       2 ms', ' 3  cisco-netacad       3 ms', ' 4  root-me-pro         4 ms', ' 5  ton-entreprise      [OK] joignable']),
  nslookup: a => { const h = a[0] || 'leodev.fr'; return /^(www\.)?leodev\.fr$/i.test(h) ? `Serveur : 1.1.1.1\nNom     : ${esc(h)}\nAdresse : 51.91.103.52` : `** le serveur ne trouve pas ${esc(h)} : NXDOMAIN`; },
  ss: () => 'État   Adresse locale:Port   Processus\nLISTEN 0.0.0.0:80           nginx\nLISTEN 0.0.0.0:443          nginx',
  show: a => (a[0] || '').toLowerCase() === 'vlan' ? 'VLAN  Nom        Ports\n10    USERS      Fa0/1-12\n20    ADMIN      Fa0/13-24\n99    MGMT       Gi0/1 (trunk)' : 'usage : show vlan',
  uname: () => 'Linux leodev 6.12 #1 SMP x86_64 GNU/Linux',
  uptime: () => `${new Date().toLocaleTimeString('fr-FR')} up ${Math.round(performance.now() / 1000)} s, 1 utilisateur, charge moyenne : 0,00, 0,01, 0,00`,
  date: () => new Date().toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'medium' }),
  hostname: () => 'leodev',
  history: () => hist.map((c, i) => `${String(i + 1).padStart(4)}  ${esc(c)}`).join('\n'),
  echo: a => esc(a.join(' ').replace(/\$(\w+)/g, (m, k) => ({ USER: 'leo', HOME: '/home/leo', SHELL: '/bin/bash', HOSTNAME: 'leodev' }[k] ?? ''))),
  man: a => a[0] ? `Pas de page de manuel pour ${esc(a[0])} (c'est un portfolio, pas une Debian). Essaie « help ».` : 'Quelle page de manuel voulez-vous ?',
  neofetch: () => esc(`leo@leodev
----------
OS      : Debian GNU/Linux
Host    : Bac pro CIEL IT
Shell   : bash
Réseau  : Packet Tracer · VLAN · routage
Certifs : NetAcad · Root-Me Pro · ANSSI
Statut  : motivé`),
  contact: () => `<a href="mailto:${EMAIL}">${EMAIL}</a>`,
  clear: () => { out.innerHTML = ''; },
};
cmds.ifconfig = cmds.ipconfig = cmds.ip;

// ── easter eggs : volontairement absents de « help » ──
// null = géré (la sortie est déjà affichée), undefined = pas un egg → retombe sur cmds
function rain(ms = 4500) {
  if (reduce) return;
  const c = document.createElement('canvas'), g = c.getContext('2d');
  c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:90;pointer-events:none';
  c.width = innerWidth; c.height = innerHeight; document.body.append(c);
  const cols = Array.from({ length: Math.floor(innerWidth / 16) }, () => Math.random() * -50), t0 = performance.now();
  (function f(t) {
    g.fillStyle = 'rgba(9,9,11,.12)'; g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = '#ff2d46'; g.font = '14px JetBrains Mono, monospace';
    cols.forEach((y, i) => { g.fillText(String.fromCharCode(0x30A0 + Math.random() * 96 | 0), i * 16, y * 16); cols[i] = y * 16 > c.height && Math.random() > .975 ? 0 : y + 1; });
    if (t - t0 < ms) requestAnimationFrame(f);
    else { c.style.transition = 'opacity .8s'; c.style.opacity = 0; setTimeout(() => c.remove(), 900); }
  })(t0);
}
const wipe = () => slow(['rm: suppression de /bin', 'rm: suppression de /etc', 'rm: suppression de /home/leo/cv.txt', 'rm: suppression de /boot', 'Erreur de segmentation', '...je plaisante. Système de fichiers en lecture seule, rien n\'a été supprimé.']);
const eggs = {
  sudo: a => {
    const s = a.join(' ').toLowerCase();
    if (/-\w*(rf|fr)/.test(s) && /(^|\s)\/(\*)?(\s|$)/.test(s)) return wipe();
    if (s.includes('make me a sandwich')) return 'Okay.';
    return 'leo n\'est pas dans le fichier sudoers. Cet incident sera signalé.';
  },
  rm: a => /-\w*(rf|fr)/.test(a.join(' ')) && /(^|\s)\/(\*)?(\s|$)/.test(a.join(' ')) ? wipe() : 'rm: opération refusée (système de fichiers en lecture seule)',
  make: a => a.join(' ').toLowerCase().includes('sandwich') ? 'What? Make it yourself.' : 'make: *** Aucune cible spécifiée. Arrêt.',
  vim: () => '~\n~\n~\n-- INSERT --\n(impossible de quitter ? tape :q)',
  vi: () => eggs.vim(),
  nano: () => 'GNU nano : le choix des gens raisonnables.',
  emacs: () => 'emacs : un excellent système d\'exploitation, il lui manque juste un bon éditeur.',
  ':q': () => 'Tu as réussi à quitter vim. Respect.',
  ':q!': () => eggs[':q'](),
  ':wq': () => eggs[':q'](),
  xyzzy: () => 'Rien ne se passe.',
  sl: () => esc(String.raw`
      ____________   ___   ___   ___
  ___|  CIEL  IT  |_|___|_|___|_|___|__
  \_o____o____o____o____o____o____o___/
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
choo choo !`),
  cowsay: a => {
    const t = (a.join(' ') || 'Embauchez Léo').slice(0, 50), bar = '-'.repeat(t.length + 2);
    return esc(` ${bar}\n< ${t} >\n ${bar}\n`) + esc(String.raw`        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||`);
  },
  fortune: () => ['Le réseau, c\'est toujours le DNS.', 'Il n\'y a pas de cloud, juste l\'ordinateur de quelqu\'un d\'autre.', 'Ça marche sur ma machine.', 'Tu as essayé de l\'éteindre et de le rallumer ?', 'Il y a 10 types de personnes : celles qui comprennent le binaire et les autres.', 'Un câble RJ45 débranché explique 90 % des pannes.'][Math.random() * 6 | 0],
  nmap: a => slow([`Starting Nmap 7.95 ( cible : ${esc(a[0] || 'leodev.fr')} )`, 'L\'hôte est en ligne (0.0042s de latence).', 'PORT       ÉTAT   SERVICE', '80/tcp     open   http', '443/tcp    open   https', '1337/tcp   open   embauchez-leo', 'Nmap terminé : 1 adresse IP (1 hôte en ligne) scannée.']),
  ssh: () => 'leo@leodev.fr: Permission denied (publickey).',
  exit: () => 'logout\nImpossible de se déconnecter : ce terminal est le seul processus de ta session.',
  matrix: () => (rain(), 'Réveille-toi, Léo...'),
  apt: a => a[0] === 'moo' ? esc(String.raw`         (__)
         (oo)
   /------\/
  / |    ||
 *  /\---/\
    ~~   ~~
...."Have you mooed today?"...`) : 'E: Impossible d\'obtenir le verrou /var/lib/dpkg/lock (êtes-vous root ?)',
  man: a => (a[0] || '').toLowerCase() === 'leo' ? esc(`LEO(1)                 Manuel du développeur                 LEO(1)

NOM
       leo - étudiant réseau, curieux et motivé

SYNOPSIS
       leo [--stage|--alternance] [--reseau] [--cyber]

DESCRIPTION
       Monte des topologies sous Packet Tracer, passe ses soirées
       sur Root-Me Pro et lit le code source des sites web.

VOIR AUSSI
       contact(1)`) : undefined,
};
eggs['apt-get'] = eggs.apt;
const KONAMI = 'arrowup,arrowup,arrowdown,arrowdown,arrowleft,arrowright,arrowleft,arrowright,b,a';
let keys = [];
addEventListener('keydown', e => { keys = [...keys.slice(-9), e.key.toLowerCase()]; if (keys.join() === KONAMI) { rain(); console.log('%c↑↑↓↓←→←→BA — code Konami validé', 'color:#ff2d46;font:600 14px monospace'); } });

function run(v) {
  const raw = v.trim(); if (!raw) return;
  hist.push(raw); hi = hist.length;
  print(`<span class="p">leo@dev:~$</span> ${esc(raw)}`);
  const [c0, ...a] = raw.split(/\s+/), c = c0.toLowerCase();
  let r = raw.replace(/\s/g, '') === ':(){:|:&};:' ? 'bash: fork: Ressource temporairement indisponible\n(ulimit -u vient de te sauver)' : eggs[c]?.(a);
  if (r === undefined) r = (cmds[c] || (() => `bash: ${esc(c0)}: commande introuvable — essaie « help »`))(a);
  if (typeof r === 'string') print(r);
}
['help', 'ls', 'neofetch', 'ping', 'traceroute', 'show vlan'].forEach(c => {
  const b = document.createElement('button'); b.type = 'button'; b.textContent = c;
  b.addEventListener('click', () => run(c)); $('#hints').append(b);
});
print('Terminal de Léo. Tape <span class="p">help</span> ou clique une commande.');
$('#cmd').addEventListener('submit', e => { e.preventDefault(); run(inp.value); inp.value = ''; });
inp.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' && hist.length) { hi = Math.max(0, hi - 1); inp.value = hist[hi]; e.preventDefault(); }
  else if (e.key === 'ArrowDown') { hi = Math.min(hist.length, hi + 1); inp.value = hist[hi] ?? ''; e.preventDefault(); }
  else if (e.key === 'Tab') {
    e.preventDefault();
    const v = inp.value.trim().toLowerCase(), m = v ? Object.keys(cmds).filter(k => k.startsWith(v)) : [];
    if (m.length === 1) inp.value = m[0]; else if (m.length > 1) print(m.join('  '));
  }
});

console.log('%cleo@dev:~$ ls -a', 'color:#ff2d46;font:600 14px monospace');
console.log('Tu inspectes le code ? Bon réflexe. Le terminal cache des easter eggs qui ne sont pas dans « help ». Indice : tous les fichiers ne s\'affichent pas avec un simple ls.');

$('#copy').addEventListener('click', e => {
  const b = e.currentTarget;
  navigator.clipboard?.writeText(EMAIL).then(() => { b.textContent = 'Copié'; setTimeout(() => b.textContent = "Copier l'email", 1800); });
});
