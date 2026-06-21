-- ═══════════════════════════════════════════════════════════════
--  schema.sql — Base de données Calculatrice à Nombres Complexes
--  LP1 Développement d'Applications 2025-2026
-- ═══════════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS calculatrice_complexe
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE calculatrice_complexe;

CREATE TABLE IF NOT EXISTS historiques (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    operation   VARCHAR(255) NOT NULL,
    resultat    VARCHAR(255) NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
