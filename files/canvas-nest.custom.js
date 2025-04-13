window.CanvasNest = function({
  count = 99,
  speed = 1,
  pointSize = 1,
  lineScale = 1,
  color = "0,0,0",
  opacity = 0.5,
  zIndex = -1,
  bgColor = "transparent"
} = {}) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const points = [];
  let width, height;

  const mouse = { x: null, y: null, max: 20000 };

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    const all = [mouse].concat(points);
    points.forEach(p => {
      p.x += p.xa;
      p.y += p.ya;
      p.xa *= (p.x > width || p.x < 0) ? -1 : 1;
      p.ya *= (p.y > height || p.y < 0) ? -1 : 1;

      context.fillStyle = `rgba(${color},1)`;
      context.fillRect(p.x - pointSize / 2, p.y - pointSize / 2, pointSize, pointSize);

      for (let i = 0; i < all.length; i++) {
        const q = all[i];
        if (p !== q && q.x !== null && q.y !== null) {
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < q.max) {
            if (q === mouse && dist2 > q.max / 2) {
              p.x -= 0.03 * dx;
              p.y -= 0.03 * dy;
            }
            const ratio = (q.max - dist2) / q.max;
            context.beginPath();
            context.lineWidth = ratio / 2 * lineScale;
            context.strokeStyle = `rgba(${color},${ratio + 0.2})`;
            context.moveTo(p.x, p.y);
            context.lineTo(q.x, q.y);
            context.stroke();
          }
        }
      }
      all.splice(all.indexOf(p), 1);
    });

    requestAnimationFrame(draw);
  }

  canvas.style.cssText = `position:fixed;top:0;left:0;z-index:${zIndex};opacity:${opacity};background:${bgColor}`;
  document.body.appendChild(canvas);
  resizeCanvas();
  window.onresize = resizeCanvas;

  window.onmousemove = function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };
  window.onmouseout = function() {
    mouse.x = null;
    mouse.y = null;
  };

  for (let i = 0; i < count; i++) {
    points.push({
      x: Math.random() * width,
      y: Math.random() * height,
      xa: (2 * Math.random() - 1) * speed,
      ya: (2 * Math.random() - 1) * speed,
      max: 6000
    });
  }

  draw();

  return () => canvas.remove();
};
