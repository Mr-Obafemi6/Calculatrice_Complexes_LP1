<?php
/**
 * db.php — Connexion à la base de données MySQL (PDO)
 * Calculatrice à Nombres Complexes — LP1 DA 2025-2026
 *
 * Utilisé uniquement pour l'historique des calculs.
 * Si la base n'est pas configurée, l'application continue de
 * fonctionner normalement (l'historique reste simplement vide).
 */

define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'calculatrice-complexe');
define('DB_USER', 'root');
define('DB_PASS', '');

/**
 * getPDO() — Retourne une connexion PDO ou null si indisponible.
 */
function getPDO() {
    static $pdo = null;
    static $tried = false;

    if ($pdo !== null) return $pdo;
    if ($tried) return null;
    $tried = true;

    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        // Base non disponible : on continue sans historique persistant
        return null;
    }
}
