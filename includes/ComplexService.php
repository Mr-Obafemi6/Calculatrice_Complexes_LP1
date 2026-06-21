<?php
/**
 * ComplexService.php — Implémentation PHP des 16 fonctions sur les
 * nombres complexes, miroir exact de cpp/complex.cpp.
 * Représentation : un complexe est un tableau associatif
 *   ['re' => float, 'im' => float]
 */

class ComplexService
{
    /* =========================================================
        CONSTRUCTEURS
       ========================================================= */

    /** crC — Crée z = a + bi à partir de deux réels. */
    public static function crC(float $a, float $b): array
    {
        return ['re' => $a, 'im' => $b];
    }

    /** crCP — Crée z à partir du module r et de l'argument θ (rad). */
    public static function crCP(float $r, float $theta): array
    {
        return [
            're' => $r * cos($theta),
            'im' => $r * sin($theta),
        ];
    }

    /* =========================================================
        ACCESSEURS
       ========================================================= */

    public static function partReelC(array $z): float { return $z['re']; }
    public static function partImagC(array $z): float { return $z['im']; }

    /** moduleC — |z| = sqrt(a² + b²) */
    public static function moduleC(array $z): float
    {
        return sqrt($z['re'] ** 2 + $z['im'] ** 2);
    }

    /** argumentC — arg(z) = atan2(b, a) */
    public static function argumentC(array $z): float
    {
        return atan2($z['im'], $z['re']);
    }

    /* =========================================================
        AFFICHAGE
       ========================================================= */

    /** ecritureC — "(a + bi)" ou "(a - |b|i)" */
    public static function ecritureC(array $z): string
    {
        $a = round($z['re'], 4);
        $b = round($z['im'], 4);
        return $b >= 0 ? "($a + {$b}i)" : "($a - " . abs($b) . "i)";
    }

    /** ecritureCP — "(r, θ)" */
    public static function ecritureCP(array $z): string
    {
        $r = round(self::moduleC($z), 4);
        $t = round(self::argumentC($z), 4);
        return "($r, $t)";
    }

    /* =========================================================
        OPÉRATIONS UNAIRES
       ========================================================= */

    /** opposeC — -z = -a - bi */
    public static function opposeC(array $z): array
    {
        return self::crC(-$z['re'], -$z['im']);
    }

    /** conjugueC — z̄ = a - bi */
    public static function conjugueC(array $z): array
    {
        return self::crC($z['re'], -$z['im']);
    }

    /**
     * inverseC — 1/z = a/(a²+b²) - b/(a²+b²)i
     * @throws DivisionByZeroError si z = 0
     */
    public static function inverseC(array $z): array
    {
        $d = $z['re'] ** 2 + $z['im'] ** 2;
        if ($d == 0.0) {
            throw new DivisionByZeroError("inverseC : division par zéro (z = 0)");
        }
        return self::crC($z['re'] / $d, -$z['im'] / $d);
    }

    /** puissanceC — z^n = r^n (cos(nθ) + i sin(nθ))  [De Moivre] */
    public static function puissanceC(array $z, int $n): array
    {
        $r   = self::moduleC($z);
        $arg = self::argumentC($z);
        $rn  = $r ** $n;
        return self::crC($rn * cos($n * $arg), $rn * sin($n * $arg));
    }

    /* =========================================================
        OPÉRATIONS BINAIRES
       ========================================================= */

    /** additionC — (a1+a2) + (b1+b2)i */
    public static function additionC(array $z1, array $z2): array
    {
        return self::crC($z1['re'] + $z2['re'], $z1['im'] + $z2['im']);
    }

    /** soustractionC — (a1-a2) + (b1-b2)i */
    public static function soustractionC(array $z1, array $z2): array
    {
        return self::crC($z1['re'] - $z2['re'], $z1['im'] - $z2['im']);
    }

    /** multiplicationC — (a1a2-b1b2) + (a1b2+b1a2)i */
    public static function multiplicationC(array $z1, array $z2): array
    {
        $re = $z1['re'] * $z2['re'] - $z1['im'] * $z2['im'];
        $im = $z1['re'] * $z2['im'] + $z1['im'] * $z2['re'];
        return self::crC($re, $im);
    }

    /**
     * divisionC — [(a1a2+b1b2) + (b1a2-a1b2)i] / (a2²+b2²)
     * @throws DivisionByZeroError si z2 = 0
     */
    public static function divisionC(array $z1, array $z2): array
    {
        $d = $z2['re'] ** 2 + $z2['im'] ** 2;
        if ($d == 0.0) {
            throw new DivisionByZeroError("divisionC : division par zéro (z2 = 0)");
        }
        $re = ($z1['re'] * $z2['re'] + $z1['im'] * $z2['im']) / $d;
        $im = ($z1['im'] * $z2['re'] - $z1['re'] * $z2['im']) / $d;
        return self::crC($re, $im);
    }
}
