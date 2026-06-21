<?php
/**
 * historique.php — Fonctions de gestion de l'historique des calculs
 * Calculatrice à Nombres Complexes — LP1 DA 2025-2026
 */
require_once __DIR__ . '/db.php';

/**
 * historique_ajouter() — Enregistre un calcul dans l'historique.
 */
function historique_ajouter(string $operation, string $resultat): bool {
    $pdo = getPDO();
    if (!$pdo) return false;
    try {
        $stmt = $pdo->prepare(
            "INSERT INTO historiques (operation, resultat, created_at) VALUES (?, ?, NOW())"
        );
        return $stmt->execute([$operation, $resultat]);
    } catch (PDOException $e) {
        return false;
    }
}

/**
 * historique_liste() — Retourne les N derniers calculs (par défaut 50).
 */
function historique_liste(int $limite = 50): array {
    $pdo = getPDO();
    if (!$pdo) return [];
    try {
        $stmt = $pdo->prepare(
            "SELECT id, operation, resultat, created_at FROM historiques ORDER BY id DESC LIMIT ?"
        );
        $stmt->bindValue(1, $limite, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    } catch (PDOException $e) {
        return [];
    }
}

/**
 * historique_effacer() — Supprime tout l'historique.
 */
function historique_effacer(): bool {
    $pdo = getPDO();
    if (!$pdo) return false;
    try {
        $pdo->exec("TRUNCATE TABLE historiques");
        return true;
    } catch (PDOException $e) {
        return false;
    }
}
