# Calculatrice à Nombres Complexes — PHP + Bootstrap + JavaScript

**Projet LP1 Développement d'Applications 2025–2026**
Coordonnateur : Dr KPOGLI Komla Agbessinyale

Interface "machine" validée par le professeur, reconstruite en **PHP simple
(sans framework)**, Bootstrap 5 (local) et JavaScript natif.

---

## Stack technique
- **PHP 8.1+** — fichiers `.php` classiques, pas de framework
- **Bootstrap 5.3** — local (pas de CDN), dans `bootstrap/`
- **JavaScript ES6+** — moteur de calcul, repère graphique, AJAX
- **MySQL** — historique des calculs (optionnel : l'app fonctionne sans)
- **C** — module natif conforme au sujet (`cpp/`)

---

## Structure du projet

```
index.php                  ← Page principale (calculatrice "machine")
guide.php                  ← Guide d'utilisation
api.php                    ← Endpoint AJAX (historique)
includes/
  db.php                   ← Connexion PDO MySQL
  ComplexService.php       ← 16 fonctions PHP (miroir de complex.cpp)
  historique.php           ← Fonctions CRUD historique
assets/
  css/style.css            ← Style de la calculatrice (identique au validé)
  css/guide.css            ← Style de la page Guide
  js/complex-engine.js     ← Objet Cx : 16 fonctions JS
  js/plane.js               ← Dessin du repère (plan de Gauss) en Canvas
  js/app.js                ← Logique des boutons + historique AJAX
bootstrap/
  css/bootstrap.min.css
  js/bootstrap.bundle.min.js
cpp/
  complex.h                ← Interface du module C (fournie par le sujet)
  complex.cpp               ← Implémentation des 16 fonctions
  main.cpp                  ← Programme de test
data/
  schema.sql                ← Script de création de la base de données
docs/
  Rapport_CahierDesCharges_LP1_DA.docx
```

---

## Installation

### 1. Prérequis
- PHP 8.1+ avec extension `pdo_mysql`
- MySQL 5.7+ (optionnel — l'app fonctionne aussi sans base)
- Un serveur web (PHP intégré, Apache/Laragon/XAMPP)

### 2. Base de données (optionnel mais recommandé)
```sql
-- Exécuter le script fourni :
mysql -u root -p < data/schema.sql
```
Vérifier les identifiants dans `includes/db.php` (DB_HOST, DB_NAME, DB_USER, DB_PASS).

### 3. Lancer le serveur
```bash
php -S localhost:8000
```
Puis ouvrir : http://localhost:8000

---

## Compiler et tester le module C

```bash
cd cpp
g++ -o test_complex main.cpp complex.cpp -lm
./test_complex
```

---

## Les 16 fonctions implémentées (C, PHP, JS)

| Fonction | Formule |
|---|---|
| crC(a, b) | z = a + bi |
| crCP(r, θ) | z = r·cos(θ) + r·sin(θ)·i |
| partReelC(z) | Retourne a |
| partImagC(z) | Retourne b |
| moduleC(z) | \|z\| = √(a²+b²) |
| argumentC(z) | arg(z) = atan2(b, a) |
| ecritureC(z) | Affiche (a + bi) |
| ecritureCP(z) | Affiche (r, θ) |
| opposeC(z) | −z = −a − bi |
| conjugueC(z) | z̄ = a − bi |
| inverseC(z) | 1/z = a/(a²+b²) − [b/(a²+b²)]i |
| puissanceC(z, n) | zⁿ = rⁿ(cos nθ + i sin nθ) |
| additionC(z1, z2) | (a1+a2) + (b1+b2)i |
| soustractionC(z1, z2) | (a1−a2) + (b1−b2)i |
| multiplicationC(z1, z2) | (a1a2−b1b2) + (a1b2+b1a2)i |
| divisionC(z1, z2) | [(a1a2+b1b2)+(b1a2−a1b2)i]/(a2²+b2²) |
