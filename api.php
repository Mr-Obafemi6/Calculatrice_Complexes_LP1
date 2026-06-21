<?php
/**
 * api.php — Point d'entrée AJAX pour l'historique
 * Actions :
 *   POST  action=ajouter   &operation=...&resultat=...
 *   GET   action=liste
 *   POST  action=effacer
 */
require_once __DIR__ . '/includes/historique.php';

header('Content-Type: application/json; charset=utf-8');

$action = $_REQUEST['action'] ?? '';

switch ($action) {

    case 'ajouter':
        $operation = trim($_POST['operation'] ?? '');
        $resultat  = trim($_POST['resultat'] ?? '');
        if ($operation === '' || $resultat === '') {
            echo json_encode(['ok' => false, 'error' => 'Paramètres manquants']);
            exit;
        }
        $ok = historique_ajouter($operation, $resultat);
        echo json_encode(['ok' => $ok]);
        break;

    case 'liste':
        $items = historique_liste(50);
        echo json_encode(['ok' => true, 'items' => $items]);
        break;

    case 'effacer':
        $ok = historique_effacer();
        echo json_encode(['ok' => $ok]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Action inconnue']);
}
