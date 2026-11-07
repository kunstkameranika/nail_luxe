// The air: slow domain-warped noise in cream and pale amber veils behind the hero and the close.
// Half resolution, paused off screen and when the tab is hidden; one still frame under reduced motion.
(function () {
  var canvas = document.querySelector("canvas.air");
  if (!canvas) return;
  var gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false, alpha: false });
  if (!gl) { canvas.remove(); return; }
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var vs = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";
  var fs = [
    "precision mediump float;",
    "uniform vec2 r; uniform float t; uniform vec2 m;",
    "float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }",
    "float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);",
    "  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }",
    "float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int k = 0; k < 5; k++){ v += a*n(p); p = p*2.03 + 7.1; a *= 0.5; } return v; }",
    "void main(){",
    "  vec2 uv = gl_FragCoord.xy / r; vec2 p = uv * vec2(r.x/r.y, 1.0) * 1.6;",
    "  p.y -= t * 0.018;",
    "  vec2 q = vec2(fbm(p + vec2(0.0, t*0.01)), fbm(p + vec2(5.2, 1.3)));",
    "  float d = distance(uv, m); q += 0.25 * exp(-d*d*18.0);",
    "  float v = fbm(p + 2.2*q);",
    "  vec3 paper = vec3(0.937, 0.918, 0.890);",
    "  vec3 cream = vec3(0.965, 0.945, 0.905);",
    "  vec3 amber = vec3(0.925, 0.868, 0.790);",
    "  vec3 rose  = vec3(0.930, 0.885, 0.865);",
    "  vec3 c = mix(paper, cream, smoothstep(0.35, 0.75, v));",
    "  c = mix(c, amber, smoothstep(0.55, 0.95, q.x) * 0.55);",
    "  c = mix(c, rose, smoothstep(0.6, 1.0, q.y) * 0.35);",
    "  gl_FragColor = vec4(c, 1.0);",
    "}"
  ].join("\n");

  function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
  var pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { canvas.remove(); return; }
  gl.useProgram(pr);
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(pr, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var uR = gl.getUniformLocation(pr, "r"), uT = gl.getUniformLocation(pr, "t"), uM = gl.getUniformLocation(pr, "m");

  var mx = 0.5, my = 0.5, tx = 0.5, ty = 0.5;
  function size() {
    var w = Math.max(1, Math.round(innerWidth / 2)), h = Math.max(1, Math.round(innerHeight / 2));
    canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); gl.uniform2f(uR, w, h);
  }
  function draw(ms) {
    mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
    gl.uniform1f(uT, still ? 12.0 : ms / 1000);
    gl.uniform2f(uM, mx, my);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  size();
  addEventListener("resize", function () { size(); if (still) draw(0); });
  if (still) { draw(0); return; }

  addEventListener("pointermove", function (e) { tx = e.clientX / innerWidth; ty = 1 - e.clientY / innerHeight; }, { passive: true });
  var zones = Array.prototype.slice.call(document.querySelectorAll(".air-zone")), visible = true, raf = 0;
  if ("IntersectionObserver" in window && zones.length) {
    var seen = new Set();
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.isIntersecting ? seen.add(e.target) : seen.delete(e.target); });
      visible = seen.size > 0; tick();
    });
    zones.forEach(function (z) { io.observe(z); });
  }
  document.addEventListener("visibilitychange", tick);
  function loop(ms) { draw(ms); raf = requestAnimationFrame(loop); }
  function tick() {
    var run = visible && !document.hidden;
    if (run && !raf) raf = requestAnimationFrame(loop);
    if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
  }
  tick();
})();
