

function drawPlane(z1, z2 = null) {
    const canvas = document.getElementById('plane');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const pts  = [z1, z2].filter(Boolean);
    const maxV = Math.max(...pts.map(z => Math.max(Math.abs(z.a), Math.abs(z.b))), 3) * 1.5;
    const cx = W / 2, cy = H / 2;
    const sc = Math.min(cx, cy) * 0.80 / maxV;

    /* Grille */
    ctx.strokeStyle = 'rgba(74,222,128,0.07)'; ctx.lineWidth = 0.5;
    for (let v = -Math.ceil(maxV); v <= Math.ceil(maxV); v++) {
        if (!v) continue;
        const px = cx + v * sc, py = cy - v * sc;
        ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke();
    }

    /* Axes */
    ctx.strokeStyle = 'rgba(74,222,128,0.35)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(4, cy); ctx.lineTo(W - 4, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 4); ctx.lineTo(cx, H - 4); ctx.stroke();

    /* Labels */
    ctx.font = '9px "Share Tech Mono", monospace';
    ctx.fillStyle = 'rgba(74,222,128,0.45)';
    ctx.fillText('Re', W - 18, cy - 6);
    ctx.fillText('Im', cx + 5, 13);

    /* Vecteur z1 */
    drawVec(ctx, cx, cy, z1, sc, '#4ade80');
    /* Vecteur résultat (z2) */
    if (z2) drawVec(ctx, cx, cy, z2, sc, '#60a5fa');
}

function drawVec(ctx, cx, cy, z, sc, color) {
    const zx = cx + z.a * sc;
    const zy = cy - z.b * sc;

    ctx.setLineDash([3, 3]); ctx.strokeStyle = color + '55'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(zx, zy); ctx.lineTo(zx, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(zx, zy); ctx.lineTo(cx, zy); ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(zx, zy); ctx.stroke();

    const ang = Math.atan2(zy - cy, zx - cx);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(zx, zy);
    ctx.lineTo(zx - 9 * Math.cos(ang - 0.4), zy - 9 * Math.sin(ang - 0.4));
    ctx.lineTo(zx - 9 * Math.cos(ang + 0.4), zy - 9 * Math.sin(ang + 0.4));
    ctx.closePath(); ctx.fill();

    ctx.beginPath(); ctx.arc(zx, zy, 3, 0, 2 * Math.PI); ctx.fill();
}
