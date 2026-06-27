/* ════════════════════════════════════════════════════════════════════
   app.js — Logique de la calculatrice (état interne, ZÉRO champ <input>)
   Toute saisie passe exclusivement par le pavé numérique de l'écran.
   ════════════════════════════════════════════════════════════════════ */

let mode       = 'u';   // 'u' = unaire, 'b' = binaire
let curOp      = null;  // opérateur en attente (+, -, *, /)
let activeZ    = 1;     // quel complexe est en cours de saisie : 1 ou 2
let activePart = 're';  // quelle partie : 're' ou 'im'
let z3         = null;  // dernier résultat mémorisé

/* A-t-on commencé une vraie saisie depuis le dernier C / changement
   de mode ? Tant que c'est faux, "=" et les fonctions ne doivent pas
   produire de résultat sur 0+0i par défaut. */
let touched = false;

/* Mode édition : quand on clique sur le résultat affiché à l'écran,
   on peut le retaper chiffre par chiffre comme une nouvelle valeur. */
let editingResult = false;

/* ── Mode saisie exposant (pour Zⁿ) ──────────────────────────────────
   Déclarées ici, en haut du fichier, avant toute fonction qui les
   utilise — pas seulement à la fin — pour éviter toute ambiguïté. */
let waitingForExp = false;  // on attend la saisie de n au pavé
let expStr        = '';     // chaîne de l'exposant en cours de saisie

/* État interne des deux nombres complexes — remplace les anciens
   champs <input id="ia1">, etc. Stockés comme chaînes pour permettre
   une saisie progressive ("-", "3.", "3.5"...). */
const state = {
    z1: { re: '0', im: '0' },
    z2: { re: '0', im: '0' },
};

const $  = id => document.getElementById(id);
const z1 = () => Cx.crC(+state.z1.re || 0, +state.z1.im || 0);
const z2 = () => Cx.crC(+state.z2.re || 0, +state.z2.im || 0);

/* ── Valeur actuellement ciblée par le pavé numérique ── */
function getActiveValue() { return state['z' + activeZ][activePart]; }
function setActiveValue(v) { state['z' + activeZ][activePart] = v; }

/* ── Écran ── */
function scr(main, sub = '', expr = '', err = false) {
    $('scv').innerHTML = (err
        ? `<span class="sc-err">${main}</span>`
        : `${main}`) + '<span class="cursor"></span>';
    $('scs').textContent = sub;
    $('sce').textContent = expr;
}

/* ── Indicateur Z actif (sélecteur Z₁/Z₂, visible en mode Binaire) ── */
function updateZIndicator() {
    const ind = $('zIndicator');
    const sel = $('zSelector');
    if (!ind || !sel) return;
    if (mode === 'b') {
        sel.style.display = 'flex';
        ind.textContent = `Saisie : Z${activeZ} — ${activePart === 're' ? 'Partie Réelle (a)' : 'Partie Imaginaire (b)'}`;
    } else {
        sel.style.display = 'none';
    }
}

function showZ(z, expr) {
    if (!z) { scr('DIV / 0', 'vérifier Z₂ ≠ 0', expr, true); return; }
    z3 = z;
    editingResult = false;
    scr(fz(z), fp(z), expr);
    addHist(expr, fz(z));
    if (typeof drawPlane === 'function') drawPlane(z1(), z3);
}

/* ── Modes ── */
function setMode(m, btn) {
    mode = m;
    document.querySelectorAll('.mbt').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    $('scm').textContent = m === 'u' ? '— MODE UNAIRE —' : '— MODE BINAIRE —';

    if (m === 'b') {
        activeZ = 1; activePart = 're';
        document.querySelectorAll('.z-sel-btn').forEach(b => b.classList.remove('on'));
        const bz1 = $('btnZ1'); if (bz1) bz1.classList.add('on');
        scr('Saisie Z₁ — Partie Réelle', '→ Choisir Z₁ ou Z₂, puis Re ou Im', 'MODE BINAIRE');
    } else {
        activeZ = 1; activePart = 're';
        scr('0');
    }
    curOp = null;
    touched = false;
    editingResult = false;
    waitingForExp = false;
    expStr = '';
    updateZIndicator();
}

/* ── Boutons Re / Im ─────────────────────────────────────────
   Sélectionnent la partie réelle ou imaginaire du Z actif.
   En mode Unaire : cible toujours Z₁.
────────────────────────────────────────────────────────────── */
function kRe() {
    if (waitingForExp) return; // pas de Re/Im pendant la saisie d'un exposant
    if (mode !== 'b') activeZ = 1;
    activePart = 're';
    editingResult = false;
    scr(getActiveValue() || '0', `Saisissez la valeur de a`, `Z${activeZ} — Partie Réelle`);
    updateZIndicator();
}

function kIm() {
    if (waitingForExp) return;
    if (mode !== 'b') activeZ = 1;
    activePart = 'im';
    editingResult = false;
    scr(getActiveValue() || '0', `Saisissez la valeur de b`, `Z${activeZ} — Partie Imaginaire`);
    updateZIndicator();
}

/* ── Boutons Z1 / Z2 (mode Binaire) ── */
function selectZ(n, btn) {
    if (waitingForExp) return;
    activeZ = n;
    editingResult = false;
    document.querySelectorAll('.z-sel-btn').forEach(b => b.classList.remove('on'));
    if (btn) btn.classList.add('on');
    scr(`Z${n} sélectionné`, `Appuyez sur Re ou Im puis saisissez`, `Saisie Z${n}`);
    updateZIndicator();
}

/* ── Clic sur le résultat affiché à l'écran ──────────────────
   Permet de reprendre la valeur affichée et de la modifier
   chiffre par chiffre, sans aucun champ de saisie externe.
   Ne fait rien si on est déjà en train de saisir Z1/Z2 (sinon
   ça interromprait la frappe en cours), ni pendant la saisie
   d'un exposant. ────────────────────────────────────────────── */
function onScreenClick() {
    if (waitingForExp) return;

    // Si un résultat Z3 existe et qu'on n'est pas déjà en pleine saisie,
    // on permet de le reprendre comme nouvelle valeur de Z1.
    if (z3 && !touched) {
        activeZ = 1; activePart = 're';
        state.z1.re = String(g(z3.a));
        state.z1.im = String(g(z3.b));
        editingResult = true;
        touched = true;
        scr(fz(z1()), 'Résultat repris — modifiez au pavé', `Édition Z1`);
        updateZIndicator();
        return;
    }
    // Sinon : simple rappel visuel de la valeur en cours (pas de changement d'état)
    if (touched || z3) {
        const part = activePart === 're' ? 'a' : 'b';
        scr(getActiveValue() || '0', `Z${activeZ} — partie ${activePart === 're' ? 'réelle' : 'imaginaire'} (cliquable)`, `Z${activeZ}.${part} =`);
    }
}

/* ── Saisie numérique (écrit dans l'état interne, ou dans l'exposant) ── */
function kN(v) {
    // ── Mode saisie de l'exposant pour Zⁿ ──
    if (waitingForExp) {
        if (v === 'neg') {
            expStr = expStr.startsWith('-') ? expStr.slice(1) : '-' + expStr;
        } else if (v === '.') {
            return; // exposant entier uniquement, on ignore le point
        } else {
            expStr = (expStr === '0' || expStr === '') ? v : expStr + v;
        }
        scr(expStr || '0', "Appuyez sur = pour calculer Zⁿ", `Zⁿ — n = ${expStr || '?'}`);
        return;
    }

    // ── Saisie normale de Z1 / Z2 ──
    let cur = getActiveValue();

    // Si on vient de cliquer sur le résultat pour l'éditer, le premier
    // chiffre tapé démarre une saisie fraîche plutôt que de s'accoler.
    if (editingResult) {
        cur = '0';
        editingResult = false;
    }

    if (v === 'neg') {
        cur = String(-(parseFloat(cur) || 0));
    } else if (v === '.') {
        if (!cur.includes('.')) cur += '.';
    } else {
        cur = (cur === '0' || cur === '' ? '' : cur) + v;
    }

    setActiveValue(cur);
    touched = true;

    const part = activePart === 're' ? 'a' : 'b';
    scr(cur || '0', `Z${activeZ} — partie ${activePart === 're' ? 'réelle' : 'imaginaire'}`, `Z${activeZ}.${part} =`);
}

function kDel() {
    // ── Mode saisie de l'exposant ──
    if (waitingForExp) {
        expStr = expStr.slice(0, -1);
        scr(expStr || '0', "Appuyez sur = pour calculer Zⁿ", `Zⁿ — n = ${expStr || '?'}`);
        return;
    }

    // ── Suppression normale ──
    let cur = getActiveValue();
    cur = cur.slice(0, -1);
    if (cur === '' || cur === '-') cur = '0';
    setActiveValue(cur);

    const part = activePart === 're' ? 'a' : 'b';
    scr(cur, `Z${activeZ} — effacement`, `Z${activeZ}.${part} =`);
}

function kClear() {
    waitingForExp = false;
    expStr = '';
    state.z1.re = '0'; state.z1.im = '0';
    state.z2.re = '0'; state.z2.im = '0';
    scr('0'); curOp = null; z3 = null;
    activeZ = 1; activePart = 're';
    touched = false;
    editingResult = false;
    updateZIndicator();
}

/* ── Touche Zⁿ : démarre le mode saisie d'exposant ──────────────────
   L'exposant se tape ensuite normalement au pavé numérique (kN),
   et "=" (kEqual) valide et calcule — sans aucune fenêtre prompt(). */
function kPow() {
    if (!touched && !z3) {
        scr('Saisissez Z₁ d\'abord', '→ utilisez le pavé numérique', 'Aucune valeur', true);
        return;
    }
    waitingForExp = true;
    expStr = '';
    scr('0', "Saisissez l'exposant n puis appuyez sur =", 'Zⁿ — entrez n :');
}

/* ── Fonctions unaires (s'appliquent à Z₃ si dispo, sinon Z₁) ── */
function kFn(fn) {
    if (waitingForExp) return; // pas de fonctions pendant la saisie d'un exposant
    if (fn === 're') { kRe(); return; }
    if (fn === 'im') { kIm(); return; }

    if (!touched && !z3) {
        scr('Saisissez Z₁ d\'abord', '→ utilisez le pavé numérique', 'Aucune valeur', true);
        return;
    }

    const z = z3 || z1();

    if (fn === 'mod') {
        const m = g(Cx.mod(z));
        scr(m, '(réel positif)', '|Z|');
        addHist('|Z|', m); return;
    }
    if (fn === 'arg') {
        const a = Cx.arg(z);
        scr(g(a) + ' rad', g(a * 180 / Math.PI) + '°', 'arg(Z)');
        addHist('arg(Z)', g(a) + ' rad'); return;
    }

    const ops = {
        opp:  [Cx.opp(z),   '−Z'],
        conj: [Cx.conj(z),  'Z̄'],
        inv:  [Cx.inv(z),   '1/Z'],
        p2:   [Cx.pow(z,2), 'Z²'],
        p3:   [Cx.pow(z,3), 'Z³'],
    };
    const [r, lbl] = ops[fn];
    showZ(r, `${lbl}(${fz(z)})`);
}

/* ── Opérateurs binaires ── */
function kOp(o) {
    if (waitingForExp) return;
    if (mode !== 'b') {
        scr('Passez en mode BINAIRE', '← bouton "Binaire"', 'Opération impossible', true);
        return;
    }
    if (!touched) {
        scr('Saisissez Z₁ et Z₂ d\'abord', '→ utilisez le pavé numérique', 'Aucune valeur', true);
        return;
    }
    curOp = o;
    const sym = { '+': '+', '-': '−', '*': '×', '/': '÷' }[o];
    $('sce').textContent = `${fz(z1())} ${sym} ${fz(z2())}`;
    $('scm').textContent = '— OPÉRATION EN ATTENTE —';
}

function kEqual() {
    // ── Mode saisie exposant : "=" valide n et calcule Zⁿ ──
    if (waitingForExp) {
        const n = parseInt(expStr, 10);
        waitingForExp = false;
        expStr = '';
        if (isNaN(n)) {
            scr('Exposant invalide', '→ entrez un entier', 'Zⁿ', true);
            return;
        }
        const z = z3 || z1();
        const result = Cx.pow(z, n);
        showZ(result, `(${fz(z)})^${n}`);
        return;
    }

    // ── Calcul normal (unaire ou binaire) ──
    if (!touched && !z3) {
        scr('Aucune saisie', '→ entrez un nombre avant de calculer', 'En attente', true);
        return;
    }

    const za = z1(), zb = z2();

    if (!curOp && mode === 'u') {
        scr(fz(za), fp(za), 'Z₁');
        if (typeof drawPlane === 'function') drawPlane(za, z3);
        return;
    }

    if (mode === 'b' && !curOp) {
        scr('Choisissez un opérateur', '→ +, −, × ou ÷', 'Opération manquante', true);
        return;
    }

    const o = curOp || '+';
    const results = {
        '+': Cx.add(za, zb),
        '-': Cx.sub(za, zb),
        '*': Cx.mul(za, zb),
        '/': Cx.div(za, zb)
    };

    const syms = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    const result = results[o];

    if (!result) {
        scr('DIV / 0', 'Z₂ ne peut pas être 0', `Z₁ ${syms[o]} Z₂`, true);
        return;
    }

    showZ(result, `Z₃ = Z₁ ${syms[o]} Z₂`);
    curOp = null;
    touched = false;
    $('scm').textContent = '— RÉSULTAT —';
}

function kSwap() {
    if (waitingForExp) return;
    const a1 = state.z1.re, b1 = state.z1.im;
    state.z1.re = state.z2.re; state.z1.im = state.z2.im;
    state.z2.re = a1;          state.z2.im = b1;
    scr('Z₁ ↔ Z₂', '(échange effectué)');
}

/* ── Vues écran : Calcul / Formules / Repère / Historique ──
   Toutes suivent le même principe : on cache les autres vues,
   on affiche la vue demandée, et le bouton "Retour au calcul"
   apparaît pour revenir à l'écran normal. */
function hideAllViews() {
    $('viewCalc').classList.add('sc-view-hidden');
    $('viewFormules').classList.add('sc-view-hidden');
    $('viewRepere').classList.add('sc-view-hidden');
    $('viewHist').classList.add('sc-view-hidden');
}

function showFormules() {
    hideAllViews();
    $('viewFormules').classList.remove('sc-view-hidden');
    $('scBackBtn').classList.add('show');
}
function showRepere() {
    hideAllViews();
    $('viewRepere').classList.remove('sc-view-hidden');
    $('scBackBtn').classList.add('show');
    if (typeof drawPlane === 'function') drawPlane(z1(), z3);
}
function showHist() {
    hideAllViews();
    $('viewHist').classList.remove('sc-view-hidden');
    $('scBackBtn').classList.add('show');
}
function backToCalc() {
    hideAllViews();
    $('viewCalc').classList.remove('sc-view-hidden');
    $('scBackBtn').classList.remove('show');
}

/* ── Historique AJAX ── */
function addHist(op, res) {
    const row = document.createElement('div');
    row.className = 'hi';
    row.innerHTML = `<span class="h-op">${op} =</span><span class="h-res">${res}</span>`;
    const list = $('hlist');
    const empty = list.querySelector('.h-empty');
    if (empty) empty.remove();
    list.prepend(row);

    const fd = new FormData();
    fd.append('action', 'ajouter');
    fd.append('operation', op);
    fd.append('resultat', res);
    fetch('api.php', { method: 'POST', body: fd }).catch(() => {});
}

function clearHist() {
    $('hlist').innerHTML = '<div class="h-empty">Aucun calcul.</div>';
    const fd = new FormData();
    fd.append('action', 'effacer');
    fetch('api.php', { method: 'POST', body: fd }).catch(() => {});
}

/* ── Raccourcis clavier physique (optionnel, en plus du pavé) ── */
document.addEventListener('keydown', e => {
    if ('0123456789'.includes(e.key)) kN(e.key);
    else if (e.key === '.') kN('.');
    else if (e.key === 'Backspace') kDel();
    else if (e.key === 'Escape') kClear();
    else if (e.key === 'Enter') kEqual();
    else if (e.key === '+') kOp('+');
    else if (e.key === '-') kOp('-');
    else if (e.key === '*') kOp('*');
    else if (e.key === '/') { e.preventDefault(); kOp('/'); }
});