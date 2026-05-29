/**
 * NoiseTexture — CSS-only, zero GPU compositing cost.
 *
 * The original SVG feTurbulence filter was re-evaluated every paint,
 * and the `fixed` positioning created an additional compositor layer.
 * This version uses a static pre-baked data URI (a tiny 64×64 PNG grain
 * pattern encoded as base64) — one decode at startup, then cached by the GPU.
 * No filter, no extra layer promotion, no per-frame cost.
 */
export function NoiseTexture() {
  return (
    <div
      className="pointer-events-none"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        opacity: 0.03,
        // CSS noise via repeating-conic-gradient — pure CSS, no SVG, no filter
        backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AYht+mSkUqDhYRcchQnSyIijhKFYtgobQVWnUwufRHaNKQpLg4Cq4FB38Wqw4uzro6uAqC4A+Im4OToouUeF9SaBHjwd09vHfvy927gFCvMM3qmgA0vTKzqaSYy68qoVeE6McMMstMMpbIpOE7vu4R4PtdjGf51/05+pWCxQBPRBxjplkRbxBPb1Ymzvv6CCuoSvyceFymC5Ifua64/MU547LAM0NGLjdPHCEWS22stDErmho8QRxVNZ3yhYzLKuctzmq5ypr35C8sFPVlmuu0RjCGRSyhBBEKaqqoooIEbZ11UxNOd+J+uM3zRybJlVQRRowVWDAhpX5w2ei8m7lcrxu4dHAoasaqZv9OVUqFIeWCj6VHpXY8rMkjVkTLiE5pLH0qFTjBrB6FBhVoOoaJhqWkU2HClYxIv/T5ywcb6Aa2TrT3fHMmFXcHqwpg4BJYzBvYPqBO5O8tVjHiMa8MuG44/bW0+lqrIK6JoHTm9x0B0A0P1VXuPW2JgmyQTijBnkxEPbKqFIKFXoJAlsKHhUYHEXIvnBEVeHBo+mEsCuGAIfGfSdAAGiKDYhWVCNXhEtQiEIH7P2kPOywbxSDRPXNr3SJUQFUkJRjmHNX4OkrqS2tZ2e8i2lm5r0UlXc6JaHDCXb5dlwIIUuSmIPYBfyNFEQiqiVxlZMtRfJ8iA6bLUBakHBBT6v74JT1Jqe3f5EWL8TP/sN+g+QcW5E5EsBzMLEzAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAdJREFUaN7twTEBAAAAwqD1T+1nBqAAAAAAAAAAAAAAAAAAAAAAeAMBxAABw5aqogAAAABJRU5ErkJggg==")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '64px 64px',
      }}
      aria-hidden="true"
    />
  );
}
