/* complex.h */
#ifndef COMPLEX_H
#define COMPLEX_H

#include <math.h>
#include <stdio.h>

#ifndef M_PI
#define M_PI 3.1415926535
#endif

typedef struct {
    double partReel;  // partie réelle
    double partImag;  // partie imaginaire
} Complex;

/* =========================================================
   CONSTRUCTEURS
   ========================================================= */

// Crée un nombre complexe à partir de sa partie réelle et imaginaire
Complex crC(double partReel, double partImag);

// Crée un nombre complexe à partir de son module et de son argument (en radians)
Complex crCP(double module, double argument);

/* =========================================================
   ACCESSEURS
   ========================================================= */

// Retourne la partie réelle de z
double partReelC(Complex z);

// Retourne la partie imaginaire de z
double partImagC(Complex z);

// Retourne le module de z : |z| = sqrt(a² + b²)
double moduleC(Complex z);

// Retourne l'argument de z en radians (entre -π et +π)
double argumentC(Complex z);

/* =========================================================
   AFFICHAGE
   ========================================================= */

// Affiche z sous la forme cartésienne : (a + b i)
void ecritureC(Complex z);

// Affiche z sous la forme polaire : (module, argument)
void ecritureCP(Complex z);

/* =========================================================
   OPÉRATIONS UNAIRES
   ========================================================= */

// Retourne l'opposé de z : -z
Complex opposeC(Complex z);

// Retourne le conjugué de z : a - b i
Complex conjugueC(Complex z);

// Retourne l'inverse de z : 1/z
Complex inverseC(Complex z);

// Retourne z élevé à la puissance entière n
Complex puissanceC(Complex z, int n);

/* =========================================================
   OPÉRATIONS BINAIRES
   ========================================================= */

// Retourne z1 + z2
Complex additionC(Complex z1, Complex z2);

// Retourne z1 - z2
Complex soustractionC(Complex z1, Complex z2);

// Retourne z1 * z2
Complex multiplicationC(Complex z1, Complex z2);

// Retourne z1 / z2
Complex divisionC(Complex z1, Complex z2);

#endif /* COMPLEX_H */
