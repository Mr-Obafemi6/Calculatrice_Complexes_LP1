<?php
require_once __DIR__ . '/includes/historique.php';
$historiques = historique_liste(20);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Calculatrice_ℂomplexe — Nombres Complexes</title>

<!-- Bootstrap 5 local (aucun CDN) -->
<link rel="stylesheet" href="bootstrap/css/bootstrap.min.css">
<!-- Polices locales-compatibles (fallback système si hors-ligne) -->
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<div class="page-wrap">
  <!-- ═══════════════════ CALCULATRICE ═══════════════════ -->
  <main class="d-flex justify-content-center align-items-start flex-wrap gap-4 py-4 px-3">

    <div class="calc" id="calc">

      <div class="brand">
        <span class="brand-name">Calculatrice_Complexe</span>
      </div>

      <div class="screen" id="screenBox">
        <!-- Vue normale (calcul) -->
        <div class="sc-view" id="viewCalc">
          <div class="sc-mode" id="scm">— MODE UNAIRE —</div>
          <div class="sc-expr" id="sce"></div>
          <div class="sc-main" id="scv" onclick="onScreenClick()" title="Cliquer pour modifier">0<span class="cursor"></span></div>
          <div class="sc-sub"  id="scs"></div>
        </div>

        <!-- Vue Formules (cachée par défaut) -->
        <div class="sc-view sc-view-hidden" id="viewFormules">
          <div class="sc-mode">— FORMULES UTILISÉES —</div>
          <div class="sc-formules">
            <div class="sf-row"><span class="sf-k">Module</span><span class="sf-v">|z| = √(a²+b²)</span></div>
            <div class="sf-row"><span class="sf-k">Argument</span><span class="sf-v">arg(z) = atan2(b, a)</span></div>
            <div class="sf-row"><span class="sf-k">Conjugué</span><span class="sf-v">z̄ = a − bi</span></div>
            <div class="sf-row"><span class="sf-k">Opposé</span><span class="sf-v">−z = −a − bi</span></div>
            <div class="sf-row"><span class="sf-k">Inverse</span><span class="sf-v">1/z = a/(a²+b²) − [b/(a²+b²)]i</span></div>
            <div class="sf-row"><span class="sf-k">Puissance</span><span class="sf-v">zⁿ = rⁿ(cos nθ + i·sin nθ)</span></div>
            <div class="sf-row"><span class="sf-k">Addition</span><span class="sf-v">(a1+a2) + (b1+b2)i</span></div>
            <div class="sf-row"><span class="sf-k">Soustraction</span><span class="sf-v">(a1−a2) + (b1−b2)i</span></div>
            <div class="sf-row"><span class="sf-k">Multiplication</span><span class="sf-v">(a1a2−b1b2)+(a1b2+b1a2)i</span></div>
            <div class="sf-row"><span class="sf-k">Division</span><span class="sf-v">[(a1a2+b1b2)+(b1a2−a1b2)i]/(a2²+b2²)</span></div>
            <div class="sf-row"><span class="sf-k">Forme exponentielle</span><span class="sf-v">r·e^(iθ)</span></div>
            <div class="sf-row"><span class="sf-k">Forme polaire</span><span class="sf-v">r·(cosθ + i·sinθ)</span></div>
          </div>
        </div>

        <!-- Vue Repère (cachée par défaut) -->
        <div class="sc-view sc-view-hidden" id="viewRepere">
          <div class="sc-mode">— REPÈRE COMPLEXE —</div>
          <canvas id="plane" width="300" height="180"></canvas>
        </div>

        <!-- Vue Historique (cachée par défaut) -->
        <div class="sc-view sc-view-hidden" id="viewHist">
          <div class="sc-mode" style="display:flex;align-items:center;justify-content:space-between;">
            <span>— HISTORIQUE —</span>
            <button class="hist-clear-btn" onclick="clearHist()" title="Effacer l'historique">Effacer</button>
          </div>
          <div class="hist-inner" id="hlist">
            <?php if (empty($historiques)): ?>
              <div class="h-empty">Aucun calcul.</div>
            <?php else: ?>
              <?php foreach ($historiques as $h): ?>
                <div class="hi">
                  <span class="h-op"><?= htmlspecialchars($h['operation']) ?> =</span>
                  <span class="h-res"><?= htmlspecialchars($h['resultat']) ?></span>
                </div>
              <?php endforeach; ?>
            <?php endif; ?>
          </div>
        </div>
      </div>

      <button class="sc-back-btn" id="scBackBtn" onclick="backToCalc()">← Retour au calcul</button>

  
      <div class="mode-bar">
        <button class="mbt on"  onclick="setMode('u',this)">Unaire</button>
        <button class="mbt"     onclick="setMode('b',this)">Binaire</button>
        <button class="mbt mbt-alt" onclick="showFormules()">Formules</button>
        <button class="mbt mbt-alt" onclick="showRepere()">Repère</button>
        <button class="mbt mbt-alt" onclick="showHist()">Hist.</button>
      </div>

      <!-- Sélecteur Z1 / Z2 (visible uniquement en mode Binaire) -->
      <div class="z-selector" id="zSelector" style="display:none">
        <button class="z-sel-btn on" id="btnZ1" onclick="selectZ(1,this)">Z₁</button>
        <div class="z-sel-label" id="zIndicator">Saisie active : Z₁ — Réelle</div>
        <button class="z-sel-btn"    id="btnZ2" onclick="selectZ(2,this)">Z₂</button>
      </div>

      <div class="keypad">
        <!-- Fonctions unaires -->
        <button class="key key-fn" onclick="kFn('opp')"><div class="kf"><span class="kl">−z</span><span class="ks">OPPOSÉ</span></div></button>
        <button class="key key-fn" onclick="kFn('conj')"><div class="kf"><span class="kl">z̄</span><span class="ks">CONJ.</span></div></button>
        <button class="key key-fn" onclick="kFn('inv')"><div class="kf"><span class="kl">1/z</span><span class="ks">INV.</span></div></button>
        
        <button class="key key-fn" onclick="kFn('p2')"><div class="kf"><span class="kl">z²</span><span class="ks">PUISSANCE</span></div></button>
        <button class="key key-fn" onclick="kFn('arg')"><div class="kf"><span class="kl">arg</span><span class="ks">ARG.</span></div></button>
        <button class="key key-fn" onclick="kFn('mod')"><div class="kf"><span class="kl">|z|</span><span class="ks">MODULE</span></div></button>
        
        
        <button class="key key-red" onclick="kClear()"><div class="kf"><span class="kl">C</span><span class="ks">CLEAR</span></div></button>

        <!-- Opérateurs -->
        <button class="key key-num" onclick="kDel()"><div class="kf"><span class="kl">⌫</span></div></button>
        <button class="key key-op" onclick="kOp('+')"><div class="kf"><span class="kl">+</span></div></button>
        <button class="key key-op" onclick="kOp('-')"><div class="kf"><span class="kl">−</span></div></button>
        <button class="key key-op" onclick="kOp('*')"><div class="kf"><span class="kl">×</span></div></button>
        <button class="key key-op" onclick="kOp('/')"><div class="kf"><span class="kl">÷</span></div></button>

        <!-- Chiffres + Re/Im -->
        
        <button class="key key-num" onclick="kN('7')"><div class="kf"><span class="kl">7</span></div></button>
        <button class="key key-num" onclick="kN('8')"><div class="kf"><span class="kl">8</span></div></button>
        <button class="key key-num" onclick="kN('9')"><div class="kf"><span class="kl">9</span></div></button>
        <button class="key key-blue" onclick="kFn('re')"><div class="kf"><span class="kl">Re</span><span class="ks">RÉELLE</span></div></button>
        
        <button class="key key-num" onclick="kN('4')"><div class="kf"><span class="kl">4</span></div></button>
        <button class="key key-num" onclick="kN('5')"><div class="kf"><span class="kl">5</span></div></button>
        <button class="key key-num" onclick="kN('6')"><div class="kf"><span class="kl">6</span></div></button>
        <button class="key key-blue" onclick="kFn('im')"><div class="kf"><span class="kl">Im</span><span class="ks">IMAG.</span></div></button>
        
        <button class="key key-num" onclick="kN('1')"><div class="kf"><span class="kl">1</span></div></button>
        <button class="key key-num" onclick="kN('2')"><div class="kf"><span class="kl">2</span></div></button>
        <button class="key key-num" onclick="kN('3')"><div class="kf"><span class="kl">3</span></div></button>
        <button class="key key-blue" onclick="kSwap()"><div class="kf"><span class="kl" style="font-size:13px;">z↔</span><span class="ks">SWAP</span></div></button>
        
        <button class="key key-num" onclick="kN('0')"><div class="kf"><span class="kl">0</span></div></button>
        <button class="key key-num" onclick="kN('.')"><div class="kf"><span class="kl">.</span></div></button>
        <button class="key key-num" onclick="kN('neg')"><div class="kf"><span class="kl">±</span></div></button>
        <button class="key key-fn" onclick="kPow()">
        <div class="kf"><span class="kl">zⁿ</span><span class="ks">PUISS. n</span></div>
        </button>
        <button class="key key-eq" onclick="kEqual()"><div class="kf"><span class="kl">=</span></div></button>
        
      </div>

    </div>

  </main>



</div>

<script src="bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="assets/js/complex-engine.js"></script>
<script src="assets/js/plane.js"></script>
<script src="assets/js/app.js"></script>
</body>
</html>
