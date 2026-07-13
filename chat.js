/* ============================================================
   La Serrure — assistant de chat (autonome, styles inclus)
   Pour brancher un vrai bot : mettre l'URL dans BOT_ENDPOINT.
   Sinon, mode démo hors-ligne basé sur nos réponses types.
   ============================================================ */
(function () {
  var BOT_ENDPOINT = ""; // ex: "https://ton-bot.onrender.com/chat"
  var SESSION_ID = 'web-' + Math.random().toString(36).slice(2, 10);
  var QUICKS = [
    "Vous refaites les clés ?",
    "Une porte est bloquée, vous intervenez ?",
    "Vous avez des poignées en laiton ?",
    "Où êtes-vous situés ?"
  ];

  var CSS = `
  .ls-fab{position:fixed;right:22px;bottom:22px;z-index:9998;width:60px;height:60px;border:0;border-radius:50%;
    background:#C0121F;color:#fff;cursor:pointer;box-shadow:0 12px 30px rgba(192,18,31,.4);display:grid;place-items:center;transition:transform .25s ease}
  .ls-fab:hover{transform:translateY(-3px) scale(1.04)}
  .ls-fab svg{width:26px;height:26px;stroke:#fff;fill:none}
  .ls-fab .pulse{position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 0 rgba(192,18,31,.5);animation:lspulse 2.4s infinite}
  @keyframes lspulse{0%{box-shadow:0 0 0 0 rgba(192,18,31,.5)}70%{box-shadow:0 0 0 16px rgba(192,18,31,0)}100%{box-shadow:0 0 0 0 rgba(192,18,31,0)}}
  .ls-panel{position:fixed;right:22px;bottom:94px;z-index:9999;width:360px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 130px);
    background:#F6F1E8;border-radius:20px;box-shadow:0 30px 70px rgba(23,20,26,.35);display:flex;flex-direction:column;overflow:hidden;
    opacity:0;transform:translateY(16px) scale(.98);pointer-events:none;transition:opacity .25s ease,transform .25s ease;
    font-family:'Inter',system-ui,sans-serif;border:1px solid rgba(23,20,26,.1)}
  .ls-panel.open{opacity:1;transform:none;pointer-events:auto}
  .ls-head{display:flex;align-items:center;gap:12px;padding:15px 16px;background:linear-gradient(120deg,#C0121F,#8E0E17);color:#fff}
  .ls-head .av{width:40px;height:40px;border-radius:11px;background:rgba(255,255,255,.16);display:grid;place-items:center;flex:0 0 auto}
  .ls-head .av svg{width:22px;height:22px;stroke:#fff;fill:none}
  .ls-head h4{margin:0;font-size:1rem;font-weight:600;font-family:'Fraunces',serif}
  .ls-head small{opacity:.85;font-size:.76rem;display:flex;align-items:center;gap:6px}
  .ls-head small::before{content:"";width:7px;height:7px;border-radius:50%;background:#7CE38B;box-shadow:0 0 8px #7CE38B}
  .ls-head .x{margin-left:auto;background:none;border:0;color:#fff;font-size:1.5rem;line-height:1;cursor:pointer;opacity:.8;padding:4px}
  .ls-head .x:hover{opacity:1}
  .ls-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}
  .ls-msg{max-width:82%;padding:10px 14px;border-radius:14px;font-size:.92rem;line-height:1.5;white-space:pre-line;word-wrap:break-word}
  .ls-msg.bot{align-self:flex-start;background:#fff;color:#17141A;border:1px solid rgba(23,20,26,.08);border-bottom-left-radius:4px}
  .ls-msg.user{align-self:flex-end;background:#C0121F;color:#fff;border-bottom-right-radius:4px}
  .ls-msg.typing{display:flex;gap:4px}
  .ls-msg.typing i{width:7px;height:7px;border-radius:50%;background:#bbb;animation:lsblink 1s infinite}
  .ls-msg.typing i:nth-child(2){animation-delay:.2s}.ls-msg.typing i:nth-child(3){animation-delay:.4s}
  @keyframes lsblink{0%,60%,100%{opacity:.3}30%{opacity:1}}
  .ls-quick{display:flex;flex-wrap:wrap;gap:7px;padding:0 16px 8px}
  .ls-quick button{background:#fff;border:1px solid rgba(192,18,31,.3);color:#8E0E17;border-radius:999px;padding:7px 12px;font-size:.8rem;cursor:pointer;transition:background .2s,color .2s;font-family:inherit}
  .ls-quick button:hover{background:#C0121F;color:#fff;border-color:#C0121F}
  .ls-form{display:flex;gap:8px;padding:12px 14px;border-top:1px solid rgba(23,20,26,.1);background:#F6F1E8}
  .ls-form input{flex:1;border:1px solid rgba(23,20,26,.15);border-radius:999px;padding:11px 15px;font-size:.9rem;outline:none;font-family:inherit;background:#fff}
  .ls-form input:focus{border-color:#C0121F}
  .ls-form .send{width:42px;height:42px;border:0;border-radius:50%;background:#C0121F;color:#fff;cursor:pointer;display:grid;place-items:center;flex:0 0 auto}
  .ls-form .send svg{width:18px;height:18px;stroke:#fff;fill:none}
  .ls-note{font-size:.7rem;color:#7a7480;text-align:center;padding:0 16px 12px}
  @media(max-width:480px){.ls-panel{right:12px;left:12px;width:auto;bottom:88px}.ls-fab{right:16px;bottom:16px}}
  `;

  var ICON_KEY = '<svg viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="4"/><path d="m11 11 9 9"/><path d="m16 16 2-2"/><path d="m19 19 2-2"/></svg>';
  var ICON_ARROW = '<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';

  function init() {
    var style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<button class="ls-fab" id="lsFab" aria-label="Ouvrir l\'assistant"><span class="pulse"></span>' + ICON_KEY + '</button>' +
      '<div class="ls-panel" id="lsPanel" role="dialog" aria-label="Assistant La Serrure">' +
      '<div class="ls-head"><div class="av">' + ICON_KEY + '</div><div><h4>Assistant La Serrure</h4><small>En ligne · répond en direct</small></div><button class="x" id="lsClose" aria-label="Fermer">&times;</button></div>' +
      '<div class="ls-body" id="lsBody"></div>' +
      '<div class="ls-quick" id="lsQuick"></div>' +
      '<form class="ls-form" id="lsForm"><input id="lsText" type="text" placeholder="Écrivez votre question…" autocomplete="off"/><button class="send" type="submit" aria-label="Envoyer">' + ICON_ARROW + '</button></form>' +
      '<div class="ls-note">Assistant automatique — informations selon notre catalogue.</div></div>';
    document.body.appendChild(wrap);

    var fab = wrap.querySelector('#lsFab'), panel = wrap.querySelector('#lsPanel'),
        body = wrap.querySelector('#lsBody'), quick = wrap.querySelector('#lsQuick'),
        form = wrap.querySelector('#lsForm'), input = wrap.querySelector('#lsText');
    var greeted = false;

    function toggle() {
      panel.classList.toggle('open');
      if (panel.classList.contains('open') && !greeted) {
        greeted = true;
        addMsg("Bonjour 👋 Je suis l'assistant de La Serrure. Comment puis-je vous aider ? (serrures, poignées, clés, badges, dépannage…)", 'bot');
        quick.innerHTML = QUICKS.map(function (q) { return '<button type="button">' + q + '</button>'; }).join('');
        quick.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { send(b.textContent); }); });
        setTimeout(function () { input.focus(); }, 300);
      }
    }
    fab.addEventListener('click', toggle);
    wrap.querySelector('#lsClose').addEventListener('click', toggle);
    form.addEventListener('submit', function (e) { e.preventDefault(); var v = input.value.trim(); if (v) send(v); });

    function addMsg(text, who) {
      var m = document.createElement('div'); m.className = 'ls-msg ' + who; m.textContent = text;
      body.appendChild(m); body.scrollTop = body.scrollHeight; return m;
    }
    function typing() {
      var t = document.createElement('div'); t.className = 'ls-msg bot typing'; t.innerHTML = '<i></i><i></i><i></i>';
      body.appendChild(t); body.scrollTop = body.scrollHeight; return t;
    }
    function send(text) {
      addMsg(text, 'user'); input.value = ''; quick.innerHTML = '';
      var t = typing();
      getReply(text).then(function (reply) { t.remove(); addMsg(reply, 'bot'); })
        .catch(function () { t.remove(); addMsg("Désolé, un souci technique. Réessayez ou appelez-nous au 0541 79 36 34.", 'bot'); });
    }
    function getReply(text) {
      if (BOT_ENDPOINT) {
        return fetch(BOT_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, session_id: SESSION_ID }) })
          .then(function (r) { return r.json(); }).then(function (d) { return d.reply || "…"; });
      }
      return new Promise(function (res) { setTimeout(function () { res(demo(text)); }, 650); });
    }
  }

  function demo(qRaw) {
    var q = qRaw.toLowerCase();
    function has() { for (var i = 0; i < arguments.length; i++) if (q.indexOf(arguments[i]) > -1) return true; return false; }
    if (has('bonjour', 'salut', 'cc', 'hello', 'slm', 'saha')) return "Bonjour ! Dites-moi ce que vous cherchez : serrure, cylindre, poignée, double de clé, badge, ventouse, ou un dépannage.";
    if (has('cle', 'clé', 'double', 'reproduct', 'minute')) return "Oui — service Clé Minute sur place : clés plates, à points, à gorges et télécommandes. Passez au magasin avec votre clé (clés de sûreté sur présentation de la carte).";
    if (has('dépann', 'depann', 'ouvertur', 'bloqu', 'claqu', 'urgence')) return "Oui, nous intervenons pour l'ouverture et le dépannage de portes et serrures. Appelez-nous au 0541 79 36 34 pour une intervention rapide.";
    if (has('poign', 'béquille', 'bequille', 'laiton', 'inox')) return "Nous avons un large choix de poignées et béquilles (laiton, inox, noir mat) pour toutes les portes. Venez voir en magasin, Bd des Lions à Oran.";
    if (has('serrure', 'cylindre', 'verrou', 'barillet')) return "Serrures, cylindres et verrous toutes marques (ISEO, KALE, YALE, CISA, SOFICLEF…). Dites-moi votre type de porte et je vous oriente.";
    if (has('badge', 'télécommande', 'telecommande', 'rfid', 'interphone', 'vidéo', 'video', 'accès', 'acces')) return "Contrôle d'accès : badges RFID, télécommandes, interphones et portiers vidéo — copies et installation. On s'occupe des particuliers comme des immeubles.";
    if (has('ventouse', 'électrique', 'electrique', 'gâche', 'gache')) return "Ventouses magnétiques et serrures/gâches électriques disponibles et posables par nos soins.";
    if (has('ferme-porte', 'ferme porte', 'groom')) return "Oui, nous avons des ferme-portes (grooms hydrauliques) pour portes standard et lourdes, avec pose possible.";
    if (has('adresse', 'où', 'ou etes', 'situ', 'magasin', 'oran', 'lions', 'hasnaoui')) return "Nous sommes au Boulevard des Lions, face à la mosquée Hasnaoui — Oran. Ouvert samedi à jeudi, 9h–18h.";
    if (has('horaire', 'ouvert', 'heure', 'fermé', 'ferme ')) return "Nous sommes ouverts du samedi au jeudi, de 9h à 18h.";
    if (has('prix', 'tarif', 'combien', 'coût', 'cout')) return "Les prix dépendent du modèle et de la pose. Le plus simple : appelez-nous au 0541 79 36 34 ou passez au magasin pour un devis clair.";
    if (has('install', 'pose', 'blindage', 'monter')) return "Nous installons serrures, poignées, ferme-portes, interphones et blindages — devis clair avant intervention.";
    if (has('garantie', 'sav')) return "Garantie et SAV sur nos produits et installations. On reste joignables si besoin.";
    if (has('merci', 'thanks')) return "Avec plaisir ! Autre chose ? Sinon, à très vite au magasin. 🔑";
    return "Je peux vous renseigner sur nos serrures, poignées, doubles de clés, badges, ventouses et nos services (installation, dépannage). Pour un conseil précis, appelez le 0541 79 36 34 ou passez au Bd des Lions, Oran.";
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
