/* ============================================================
   ISEO Premium — AI chat bubble
   Connects to your bot (chatbot-boutique) via its /chat endpoint.
   ------------------------------------------------------------
   ➜ TO CONNECT YOUR BOT: set BOT_ENDPOINT to your hosted URL, e.g.
       const BOT_ENDPOINT = "https://ton-bot.onrender.com/chat";
   If left empty (or if the bot is unreachable), the bubble runs in
   a light DEMO mode using the local catalogue so it still works.
   ============================================================ */
const BOT_ENDPOINT = ""; // <-- colle ici l'URL de ton bot (ex: https://ton-bot.onrender.com/chat)

const SESSION_ID = 'web-' + Math.random().toString(36).slice(2, 10);

const QUICKS = [
  "Vous avez des cylindres haute sécurité ?",
  "Ouverture de porte, vous intervenez ?",
  "Prix d’un coffre-fort ?",
  "Livrez-vous à Oran ?",
];

document.addEventListener('DOMContentLoaded', () => {
  mountChat();
});

function mountChat() {
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <button class="chat-fab cursor-target" id="chatFab" aria-label="Assistant ISEO">
      <span class="pulse"></span>
      ${window.svg ? svg('chat', 26) : '💬'}
    </button>
    <div class="chat-panel" id="chatPanel" role="dialog" aria-label="Assistant ISEO">
      <div class="chat-head">
        <div class="avatar">${window.svg ? svg('shield', 22) : '🛡️'}</div>
        <div><h4>Assistant ISEO</h4><small>En ligne · répond en direct</small></div>
        <button class="close cursor-target" id="chatClose" aria-label="Fermer">×</button>
      </div>
      <div class="chat-body" id="chatBody"></div>
      <div class="chat-quick" id="chatQuick"></div>
      <form class="chat-input" id="chatForm">
        <input id="chatText" type="text" placeholder="Écrivez votre question…" autocomplete="off" />
        <button class="send cursor-target" type="submit" aria-label="Envoyer">${window.svg ? svg('arrow', 18) : '→'}</button>
      </form>
      <div class="chat-note">Assistant automatique — informations selon notre catalogue.</div>
    </div>`;
  document.body.appendChild(wrap);

  const fab = wrap.querySelector('#chatFab');
  const panel = wrap.querySelector('#chatPanel');
  const body = wrap.querySelector('#chatBody');
  const quick = wrap.querySelector('#chatQuick');
  const form = wrap.querySelector('#chatForm');
  const input = wrap.querySelector('#chatText');

  let greeted = false;
  const toggle = () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open') && !greeted) {
      greeted = true;
      addMsg("Bonjour 👋 Je suis l’assistant ISEO. Comment puis-je vous aider ? (cylindres, coffres, ouverture de porte, contrôle d’accès…)", 'bot');
      quick.innerHTML = QUICKS.map(q => `<button type="button">${q}</button>`).join('');
      quick.querySelectorAll('button').forEach(b => b.addEventListener('click', () => send(b.textContent)));
      setTimeout(() => input.focus(), 300);
    }
  };
  fab.addEventListener('click', toggle);
  wrap.querySelector('#chatClose').addEventListener('click', toggle);

  form.addEventListener('submit', e => { e.preventDefault(); const v = input.value.trim(); if (v) send(v); });

  function addMsg(text, who) {
    const m = document.createElement('div');
    m.className = 'msg ' + who; m.textContent = text;
    body.appendChild(m); body.scrollTop = body.scrollHeight;
    return m;
  }
  function typing() {
    const t = document.createElement('div');
    t.className = 'msg bot typing'; t.innerHTML = '<i></i><i></i><i></i>';
    body.appendChild(t); body.scrollTop = body.scrollHeight; return t;
  }

  async function send(text) {
    addMsg(text, 'user'); input.value = ''; quick.innerHTML = '';
    const t = typing();
    try {
      const reply = await getReply(text);
      t.remove(); addMsg(reply, 'bot');
    } catch (e) {
      t.remove(); addMsg("Désolé, un souci technique. Réessayez ou appelez-nous.", 'bot');
    }
  }

  async function getReply(text) {
    if (BOT_ENDPOINT) {
      const r = await fetch(BOT_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: SESSION_ID })
      });
      const data = await r.json();
      return data.reply || "…";
    }
    // DEMO fallback (no backend): simple catalogue-based answers
    await new Promise(r => setTimeout(r, 700));
    return demoReply(text);
  }
}

/* ---------- Demo brain (offline) ---------- */
function demoReply(qRaw) {
  const q = qRaw.toLowerCase();
  const P = window.ISEO_PRODUCTS || [];
  const has = (...k) => k.some(w => q.includes(w));

  if (has('bonjour', 'salut', 'cc', 'hello')) return "Bonjour ! Dites-moi ce que vous cherchez : cylindre, cadenas, coffre-fort, interphone, ou un service (ouverture, installation, dépannage).";
  if (has('livr', 'wilaya', 'oran', 'alger', 'transport')) return "Nous livrons dans les 58 wilayas, paiement à la livraison. Installation possible par nos techniciens certifiés.";
  if (has('ouvertur', 'porte claqu', 'bloqu', 'dépann', 'depann', 'urgence', '24')) return "Oui — dépannage et ouverture 24/7, intervention rapide et sans dégâts inutiles. Voulez-vous être rappelé ? Laissez votre numéro via la page Contact.";
  if (has('install', 'pose', 'monter')) return "Nous installons serrures, cylindres, coffres-forts et contrôle d’accès. Devis clair avant intervention. Souhaitez-vous un devis ?";
  if (has('clé', 'cle', 'double', 'reproduction')) return "Reproduction de clés sécurisées sur présentation de la carte de propriété. Passez au showroom avec votre clé.";
  if (has('garantie', 'sav')) return "Garantie pièces et main-d’œuvre, SAV réactif sur toutes nos installations.";

  // product search
  const hits = P.filter(p => {
    const hay = (p.name + ' ' + p.desc + ' ' + p.cat).toLowerCase();
    return q.split(/\s+/).some(w => w.length > 2 && hay.includes(w));
  }).slice(0, 3);
  if (hits.length) {
    return "Voici ce que nous avons :\n" + hits.map(p => `• ${p.name} — ${fmtDA(p.price)}`).join('\n') + "\nSouhaitez-vous plus de détails ou une installation ?";
  }
  if (has('coffre', 'safe')) return "Nous proposons des coffres-forts ignifuges et à code, ancrage mural et sol. Dites-moi le volume souhaité.";
  if (has('caméra', 'camera', 'interphone', 'vidéo', 'accès', 'acces', 'badge', 'biométr', 'biometr')) return "Côté contrôle d’accès : interphones vidéo, serrures biométriques connectées et badges RFID. Pour particuliers et entreprises.";
  return "Je peux vous renseigner sur nos cylindres, cadenas, coffres-forts, contrôle d’accès et nos services (ouverture, installation, dépannage). Pour un conseil personnalisé, utilisez la page Contact.";
}
