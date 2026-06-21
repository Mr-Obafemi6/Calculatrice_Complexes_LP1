
const Cx = {

    /* Constructeurs */
    crC:  (a, b) => ({ a, b }),
    crCP: (r, theta) => ({ a: r * Math.cos(theta), b: r * Math.sin(theta) }),

    /* Accesseurs */
    re:  z => z.a,
    im:  z => z.b,
    mod: z => Math.sqrt(z.a * z.a + z.b * z.b),
    arg: z => Math.atan2(z.b, z.a),

    /* Opérations unaires */
    opp:  z => ({ a: -z.a, b: -z.b }),
    conj: z => ({ a: z.a, b: -z.b }),
    inv:  z => {
        const d = z.a * z.a + z.b * z.b;
        if (d === 0) return null; // division par zéro
        return { a: z.a / d, b: -z.b / d };
    },
    pow: (z, n) => {
        const r = Math.pow(Cx.mod(z), n);
        const t = Cx.arg(z) * n;
        return { a: r * Math.cos(t), b: r * Math.sin(t) };
    },

    /* Opérations binaires */
    add: (z1, z2) => ({ a: z1.a + z2.a, b: z1.b + z2.b }),
    sub: (z1, z2) => ({ a: z1.a - z2.a, b: z1.b - z2.b }),
    mul: (z1, z2) => ({
        a: z1.a * z2.a - z1.b * z2.b,
        b: z1.a * z2.b + z1.b * z2.a,
    }),
    div: (z1, z2) => {
        const d = z2.a * z2.a + z2.b * z2.b;
        if (d === 0) return null; // division par zéro
        return {
            a: (z1.a * z2.a + z1.b * z2.b) / d,
            b: (z1.b * z2.a - z1.a * z2.b) / d,
        };
    },
};

/* ── Formatage ── */
const g = (x, d = 4) => {
    if (Math.abs(x) < 1e-10) return '0';
    return parseFloat(x.toPrecision(d)).toString();
};
const fz = z => {
    if (!z) return 'ERR';
    const s = z.b >= 0 ? '+ ' : '- ';
    return `${g(z.a)} ${s}${g(Math.abs(z.b))}i`;
};
const fp = z => !z ? '' : ` polaire:(${g(Cx.mod(z))}; ${g(Cx.arg(z))}rad)`;

