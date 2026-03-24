(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/components/PixelShaderOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PixelShaderOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
/* ── GLSL ──────────────────────────────────────────────────────── */ const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
/*
 * Sub-letter pixel-shader + stretch:
 *
 *   The STRETCH is achieved by making pixel blocks ANISOTROPIC — elongated
 *   radially away from the cursor, normal in the perpendicular direction.
 *   Crucially, UV sampling always happens at the block's own position (no
 *   displacement toward/away from cursor), so transparent areas never
 *   accidentally sample letter pixels and create a bloom/glow artefact.
 *
 *   All quantisation is done in canvas-pixel space so the block sizes are
 *   consistent in screen pixels regardless of canvas aspect ratio.
 */ const frag = /* glsl */ `
  precision highp float;

  uniform sampler2D uTex;
  uniform float     uHover;
  uniform vec2      uMouseUV;  /* lerped cursor — UV (0-1), Y flipped for WebGL */
  uniform vec2      uAnchorUV; /* hovered character anchor UV (0-1)              */
  uniform float     uAspect;   /* width / height — makes Gaussian circular       */
  uniform vec2      uRes;
  varying vec2      vUv;

  void main() {
    /* ── aspect-corrected Gaussian → circular influence in screen space ── */
    vec2  dAC   = (vUv - uMouseUV) * vec2(uAspect, 1.0);
    float gauss  = exp(-dot(dAC, dAC) * 10.0);
    float effect = gauss * uHover;

    if (effect < 0.02) { gl_FragColor = vec4(0.0); return; }

    /* ── localized "pull" so only the hovered character deforms ── */
    vec2  anchor = (uAnchorUV.x < 0.0) ? uMouseUV : uAnchorUV;
    vec2  dPullAC = (vUv - anchor) * vec2(uAspect, 1.0);
    float pull  = exp(-dot(dPullAC, dPullAC) * 34.0) * uHover;

    /* IMPORTANT: warp direction is relative to the hovered letter anchor,
       so only that letter region gets "pulled", not the whole word. */
    vec2  warpUv = vUv - (vUv - anchor) * (0.12 * pull);

    /* ── magnify effect (local zoom) around hovered letter ── */
    float mag = 1.0 + 0.45 * pull;         /* max ~1.45x */
    vec2  magUv = anchor + (warpUv - anchor) / mag;
    magUv = clamp(magUv, 0.0, 1.0);

    /* ── radial + perpendicular axes in canvas-pixel space ── */
    vec2  uvPx  = magUv * uRes;
    vec2  rawPx = uvPx - uMouseUV * uRes;
    float lenPx = length(rawPx) + 0.001;
    vec2  sDir  = rawPx / lenPx;               /* unit radial direction   */
    vec2  pDir  = vec2(-sDir.y, sDir.x);       /* unit perpendicular       */

    /* ── anisotropic block size:
         radially elongated (stretch look), normal perpendicularly ── */
    float basePx   = mix(1.0, 9.0,  smoothstep(0.0, 0.85, effect));
    float radialPx = mix(basePx, basePx * 2.8, smoothstep(0.0, 1.0, effect));

    /* project uvPx onto rotated axes, quantise independently, reconstruct */
    float pR  = dot(uvPx, sDir);
    float pP  = dot(uvPx, pDir);
    vec2  blk = (floor(pR / radialPx) + 0.5) * radialPx * sDir
              + (floor(pP / basePx  ) + 0.5) * basePx   * pDir;
    vec2  pixUv = clamp(blk / uRes, 0.0, 1.0);

    /* ── directional chromatic aberration (subtle) ── */
    vec2  sDirUV = normalize(vec2(sDir.x / uRes.x, sDir.y / uRes.y));
    vec2  ca     = sDirUV * effect * 0.004;
    float r = texture2D(uTex, clamp(pixUv + ca, 0.0, 1.0)).r;
    float g = texture2D(uTex, pixUv).g;
    float b = texture2D(uTex, clamp(pixUv - ca, 0.0, 1.0)).b;
    float a = texture2D(uTex, pixUv).a;

    /* alpha = texture alpha × Gaussian → soft edge, self-masking on glyph */
    gl_FragColor = vec4(r, g, b, a * effect);
  }
`;
function PixelShaderOverlay({ targetRef, displayText, enabled = true, domCharSelector }) {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cleanupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PixelShaderOverlay.useEffect": ()=>{
            let mounted = true;
            if (!enabled) return;
            async function init() {
                await document.fonts.ready;
                if (!mounted) return;
                const targetEl = targetRef.current;
                const canvasEl = canvasRef.current;
                if (!targetEl || !canvasEl) return;
                const target = targetEl;
                const canvas = canvasEl;
                function measure() {
                    const rect = target.getBoundingClientRect();
                    const dpr = window.devicePixelRatio || 1;
                    const W = Math.max(1, Math.round(rect.width * dpr));
                    const H = Math.max(1, Math.round(rect.height * dpr));
                    const aspect = rect.width && rect.height ? rect.width / rect.height : 1;
                    return {
                        rect,
                        dpr,
                        W,
                        H,
                        aspect
                    };
                }
                const initial = measure();
                let dpr = initial.dpr;
                let W = initial.W;
                let H = initial.H;
                let aspect = initial.aspect;
                const rect = initial.rect;
                if (!rect.width || !rect.height) return;
                /* ── position fixed overlay exactly over the target ── */ function applyPosition(r) {
                    canvas.style.left = `${r.left}px`;
                    canvas.style.top = `${r.top}px`;
                    canvas.style.width = `${r.width}px`;
                    canvas.style.height = `${r.height}px`;
                }
                applyPosition(rect);
                /* ── text texture (offscreen 2-D canvas) ── */ const off = document.createElement("canvas");
                off.width = W;
                off.height = H;
                const ctx = off.getContext("2d");
                function drawText(r, dprNow) {
                    const cs = window.getComputedStyle(target);
                    const text = cs.textTransform === "uppercase" ? displayText.toUpperCase() : displayText;
                    const lsPx = parseFloat(cs.letterSpacing) || 0;
                    ctx.setTransform(dprNow, 0, 0, dprNow, 0, 0);
                    ctx.clearRect(0, 0, off.width, off.height);
                    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
                    ctx.fillStyle = cs.color;
                    ctx.textBaseline = "middle";
                    if (domCharSelector) {
                        const spans = target.querySelectorAll(domCharSelector);
                        if (spans.length >= text.length) {
                            spans.forEach({
                                "PixelShaderOverlay.useEffect.init.drawText": (span, idx)=>{
                                    if (idx >= text.length) return;
                                    const sr = span.getBoundingClientRect();
                                    ctx.fillText(text[idx], sr.left - r.left, sr.top - r.top + sr.height / 2);
                                }
                            }["PixelShaderOverlay.useEffect.init.drawText"]);
                            return;
                        }
                    }
                    const padL = parseFloat(cs.paddingLeft) || 0;
                    let x = padL;
                    for (const ch of text){
                        ctx.fillText(ch, x, r.height / 2);
                        x += ctx.measureText(ch).width + lsPx;
                    }
                }
                drawText(rect, dpr);
                /* ── Three.js renderer ── */ const renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WebGLRenderer"]({
                    canvas,
                    alpha: true,
                    antialias: false
                });
                renderer.setSize(W, H);
                renderer.setPixelRatio(1);
                const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Scene"]();
                const cam = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrthographicCamera"](-0.5, 0.5, 0.5, -0.5, 0.01, 10);
                cam.position.z = 1;
                const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](off);
                /* ── uniforms ── */ /* mouse starts off-canvas so no effect before first hover */ const uniforms = {
                    uTex: {
                        value: tex
                    },
                    uHover: {
                        value: 0
                    },
                    uMouseUV: {
                        value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](-1, -1)
                    },
                    uAnchorUV: {
                        value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](-1, -1)
                    },
                    uAspect: {
                        value: aspect
                    },
                    uRes: {
                        value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](W, H)
                    }
                };
                const mat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
                    vertexShader: vert,
                    fragmentShader: frag,
                    uniforms,
                    transparent: true
                });
                const geo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaneGeometry"](1, 1);
                scene.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](geo, mat));
                /* ── lerp targets for smooth mouse trailing ── */ let tX = -1, tY = -1;
                let lastUvX = -1, lastUvY = -1;
                let charStartsPx = [];
                let charCentersPx = [];
                let charChars = [];
                /* lerp speed — lower = dreamier trail, higher = snappier */ const LERP = 0.14;
                let rafId = 0;
                const loop = {
                    "PixelShaderOverlay.useEffect.init.loop": ()=>{
                        rafId = requestAnimationFrame(loop);
                        uniforms.uMouseUV.value.x += (tX - uniforms.uMouseUV.value.x) * LERP;
                        uniforms.uMouseUV.value.y += (tY - uniforms.uMouseUV.value.y) * LERP;
                        renderer.render(scene, cam);
                    }
                }["PixelShaderOverlay.useEffect.init.loop"];
                loop();
                /* ── keep overlay responsive to layout changes ── */ let resizeRaf = 0;
                function syncToTarget() {
                    const m = measure();
                    if (!m.rect.width || !m.rect.height) return;
                    // Always keep position in sync (scroll/layout shifts)
                    applyPosition(m.rect);
                    const sizeChanged = m.W !== W || m.H !== H || m.dpr !== dpr;
                    if (sizeChanged) {
                        W = m.W;
                        H = m.H;
                        dpr = m.dpr;
                        aspect = m.aspect;
                        off.width = W;
                        off.height = H;
                        drawText(m.rect, dpr);
                        tex.needsUpdate = true;
                        renderer.setSize(W, H, false);
                        uniforms.uRes.value.set(W, H);
                        uniforms.uAspect.value = aspect;
                        // Font size / spacing can change at breakpoints, so recompute anchors.
                        computeCharMetrics();
                        if (uniforms.uHover.value > 0 && lastUvX >= 0 && lastUvY >= 0) {
                            const a = pickAnchorUv({
                                x: lastUvX,
                                y: lastUvY
                            }, m.rect);
                            uniforms.uAnchorUV.value.set(a.x, a.y);
                        }
                        // If we resize while hovered, ensure mouse stays stable
                        if (uniforms.uHover.value > 0) {
                            tX = Math.min(1, Math.max(0, tX));
                            tY = Math.min(1, Math.max(0, tY));
                        }
                    }
                }
                function requestSync() {
                    cancelAnimationFrame(resizeRaf);
                    resizeRaf = requestAnimationFrame(syncToTarget);
                }
                const ro = new ResizeObserver({
                    "PixelShaderOverlay.useEffect.init": ()=>requestSync()
                }["PixelShaderOverlay.useEffect.init"]);
                ro.observe(target);
                window.addEventListener("resize", requestSync);
                window.addEventListener("scroll", requestSync, true);
                /* ── UV conversion helper ── */ function toUV(e) {
                    const r = target.getBoundingClientRect();
                    return {
                        x: (e.clientX - r.left) / r.width,
                        y: 1.0 - (e.clientY - r.top) / r.height
                    };
                }
                function computeCharMetrics() {
                    if (domCharSelector) {
                        const domChars = Array.from(target.querySelectorAll(domCharSelector));
                        if (domChars.length) {
                            const targetRect = target.getBoundingClientRect();
                            charStartsPx = [];
                            charCentersPx = [];
                            charChars = domChars.map({
                                "PixelShaderOverlay.useEffect.init.computeCharMetrics": (el)=>el.textContent ?? ""
                            }["PixelShaderOverlay.useEffect.init.computeCharMetrics"]);
                            for (const el of domChars){
                                const box = el.getBoundingClientRect();
                                const start = box.left - targetRect.left;
                                const center = start + box.width / 2;
                                charStartsPx.push(start);
                                charCentersPx.push(center);
                            }
                            return;
                        }
                    }
                    // Prefer real DOM char spans if present (more accurate than measuring text widths).
                    // `page.tsx` renders FULL-STACK with `.hero-title-char` per character.
                    const domChars = Array.from(target.querySelectorAll(".hero-title-char"));
                    if (domChars.length) {
                        const targetRect = target.getBoundingClientRect();
                        charStartsPx = [];
                        charCentersPx = [];
                        charChars = domChars.map({
                            "PixelShaderOverlay.useEffect.init.computeCharMetrics": (el)=>el.textContent ?? ""
                        }["PixelShaderOverlay.useEffect.init.computeCharMetrics"]);
                        for (const el of domChars){
                            const r = el.getBoundingClientRect();
                            const start = r.left - targetRect.left;
                            const center = start + r.width / 2;
                            charStartsPx.push(start);
                            charCentersPx.push(center);
                        }
                        return;
                    }
                    const cs = window.getComputedStyle(target);
                    const text = cs.textTransform === "uppercase" ? displayText.toUpperCase() : displayText;
                    const chars = [
                        ...text
                    ];
                    const lsPx = parseFloat(cs.letterSpacing) || 0;
                    // Measure in CSS pixels
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
                    const starts = [];
                    const centers = [];
                    let x = 0;
                    for (const ch of chars){
                        const w = ctx.measureText(ch).width;
                        starts.push(x);
                        centers.push(x + w / 2);
                        x += w + lsPx;
                    }
                    charStartsPx = starts;
                    charCentersPx = centers;
                    charChars = chars;
                }
                function pickAnchorUv(uv, r) {
                    if (!charCentersPx.length) computeCharMetrics();
                    const xPx = uv.x * r.width;
                    let idx = 0;
                    while(idx + 1 < charStartsPx.length && charStartsPx[idx + 1] <= xPx)idx++;
                    // If hovering a space, bias to nearest non-space char.
                    if (charChars[idx] === " " || charChars[idx] === "\u00A0") {
                        let left = idx - 1;
                        let right = idx + 1;
                        while(left >= 0 || right < charChars.length){
                            if (left >= 0 && charChars[left] !== " " && charChars[left] !== "\u00A0") {
                                idx = left;
                                break;
                            }
                            if (right < charChars.length && charChars[right] !== " " && charChars[right] !== "\u00A0") {
                                idx = right;
                                break;
                            }
                            left--;
                            right++;
                        }
                    }
                    const cx = charCentersPx[idx] / r.width;
                    return {
                        x: cx,
                        y: uv.y
                    };
                }
                /* ── hover events — DOM text is never touched ── */ const onEnter = {
                    "PixelShaderOverlay.useEffect.init.onEnter": (e)=>{
                        const uv = toUV(e);
                        /* snap lerped position to cursor so no slide-in from off-canvas */ tX = uniforms.uMouseUV.value.x = uv.x;
                        tY = uniforms.uMouseUV.value.y = uv.y;
                        lastUvX = uv.x;
                        lastUvY = uv.y;
                        const r = target.getBoundingClientRect();
                        const a = pickAnchorUv(uv, r);
                        uniforms.uAnchorUV.value.set(a.x, a.y);
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].killTweensOf(uniforms.uHover);
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].to(uniforms.uHover, {
                            value: 1,
                            duration: 0.2,
                            ease: "power2.out"
                        });
                    }
                }["PixelShaderOverlay.useEffect.init.onEnter"];
                const onMove = {
                    "PixelShaderOverlay.useEffect.init.onMove": (e)=>{
                        const uv = toUV(e);
                        /* update lerp target — position trails smoothly behind cursor */ tX = uv.x;
                        tY = uv.y;
                        lastUvX = uv.x;
                        lastUvY = uv.y;
                        const r = target.getBoundingClientRect();
                        const a = pickAnchorUv(uv, r);
                        uniforms.uAnchorUV.value.set(a.x, a.y);
                    }
                }["PixelShaderOverlay.useEffect.init.onMove"];
                const onLeave = {
                    "PixelShaderOverlay.useEffect.init.onLeave": ()=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].killTweensOf(uniforms.uHover);
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].to(uniforms.uHover, {
                            value: 0,
                            duration: 0.25,
                            ease: "power2.inOut",
                            onComplete: {
                                "PixelShaderOverlay.useEffect.init.onLeave": ()=>{
                                    /* park off-canvas so next mouseenter snaps cleanly */ tX = uniforms.uMouseUV.value.x = -1;
                                    tY = uniforms.uMouseUV.value.y = -1;
                                    uniforms.uAnchorUV.value.set(-1, -1);
                                }
                            }["PixelShaderOverlay.useEffect.init.onLeave"]
                        });
                    }
                }["PixelShaderOverlay.useEffect.init.onLeave"];
                target.addEventListener("mouseenter", onEnter);
                target.addEventListener("mousemove", onMove);
                target.addEventListener("mouseleave", onLeave);
                cleanupRef.current = ({
                    "PixelShaderOverlay.useEffect.init": ()=>{
                        cancelAnimationFrame(resizeRaf);
                        cancelAnimationFrame(rafId);
                        ro.disconnect();
                        window.removeEventListener("resize", requestSync);
                        window.removeEventListener("scroll", requestSync, true);
                        target.removeEventListener("mouseenter", onEnter);
                        target.removeEventListener("mousemove", onMove);
                        target.removeEventListener("mouseleave", onLeave);
                        renderer.dispose();
                        tex.dispose();
                        mat.dispose();
                        geo.dispose();
                    }
                })["PixelShaderOverlay.useEffect.init"];
            }
            init();
            return ({
                "PixelShaderOverlay.useEffect": ()=>{
                    mounted = false;
                    cleanupRef.current?.();
                }
            })["PixelShaderOverlay.useEffect"];
        }
    }["PixelShaderOverlay.useEffect"], [
        displayText,
        targetRef,
        enabled,
        domCharSelector
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        className: "pointer-events-none fixed z-20"
    }, void 0, false, {
        fileName: "[project]/app/components/PixelShaderOverlay.tsx",
        lineNumber: 460,
        columnNumber: 10
    }, this);
}
_s(PixelShaderOverlay, "3lXbYVlTe57y7oVYJZIJbLFWcLU=");
_c = PixelShaderOverlay;
var _c;
__turbopack_context__.k.register(_c, "PixelShaderOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/about/HeroText.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeroText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$PixelShaderOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/PixelShaderOverlay.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const HERO_TEXT = "Francis Oliver \u2014";
/** Kept in sync with the intro tween below (used for midpoint timing). */ const HERO_INTRO_DURATION = 0.82;
const HERO_INTRO_STAGGER = 0.035;
function HeroText({ playIntro = false, holdForIntro = false, onIntroMidpoint, onIntroComplete }) {
    _s();
    const wrapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const h1Ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const introRanRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const onMidpointRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onIntroMidpoint);
    const onCompleteRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onIntroComplete);
    const [shaderEnabled, setShaderEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroText.useEffect": ()=>{
            onMidpointRef.current = onIntroMidpoint;
        }
    }["HeroText.useEffect"], [
        onIntroMidpoint
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroText.useEffect": ()=>{
            onCompleteRef.current = onIntroComplete;
        }
    }["HeroText.useEffect"], [
        onIntroComplete
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "HeroText.useLayoutEffect": ()=>{
            if (!holdForIntro) return;
            const wrap = wrapRef.current;
            if (wrap) wrap.style.visibility = "hidden";
        }
    }["HeroText.useLayoutEffect"], [
        holdForIntro
    ]);
    /* Landing Developer line: DOM stays painted; overlay is hover-only (PixelShaderOverlay). */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroText.useEffect": ()=>{
            if (holdForIntro) return;
            let cancelled = false;
            void document.fonts.ready.then({
                "HeroText.useEffect": ()=>{
                    if (cancelled) return;
                    const h1 = h1Ref.current;
                    if (h1) {
                        const outers = h1.querySelectorAll(".char-outer");
                        outers.forEach({
                            "HeroText.useEffect": (el)=>{
                                el.style.overflow = "visible";
                            }
                        }["HeroText.useEffect"]);
                    }
                    setShaderEnabled(true);
                }
            }["HeroText.useEffect"]);
            return ({
                "HeroText.useEffect": ()=>{
                    cancelled = true;
                }
            })["HeroText.useEffect"];
        }
    }["HeroText.useEffect"], [
        holdForIntro
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroText.useEffect": ()=>{
            if (!playIntro || introRanRef.current) return;
            introRanRef.current = true;
            const wrap = wrapRef.current;
            const h1 = h1Ref.current;
            if (!wrap || !h1) return;
            const inners = h1.querySelectorAll(".char-inner");
            if (!inners.length) return;
            h1.style.color = "";
            h1.style.opacity = "1";
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(inners, {
                yPercent: 120,
                willChange: "transform"
            });
            wrap.style.visibility = "visible";
            const n = inners.length;
            const introSpan = HERO_INTRO_STAGGER * Math.max(0, n - 1) + HERO_INTRO_DURATION;
            const midpointDelay = introSpan * 0.5;
            const midpointCall = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].delayedCall(midpointDelay, {
                "HeroText.useEffect.midpointCall": ()=>{
                    onMidpointRef.current?.();
                }
            }["HeroText.useEffect.midpointCall"]);
            const tl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].timeline();
            tl.to(inners, {
                yPercent: 0,
                duration: HERO_INTRO_DURATION,
                stagger: HERO_INTRO_STAGGER,
                ease: "expo.out"
            }).call({
                "HeroText.useEffect": ()=>{
                    /* Match landing hero: do not strip transforms at rest (avoids subpixel reflow). */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(inners, {
                        clearProps: "willChange"
                    });
                    const outers = h1.querySelectorAll(".char-outer");
                    if (outers.length) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(outers, {
                        overflow: "visible"
                    });
                    onCompleteRef.current?.();
                    void document.fonts.ready.then({
                        "HeroText.useEffect": ()=>setShaderEnabled(true)
                    }["HeroText.useEffect"]);
                }
            }["HeroText.useEffect"], undefined, "+=0.08");
            return ({
                "HeroText.useEffect": ()=>{
                    midpointCall.kill();
                    tl.kill();
                }
            })["HeroText.useEffect"];
        }
    }["HeroText.useEffect"], [
        playIntro
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: wrapRef,
        className: "relative shrink-0 cursor-default",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                ref: h1Ref,
                className: "px-4 font-semibold uppercase tracking-[-0.055em] text-black text-4xl sm:px-6 sm:text-5xl md:px-8 md:text-6xl lg:px-10 lg:text-8xl xl:text-8xl 2xl:text-[12rem]",
                style: {
                    lineHeight: 0.80
                },
                children: HERO_TEXT.split("").map((char, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "char-outer inline-block overflow-hidden py-[0.14em]",
                        style: {
                            verticalAlign: "bottom"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "char-inner inline-block",
                            children: char === " " ? "\u00A0" : char
                        }, void 0, false, {
                            fileName: "[project]/app/about/HeroText.tsx",
                            lineNumber: 134,
                            columnNumber: 13
                        }, this)
                    }, `${char}-${i}`, false, {
                        fileName: "[project]/app/about/HeroText.tsx",
                        lineNumber: 129,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/about/HeroText.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$PixelShaderOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                targetRef: h1Ref,
                displayText: HERO_TEXT,
                enabled: shaderEnabled,
                domCharSelector: ".char-inner"
            }, void 0, false, {
                fileName: "[project]/app/about/HeroText.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/about/HeroText.tsx",
        lineNumber: 121,
        columnNumber: 5
    }, this);
}
_s(HeroText, "7Eg+qeWuDUyOGFQv4fSwzJxgGE0=");
_c = HeroText;
var _c;
__turbopack_context__.k.register(_c, "HeroText");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/about/TalkButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TalkButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const spring = {
    type: "spring",
    stiffness: 300,
    damping: 25
};
const ARROW_CLASSES = "flex h-8 w-8 shrink-0 items-center justify-center bg-black text-sm text-white sm:h-9 sm:w-9 sm:text-base xl:h-12 xl:w-12 xl:text-2xl";
const HOVER_DELAY_MS = 140;
function TalkButton() {
    _s();
    const [hovered, setHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasInteracted, setHasInteracted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const hoverTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleEnter = ()=>{
        if (!hasInteracted) setHasInteracted(true);
        if (hoverTimerRef.current !== null) {
            window.clearTimeout(hoverTimerRef.current);
        }
        hoverTimerRef.current = window.setTimeout(()=>{
            setHovered(true);
            hoverTimerRef.current = null;
        }, HOVER_DELAY_MS);
    };
    const handleLeave = ()=>{
        if (hoverTimerRef.current !== null) {
            window.clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }
        setHovered(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        layout: true,
        transition: spring,
        className: "flex items-center gap-2",
        onMouseEnter: handleEnter,
        onMouseLeave: handleLeave,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                mode: "popLayout",
                children: hovered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    layout: true,
                    initial: {
                        opacity: 0,
                        scale: 0
                    },
                    animate: {
                        opacity: 1,
                        scale: 1
                    },
                    exit: {
                        opacity: 0,
                        scale: 0
                    },
                    transition: spring,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "#",
                        "aria-label": "Next",
                        className: ARROW_CLASSES,
                        children: ">"
                    }, void 0, false, {
                        fileName: "[project]/app/about/TalkButton.tsx",
                        lineNumber: 59,
                        columnNumber: 13
                    }, this)
                }, "arrow-left", false, {
                    fileName: "[project]/app/about/TalkButton.tsx",
                    lineNumber: 51,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/about/TalkButton.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                layout: "position",
                transition: spring,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "#",
                    className: "inline-flex h-8 items-center justify-center bg-black px-3 text-xs font-medium uppercase tracking-tight text-white sm:h-9 sm:px-4 sm:text-sm xl:h-12 xl:px-5 xl:text-base",
                    children: "TALK WITH ME"
                }, void 0, false, {
                    fileName: "[project]/app/about/TalkButton.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/about/TalkButton.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                mode: "popLayout",
                children: !hovered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    layout: true,
                    initial: hasInteracted ? {
                        opacity: 0,
                        scale: 0
                    } : false,
                    animate: {
                        opacity: 1,
                        scale: 1,
                        rotate: 0
                    },
                    exit: {
                        opacity: 0,
                        scale: 0,
                        rotate: 360
                    },
                    transition: spring,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "#",
                        "aria-label": "Next",
                        className: ARROW_CLASSES,
                        children: ">"
                    }, void 0, false, {
                        fileName: "[project]/app/about/TalkButton.tsx",
                        lineNumber: 87,
                        columnNumber: 13
                    }, this)
                }, "arrow-right", false, {
                    fileName: "[project]/app/about/TalkButton.tsx",
                    lineNumber: 77,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/about/TalkButton.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/about/TalkButton.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_s(TalkButton, "cNbo2edg6uLHnWWn3rqq2kZ1uT4=");
_c = TalkButton;
var _c;
__turbopack_context__.k.register(_c, "TalkButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/about/TopRightNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TopRightNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function TopRightNav({ items, className = "" }) {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rowRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const activeIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TopRightNav.useMemo[activeIndex]": ()=>Math.max(0, items.findIndex({
                "TopRightNav.useMemo[activeIndex]": (item)=>item.active
            }["TopRightNav.useMemo[activeIndex]"]))
    }["TopRightNav.useMemo[activeIndex]"], [
        items
    ]);
    const [hoveredIndex, setHoveredIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [markerY, setMarkerY] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [markerTurns, setMarkerTurns] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const targetIndex = hoveredIndex ?? activeIndex;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TopRightNav.useEffect": ()=>{
            const container = containerRef.current;
            const targetEl = rowRefs.current[targetIndex];
            if (!container || !targetEl) return;
            const cRect = container.getBoundingClientRect();
            const tRect = targetEl.getBoundingClientRect();
            const nextY = tRect.top - cRect.top + tRect.height / 2 - 6;
            setMarkerY(nextY);
        }
    }["TopRightNav.useEffect"], [
        targetIndex,
        items
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TopRightNav.useEffect": ()=>{
            const spinTimer = window.setTimeout({
                "TopRightNav.useEffect.spinTimer": ()=>{
                    setMarkerTurns({
                        "TopRightNav.useEffect.spinTimer": (prev)=>prev + 0.35
                    }["TopRightNav.useEffect.spinTimer"]);
                }
            }["TopRightNav.useEffect.spinTimer"], 0);
            return ({
                "TopRightNav.useEffect": ()=>window.clearTimeout(spinTimer)
            })["TopRightNav.useEffect"];
        }
    }["TopRightNav.useEffect"], [
        targetIndex
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TopRightNav.useEffect": ()=>{
            const onResize = {
                "TopRightNav.useEffect.onResize": ()=>{
                    const container = containerRef.current;
                    const targetEl = rowRefs.current[targetIndex];
                    if (!container || !targetEl) return;
                    const cRect = container.getBoundingClientRect();
                    const tRect = targetEl.getBoundingClientRect();
                    setMarkerY(tRect.top - cRect.top + tRect.height / 2 - 6);
                }
            }["TopRightNav.useEffect.onResize"];
            window.addEventListener("resize", onResize);
            return ({
                "TopRightNav.useEffect": ()=>window.removeEventListener("resize", onResize)
            })["TopRightNav.useEffect"];
        }
    }["TopRightNav.useEffect"], [
        targetIndex
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Primary",
        className: className,
        onMouseLeave: ()=>setHoveredIndex(null),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: containerRef,
            className: "relative flex flex-col items-end gap-1 sm:gap-1.5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    "aria-hidden": true,
                    className: "nav-marker pointer-events-none absolute right-0 h-3 w-3 bg-black will-change-transform",
                    style: {
                        transform: `translate3d(0, ${markerY}px, 0) rotate(${markerTurns * 360}deg)`,
                        transition: "transform 780ms cubic-bezier(0.22, 1, 0.36, 1)"
                    }
                }, void 0, false, {
                    fileName: "[project]/app/about/TopRightNav.tsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this),
                items.map((item, idx)=>{
                    const isHoveredTarget = hoveredIndex === idx;
                    const shouldSlide = isHoveredTarget && !item.active;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: (el)=>{
                            rowRefs.current[idx] = el;
                        },
                        className: "flex items-center justify-end gap-2",
                        onMouseEnter: ()=>setHoveredIndex(idx),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: item.href,
                                className: `inline-block transform-gpu text-right text-xs font-medium uppercase tracking-[-0.04em] sm:text-sm ${item.active ? "font-semibold text-black" : "text-[#979797] hover:text-black"} ${shouldSlide ? "-translate-x-1.5" : "translate-x-0"}`,
                                style: {
                                    willChange: "transform",
                                    transition: "transform 760ms cubic-bezier(0.16, 1, 0.3, 1), color 280ms ease-out"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "nav-mask-outer inline-block overflow-hidden",
                                    style: {
                                        verticalAlign: "top"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "nav-mask-inner inline-block",
                                        children: item.label
                                    }, void 0, false, {
                                        fileName: "[project]/app/about/TopRightNav.tsx",
                                        lineNumber: 111,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/about/TopRightNav.tsx",
                                    lineNumber: 107,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/about/TopRightNav.tsx",
                                lineNumber: 94,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": true,
                                className: "h-3 w-3 shrink-0 opacity-0"
                            }, void 0, false, {
                                fileName: "[project]/app/about/TopRightNav.tsx",
                                lineNumber: 116,
                                columnNumber: 15
                            }, this)
                        ]
                    }, item.label, true, {
                        fileName: "[project]/app/about/TopRightNav.tsx",
                        lineNumber: 86,
                        columnNumber: 13
                    }, this);
                })
            ]
        }, void 0, true, {
            fileName: "[project]/app/about/TopRightNav.tsx",
            lineNumber: 69,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/about/TopRightNav.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
_s(TopRightNav, "+KxUB6XJ1KTMoOHtauhjp50a9kA=");
_c = TopRightNav;
var _c;
__turbopack_context__.k.register(_c, "TopRightNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/about/AboutPageClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AboutPageClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$about$2f$HeroText$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/about/HeroText.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$about$2f$TalkButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/about/TalkButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$about$2f$TopRightNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/about/TopRightNav.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const NAV_ITEMS = [
    {
        label: "FRANCIS OLIVER",
        href: "/about",
        active: true
    },
    {
        label: ".GALLERY",
        href: "/#gallery",
        active: false
    },
    {
        label: "RESUME",
        href: "/resume",
        active: false
    },
    {
        label: "PROJECTS",
        href: "/#projects",
        active: false
    }
];
const INTRO = "Hi! I'm Francis Oliver, a graduating student at STI College. Thanks for stopping by my website. I aspire to create \"Awwwards\"-level websites like this. I specialize in building web applications using Java with Spring Boot. Feel free to reach out if you'd like me to develop a software application for you.";
const INTRO_WORDS = INTRO.split(" ");
const SOCIAL_LINKS = [
    {
        label: "INSTAGRAM",
        href: "#"
    },
    {
        label: "GITHUB",
        href: "#"
    },
    {
        label: "LINKEDIN",
        href: "#"
    }
];
/** After top-left block starts; top-right nav tweens begin here (seconds). */ const NAV_INTRO_DELAY_AFTER_LEFT = 0.48;
function AboutPageClient() {
    _s();
    const bottomBarFillRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const navWrapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const paraRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const profileRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const talkBtnRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const socialsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [fromLanding] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "AboutPageClient.useState": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            try {
                const isFromLanding = window.sessionStorage.getItem("about-intro-source") === "landing";
                if (isFromLanding) {
                    window.sessionStorage.removeItem("about-intro-source");
                }
                return isFromLanding;
            } catch  {
                return false;
            }
        }
    }["AboutPageClient.useState"]);
    const [playHeroIntro, setPlayHeroIntro] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const contentTlRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "AboutPageClient.useLayoutEffect": ()=>{
            if (!fromLanding) return;
            const profile = profileRef.current;
            const para = paraRef.current;
            const navWrap = navWrapRef.current;
            const talkBtn = talkBtnRef.current;
            const socials = socialsRef.current;
            if (profile) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(profile, {
                clipPath: "inset(100% 100% 0% 0%)"
            });
            if (para) {
                const inners = para.querySelectorAll(".para-inner");
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(inners, {
                    yPercent: 100
                });
            }
            if (talkBtn) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(talkBtn, {
                autoAlpha: 0,
                y: 15
            });
            if (socials) {
                const outers = socials.querySelectorAll(".social-outer");
                const inners = socials.querySelectorAll(".social-inner");
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(outers, {
                    overflow: "hidden"
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(inners, {
                    yPercent: 120
                });
            }
            if (navWrap) {
                const inners = navWrap.querySelectorAll(".nav-mask-inner");
                const marker = navWrap.querySelector(".nav-marker");
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(inners, {
                    yPercent: 120
                });
                if (marker) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(marker, {
                    opacity: 0
                });
            }
        }
    }["AboutPageClient.useLayoutEffect"], [
        fromLanding
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "AboutPageClient.useLayoutEffect": ()=>{
            if (!fromLanding) return;
            const barFill = bottomBarFillRef.current;
            if (!barFill) return;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(barFill, {
                clipPath: "inset(100% 0% 0% 0%)",
                willChange: "clip-path"
            });
            const tl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].timeline();
            tl.to(barFill, {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.02,
                ease: "power3.out"
            }).set(barFill, {
                clearProps: "willChange,clipPath"
            }).call({
                "AboutPageClient.useLayoutEffect": ()=>{
                    setPlayHeroIntro(true);
                }
            }["AboutPageClient.useLayoutEffect"]);
            return ({
                "AboutPageClient.useLayoutEffect": ()=>{
                    tl.kill();
                }
            })["AboutPageClient.useLayoutEffect"];
        }
    }["AboutPageClient.useLayoutEffect"], [
        fromLanding
    ]);
    const handleHeroIntroMidpoint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AboutPageClient.useCallback[handleHeroIntroMidpoint]": ()=>{
            if (!fromLanding) return;
            contentTlRef.current?.kill();
            const profile = profileRef.current;
            const paraOuters = paraRef.current?.querySelectorAll(".para-outer");
            const paraInners = paraRef.current?.querySelectorAll(".para-inner");
            const navInners = navWrapRef.current?.querySelectorAll(".nav-mask-inner");
            const navMarker = navWrapRef.current?.querySelector(".nav-marker");
            const socialOuters = socialsRef.current?.querySelectorAll(".social-outer");
            const socialInners = socialsRef.current?.querySelectorAll(".social-inner");
            const talkBtn = talkBtnRef.current;
            if (paraOuters?.length) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(paraOuters, {
                    paddingTop: "0.1em",
                    marginTop: "-0.1em",
                    paddingBottom: "0.12em",
                    marginBottom: "-0.12em"
                });
            }
            /* t=0 aligns with ~half of HeroText letter reveal (onIntroMidpoint). */ const tl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].timeline();
            contentTlRef.current = tl;
            const leftStart = 0;
            const navStart = NAV_INTRO_DELAY_AFTER_LEFT;
            if (profile) {
                tl.to(profile, {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 0.82,
                    ease: "power3.out"
                }, leftStart);
            }
            if (paraInners?.length) {
                tl.to(paraInners, {
                    yPercent: 0,
                    duration: 0.68,
                    stagger: 0.012,
                    ease: "expo.out"
                }, leftStart);
            }
            if (talkBtn) {
                tl.to(talkBtn, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.55,
                    ease: "power2.out"
                }, leftStart);
            }
            if (socialInners?.length) {
                tl.to(socialInners, {
                    yPercent: 0,
                    duration: 0.58,
                    stagger: 0.04,
                    ease: "expo.out"
                }, leftStart);
            }
            if (navInners?.length) {
                tl.to(navInners, {
                    yPercent: 0,
                    duration: 0.62,
                    stagger: 0.055,
                    ease: "expo.out"
                }, navStart);
            }
            if (navMarker) {
                tl.to(navMarker, {
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.out"
                }, navStart);
            }
            tl.call({
                "AboutPageClient.useCallback[handleHeroIntroMidpoint]": ()=>{
                    if (paraOuters?.length) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(paraOuters, {
                            clearProps: "paddingTop,paddingBottom,marginTop,marginBottom"
                        });
                    }
                    if (paraInners?.length) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(paraInners, {
                            clearProps: "transform,yPercent"
                        });
                    }
                    if (socialOuters?.length) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(socialOuters, {
                            clearProps: "overflow"
                        });
                    }
                    if (socialInners?.length) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(socialInners, {
                            clearProps: "transform,yPercent"
                        });
                    }
                    if (navInners?.length) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(navInners, {
                            clearProps: "transform,yPercent"
                        });
                    }
                    if (profile) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(profile, {
                            clearProps: "clipPath"
                        });
                    }
                }
            }["AboutPageClient.useCallback[handleHeroIntroMidpoint]"]);
        }
    }["AboutPageClient.useCallback[handleHeroIntroMidpoint]"], [
        fromLanding
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AboutPageClient.useEffect": ()=>{
            return ({
                "AboutPageClient.useEffect": ()=>{
                    contentTlRef.current?.kill();
                    contentTlRef.current = null;
                }
            })["AboutPageClient.useEffect"];
        }
    }["AboutPageClient.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-screen flex-col overflow-hidden bg-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex w-full shrink-0 flex-col px-4 pt-4 sm:px-6 sm:pt-6 md:px-8 lg:px-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: navWrapRef,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$about$2f$TopRightNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            items: NAV_ITEMS,
                            className: "absolute right-4 top-4 z-10 sm:right-6 sm:top-6"
                        }, void 0, false, {
                            fileName: "[project]/app/about/AboutPageClient.tsx",
                            lineNumber: 267,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/about/AboutPageClient.tsx",
                        lineNumber: 266,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pl-3 max-w-[calc(100vw-8rem)] sm:pl-4 sm:max-w-none sm:pr-28 md:pr-36 lg:max-w-[min(72rem,calc(100vw-18rem))] lg:pr-48 xl:pr-56",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6 md:gap-7 lg:gap-8 xl:gap-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: profileRef,
                                    className: "relative h-32 w-32 shrink-0 overflow-hidden sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-44 lg:w-44 xl:h-72 xl:w-72",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/assets/profile1.webp",
                                        alt: "Francis Oliver",
                                        fill: true,
                                        className: "object-cover grayscale",
                                        sizes: "(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, (max-width: 1280px) 176px, 288px",
                                        priority: true
                                    }, void 0, false, {
                                        fileName: "[project]/app/about/AboutPageClient.tsx",
                                        lineNumber: 279,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/about/AboutPageClient.tsx",
                                    lineNumber: 275,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex min-w-0 flex-1 flex-col gap-2 sm:gap-3 sm:self-stretch sm:min-h-40 md:min-h-48 lg:min-h-44 xl:min-h-72",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            ref: paraRef,
                                            className: "max-w-5xl leading-snug tracking-[-0.04em] text-black lg:max-w-none text-xs sm:text-sm md:text-sm lg:text-sm xl:text-lg xl:leading-relaxed xl:tracking-[-0.08em]",
                                            children: INTRO_WORDS.map((word, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "para-outer inline-block overflow-hidden",
                                                            style: {
                                                                verticalAlign: "bottom"
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "para-inner inline-block",
                                                                children: word
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/about/AboutPageClient.tsx",
                                                                lineNumber: 299,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/about/AboutPageClient.tsx",
                                                            lineNumber: 295,
                                                            columnNumber: 21
                                                        }, this),
                                                        i < INTRO_WORDS.length - 1 ? " " : null
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/app/about/AboutPageClient.tsx",
                                                    lineNumber: 294,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/about/AboutPageClient.tsx",
                                            lineNumber: 289,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            ref: talkBtnRef,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$about$2f$TalkButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                fileName: "[project]/app/about/AboutPageClient.tsx",
                                                lineNumber: 306,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/about/AboutPageClient.tsx",
                                            lineNumber: 305,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            ref: socialsRef,
                                            className: "flex flex-wrap gap-3 sm:mt-auto sm:gap-4 xl:gap-6",
                                            children: SOCIAL_LINKS.map(({ label, href })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "social-outer inline-block",
                                                    style: {
                                                        verticalAlign: "bottom"
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: href,
                                                        className: "social-inner relative inline-block text-[0.65rem] font-medium uppercase tracking-tight text-black sm:text-xs xl:text-sm after:absolute after:left-0 after:top-[calc(100%+2px)] after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-black after:transition-transform after:duration-300 after:ease-out hover:after:origin-left hover:after:scale-x-100",
                                                        children: label
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/about/AboutPageClient.tsx",
                                                        lineNumber: 318,
                                                        columnNumber: 21
                                                    }, this)
                                                }, label, false, {
                                                    fileName: "[project]/app/about/AboutPageClient.tsx",
                                                    lineNumber: 313,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/about/AboutPageClient.tsx",
                                            lineNumber: 308,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/about/AboutPageClient.tsx",
                                    lineNumber: 288,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/about/AboutPageClient.tsx",
                            lineNumber: 274,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/about/AboutPageClient.tsx",
                        lineNumber: 273,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/about/AboutPageClient.tsx",
                lineNumber: 265,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-8 flex-1"
            }, void 0, false, {
                fileName: "[project]/app/about/AboutPageClient.tsx",
                lineNumber: 332,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$about$2f$HeroText$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                playIntro: playHeroIntro,
                holdForIntro: fromLanding,
                onIntroMidpoint: handleHeroIntroMidpoint
            }, void 0, false, {
                fileName: "[project]/app/about/AboutPageClient.tsx",
                lineNumber: 334,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative w-full shrink-0 overflow-hidden",
                style: {
                    height: "30vh"
                },
                "aria-hidden": true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: bottomBarFillRef,
                    className: "absolute inset-0 bg-black"
                }, void 0, false, {
                    fileName: "[project]/app/about/AboutPageClient.tsx",
                    lineNumber: 345,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/about/AboutPageClient.tsx",
                lineNumber: 340,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/about/AboutPageClient.tsx",
        lineNumber: 264,
        columnNumber: 5
    }, this);
}
_s(AboutPageClient, "j+FuQKOeYoPkcQR4TYZxD9/uEBo=");
_c = AboutPageClient;
var _c;
__turbopack_context__.k.register(_c, "AboutPageClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_2d69099c._.js.map