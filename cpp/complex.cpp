    

    #include "complex.h"
    #include <stdio.h>
    #include <math.h>

    /* =========================================================
    CONSTRUCTEURS
    ========================================================= */

    /**
    * crC : Crée un nombre complexe z = a + b*i
    * Paramètres :
    *   partReel : partie réelle (a)
    *   partImag : partie imaginaire (b)
    * Retour : le complexe z = a + b*i
    */
    Complex crC(double partReel, double partImag) {
        Complex z;
        z.partReel = partReel;
        z.partImag = partImag;
        return z;
    }

    /**
    * crCP : Crée un nombre complexe à partir de sa forme polaire
    * Formule : a = r*cos(θ),  b = r*sin(θ)
    * Paramètres :
    *   module   : r = |z| >= 0
    *   argument : θ ∈ [-π, +π] en radians
    * Retour : le complexe z = r*(cos θ + i*sin θ)
    */
    Complex crCP(double module, double argument) {
        Complex z;
        z.partReel = module * cos(argument);
        z.partImag = module * sin(argument);
        return z;
    }

    /* =========================================================
    ACCESSEURS
    ========================================================= */

    /**
    * partReelC : Retourne la partie réelle de z
    */
    double partReelC(Complex z) {
        return z.partReel;
    }

    /**
    * partImagC : Retourne la partie imaginaire de z
    */
    double partImagC(Complex z) {
        return z.partImag;
    }

    /**
    * moduleC : Retourne le module de z
    * Formule : |z| = sqrt(a² + b²)
    */
    double moduleC(Complex z) {
        return sqrt(z.partReel * z.partReel + z.partImag * z.partImag);
    }

    /**
    * argumentC : Retourne l'argument de z en radians dans ]-π, +π]
    * Utilise atan2(b, a) qui gère tous les quadrants
    */
    double argumentC(Complex z) {
        return atan2(z.partImag, z.partReel);
    }

    /* =========================================================
    AFFICHAGE
    ========================================================= */

    /**
    * ecritureC : Affiche z sous la forme cartésienne (a + b i)
    * Exemples : (2 + 1.5 i)  ou  (3 - 2 i)
    */
    void ecritureC(Complex z) {
        if (z.partImag >= 0)
            printf("(%.4g + %.4g i)", z.partReel, z.partImag);
        else
            printf("(%.4g - %.4g i)", z.partReel, -z.partImag);
    }

    /**
    * ecritureCP : Affiche z sous la forme polaire (module, argument)
    * Exemple : (2.5, 0.6435)
    */
    void ecritureCP(Complex z) {
        printf("(%.4g, %.4g)", moduleC(z), argumentC(z));
    }

    /* =========================================================
    OPÉRATIONS UNAIRES
    ========================================================= */

    /**
    * opposeC : Retourne l'opposé de z
    * Formule : -z = (-a) + (-b)*i
    */
    Complex opposeC(Complex z) {
        return crC(-z.partReel, -z.partImag);
    }

    /**
    * conjugueC : Retourne le conjugué de z
    * Formule : z* = a - b*i
    */
    Complex conjugueC(Complex z) {
        return crC(z.partReel, -z.partImag);
    }

    /**
    * inverseC : Retourne l'inverse de z (z ≠ 0)
    * Formule : 1/z = z* / |z|²  = (a - b*i) / (a² + b²)
    */
    Complex inverseC(Complex z) {
        double denom = z.partReel * z.partReel + z.partImag * z.partImag;
        if (denom == 0.0) {
            printf("Erreur : division par zero (module nul)\n");
            return crC(0.0, 0.0);
        }
        return crC(z.partReel / denom, -z.partImag / denom);
    }

    /**
    * puissanceC : Retourne z^n (n entier relatif)
    * Formule polaire : z^n = r^n * (cos(n*θ) + i*sin(n*θ))
    * (Théorème de De Moivre)
    */
    Complex puissanceC(Complex z, int n) {
        double r     = moduleC(z);
        double theta = argumentC(z);
        double rn    = pow(r, n);
        return crC(rn * cos(n * theta), rn * sin(n * theta));
    }

    /* =========================================================
    OPÉRATIONS BINAIRES
    ========================================================= */

    /**
    * additionC : Retourne z1 + z2
    * Formule : (a1+a2) + (b1+b2)*i
    */
    Complex additionC(Complex z1, Complex z2) {
        return crC(z1.partReel + z2.partReel, z1.partImag + z2.partImag);
    }

    /**
    * soustractionC : Retourne z1 - z2
    * Formule : (a1-a2) + (b1-b2)*i
    */
    Complex soustractionC(Complex z1, Complex z2) {
        return crC(z1.partReel - z2.partReel, z1.partImag - z2.partImag);
    }

    /**
    * multiplicationC : Retourne z1 * z2
    * Formule : (a1*a2 - b1*b2) + (a1*b2 + a2*b1)*i
    */
    Complex multiplicationC(Complex z1, Complex z2) {
        double re = z1.partReel * z2.partReel - z1.partImag * z2.partImag;
        double im = z1.partReel * z2.partImag + z1.partImag * z2.partReel;
        return crC(re, im);
    }

    /**
    * divisionC : Retourne z1 / z2 (z2 ≠ 0)
    * Formule : z1/z2 = (z1 * z2*) / |z2|²
    *         = [(a1*a2 + b1*b2) + (b1*a2 - a1*b2)*i] / (a2² + b2²)
    */
    Complex divisionC(Complex z1, Complex z2) {
        double denom = z2.partReel * z2.partReel + z2.partImag * z2.partImag;
        if (denom == 0.0) {
            printf("Erreur : division par zero (diviseur nul)\n");
            return crC(0.0, 0.0);
        }
        double re = (z1.partReel * z2.partReel + z1.partImag * z2.partImag) / denom;
        double im = (z1.partImag * z2.partReel - z1.partReel * z2.partImag) / denom;
        return crC(re, im);
    }
