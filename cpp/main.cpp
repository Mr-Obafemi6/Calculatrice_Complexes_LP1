

   #include <stdio.h>
   #include "complex.h"

   /* Affiche un séparateur de section */
   void section(const char* titre) {
      printf("\n======================================================\n");
      printf("  %s\n", titre);
      printf("======================================================\n");
   }

   int main() {
      printf("==============================================\n");
      printf("  CALCULATRICE DE NOMBRES COMPLEXES - TESTS\n");
      printf("==============================================\n");

      /* --------------------------------------------------
         1. CONSTRUCTEURS
         -------------------------------------------------- */
      section("1. CONSTRUCTEURS");

      Complex z1 = crC(2.0, 1.5);
      Complex z2 = crC(1.0, -3.0);
      Complex z3 = crCP(2.5, 0.6435);   // forme polaire

      printf("z1 = "); ecritureC(z1);  printf("\n");
      printf("z2 = "); ecritureC(z2);  printf("\n");
      printf("z3 (polaire r=2.5, arg=0.6435) = "); ecritureC(z3); printf("\n");

      /* --------------------------------------------------
         2. ACCESSEURS
         -------------------------------------------------- */
      section("2. ACCESSEURS");

      printf("Partie reelle de z1   : %.4g\n", partReelC(z1));
      printf("Partie imaginaire z1  : %.4g\n", partImagC(z1));
      printf("Module de z1          : %.4g\n", moduleC(z1));
      printf("Argument de z1 (rad)  : %.4g\n", argumentC(z1));

      /* --------------------------------------------------
         3. AFFICHAGE
         -------------------------------------------------- */
      section("3. AFFICHAGE");

      printf("z1 en cartesien : "); ecritureC(z1);  printf("\n");
      printf("z1 en polaire   : "); ecritureCP(z1); printf("\n");
      printf("z2 en cartesien : "); ecritureC(z2);  printf("\n");
      printf("z2 en polaire   : "); ecritureCP(z2); printf("\n");

      /* --------------------------------------------------
         4. OPÉRATIONS UNAIRES
         -------------------------------------------------- */
      section("4. OPERATIONS UNAIRES");

      Complex opp  = opposeC(z1);
      Complex conj = conjugueC(z1);
      Complex inv  = inverseC(z1);
      Complex puiss = puissanceC(z1, 3);

      printf("Oppose de z1      : "); ecritureC(opp);   printf("\n");
      printf("Conjugue de z1    : "); ecritureC(conj);  printf("\n");
      printf("Inverse de z1     : "); ecritureC(inv);   printf("\n");
      printf("z1^3              : "); ecritureC(puiss); printf("\n");

      /* Vérification : z * z^(-1) doit donner 1 + 0i */
      Complex verif = multiplicationC(z1, inv);
      printf("Verif z1 * 1/z1   : "); ecritureC(verif); printf(" (attendu : 1 + 0i)\n");

      /* --------------------------------------------------
         5. OPÉRATIONS BINAIRES
         -------------------------------------------------- */
      section("5. OPERATIONS BINAIRES");

      Complex add  = additionC(z1, z2);
      Complex sous = soustractionC(z1, z2);
      Complex mult = multiplicationC(z1, z2);
      Complex div  = divisionC(z1, z2);

      printf("z1 = "); ecritureC(z1); printf("\n");
      printf("z2 = "); ecritureC(z2); printf("\n\n");

      printf("z1 + z2 = "); ecritureC(add);  printf("\n");
      printf("z1 - z2 = "); ecritureC(sous); printf("\n");
      printf("z1 * z2 = "); ecritureC(mult); printf("\n");
      printf("z1 / z2 = "); ecritureC(div);  printf("\n");

      /* --------------------------------------------------
         6. CAS LIMITES
         -------------------------------------------------- */
      section("6. CAS LIMITES");

      Complex zero = crC(0.0, 0.0);
      printf("Inverse de 0 : "); inverseC(zero); printf("\n");
      printf("Division par 0 : "); divisionC(z1, zero); printf("\n");
      printf("Puissance 0 de z1 : "); ecritureC(puissanceC(z1, 0)); printf(" (attendu : 1 + 0i)\n");
      printf("Puissance -1 de z1 : "); ecritureC(puissanceC(z1, -1)); printf("\n");

      printf("\n==============================================\n");
      printf("  FIN DES TESTS\n");
      printf("==============================================\n");

      return 0;
   }
