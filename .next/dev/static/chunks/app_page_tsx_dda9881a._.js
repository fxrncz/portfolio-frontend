(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function formatTime(date) {
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
}
const SPLIT_TEXT = "FRANCIS OLIVER";
const HERO_TITLE = "Full-Stack";
const HERO_PARA = "Information Technology student driven by a deep curiosity for technology and its potential to solve real-world challenges. Throughout my academic journey, I\u2019ve built a strong foundation in programming and system development, while actively exploring emerging technologies to continuously expand my skills.";
const HERO_PARA_WORDS = HERO_PARA.split(" ");
const NAV_HEIGHT_REM = 3;
const NAV_MARGIN_REM = 9;
const SHRUNK_RECT_WIDTH_REM = 16;
function Home() {
    _s();
    const [now, setNow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Home.useState": ()=>new Date()
    }["Home.useState"]);
    const [showLanding, setShowLanding] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // ── Overlay
    const overlayRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const blackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const textContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const francisBlockRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ── Landing
    const heroRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const heroTitleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const heroParagraphRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const developerH2Ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const navRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const bottomLeftRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const bottomRightRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Clock
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            const id = window.setInterval({
                "Home.useEffect.id": ()=>setNow(new Date())
            }["Home.useEffect.id"], 1000);
            return ({
                "Home.useEffect": ()=>window.clearInterval(id)
            })["Home.useEffect"];
        }
    }["Home.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            const black = blackRef.current;
            const textContainer = textContainerRef.current;
            const overlay = overlayRef.current;
            const francisBlock = francisBlockRef.current;
            if (!black || !textContainer || !overlay || !francisBlock) return;
            const rem = 16;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const navH = NAV_HEIGHT_REM * rem;
            const shrunkW = Math.min(SHRUNK_RECT_WIDTH_REM * rem, vw - NAV_MARGIN_REM * rem);
            const topPx = (vh - navH) / 2;
            const leftPx = (vw - shrunkW) / 2;
            const shrunkClip = `inset(${topPx}px ${leftPx}px ${topPx}px ${leftPx}px)`;
            // ── Overlay initial states
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(black, {
                clipPath: "inset(0px 0px 0px 0px)"
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(textContainer, {
                opacity: 0,
                clipPath: shrunkClip
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(francisBlock, {
                left: vw / 2,
                xPercent: -50
            });
            // ── Landing initial states (hidden under z-100 overlay until Phase 3)
            const hero = heroRef.current;
            const nav = navRef.current;
            const titleChars = heroTitleRef.current?.querySelectorAll(".hero-title-char");
            const paraWords = heroParagraphRef.current?.querySelectorAll(".hero-para-word");
            const devChars = developerH2Ref.current?.querySelectorAll(".dev-char-inner");
            if (hero) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(hero, {
                clipPath: "inset(0% 0% 100% 0%)"
            });
            if (nav) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(nav, {
                y: 90,
                opacity: 0,
                rotation: -1.5,
                skewX: 3,
                transformOrigin: "center bottom"
            });
            if (bottomLeftRef.current) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(bottomLeftRef.current, {
                opacity: 0
            });
            if (bottomRightRef.current) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set(bottomRightRef.current, {
                opacity: 0
            });
            if (titleChars?.length) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set([
                ...titleChars
            ], {
                yPercent: 120
            });
            if (paraWords?.length) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set([
                ...paraWords
            ], {
                yPercent: 120
            });
            // Developer — chars drop from above
            if (devChars?.length) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].set([
                ...devChars
            ], {
                yPercent: -120
            });
            const tl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].timeline();
            // ── Phase 1: full-screen black shrinks to narrow centred strip
            tl.to(black, {
                clipPath: shrunkClip,
                duration: 1.2,
                ease: "expo.inOut"
            });
            // ── Phase 2: FRANCIS OLIVER mask-split
            tl.to(textContainer, {
                opacity: 1,
                duration: 0.15
            }, "-=0.1");
            const francisInners = textContainer.querySelectorAll(".startup-francis .startup-char-inner");
            tl.fromTo(francisInners, {
                yPercent: 110,
                skewX: 12
            }, {
                yPercent: 0,
                skewX: 0,
                duration: 0.6,
                stagger: 0.045,
                ease: "expo.out"
            }, "-=0.05");
            // ── Phase 3: rectangle slides down past the screen (0.35s pause first)
            tl.to(overlay, {
                y: vh + navH * 2,
                duration: 0.9,
                ease: "power3.inOut"
            }, "+=0.35");
            tl.call({
                "Home.useEffect": ()=>{
                    setShowLanding(true);
                    overlay.style.pointerEvents = "none";
                }
            }["Home.useEffect"], undefined, "<");
            // ── Phase 4: hero black section sweeps down from top — fluid deceleration
            if (hero) {
                tl.to(hero, {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 1.3,
                    ease: "expo.out"
                }, "-=0.2");
            }
            // ── Phase 4b + 4d + nav: "FULL-STACK", "Developer —", and nav all start together
            tl.addLabel("heroText", "-=0.55");
            if (titleChars?.length) {
                tl.fromTo([
                    ...titleChars
                ], {
                    yPercent: 115,
                    skewX: -12,
                    rotation: -2
                }, {
                    yPercent: 0,
                    skewX: 0,
                    rotation: 0,
                    duration: 0.75,
                    stagger: {
                        each: 0.055,
                        ease: "power2.in"
                    },
                    ease: "expo.out"
                }, "heroText");
            }
            if (devChars?.length) {
                tl.fromTo([
                    ...devChars
                ], {
                    yPercent: -120,
                    skewX: -8
                }, {
                    yPercent: 0,
                    skewX: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "expo.out"
                }, "heroText");
            }
            if (nav) {
                tl.to(nav, {
                    y: 0,
                    opacity: 1,
                    rotation: 0,
                    skewX: 0,
                    duration: 1.1,
                    ease: "expo.out"
                }, "heroText");
            }
            // ── Phase 4c: paragraph words mask-split — tight cascade
            if (paraWords?.length) {
                tl.fromTo([
                    ...paraWords
                ], {
                    yPercent: 120,
                    skewX: 6
                }, {
                    yPercent: 0,
                    skewX: 0,
                    duration: 0.5,
                    stagger: 0.012,
                    ease: "expo.out"
                }, "-=0.25");
            }
            // ── Phase 4e: bottom labels fade in
            if (bottomLeftRef.current && bottomRightRef.current) {
                tl.to([
                    bottomLeftRef.current,
                    bottomRightRef.current
                ], {
                    opacity: 1,
                    duration: 0.4,
                    ease: "power1.out"
                }, "-=0.3");
            }
            tl.call({
                "Home.useEffect": ()=>{
                    overlay.style.display = "none";
                }
            }["Home.useEffect"]);
        }
    }["Home.useEffect"], []);
    const timestamp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Home.useMemo[timestamp]": ()=>formatTime(now)
    }["Home.useMemo[timestamp]"], [
        now
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative min-h-screen bg-white text-black",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: overlayRef,
                className: "fixed inset-0 z-100",
                "aria-hidden": showLanding,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: blackRef,
                        className: "absolute inset-0 bg-black"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: textContainerRef,
                        className: "absolute inset-0 flex items-center opacity-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: francisBlockRef,
                            className: "startup-francis absolute flex overflow-hidden text-xs font-medium uppercase tracking-tight text-white sm:text-sm lg:text-lg lg:tracking-tighter",
                            children: SPLIT_TEXT.split("").map((char, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "startup-char-wrap inline-block overflow-hidden leading-tight",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "startup-char-inner inline-block",
                                        children: char === " " ? "\u00A0" : char
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 192,
                                        columnNumber: 17
                                    }, this)
                                }, i, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 191,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 184,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 181,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: showLanding ? "" : "pointer-events-none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        ref: heroRef,
                        "aria-label": "Hero",
                        className: "absolute inset-x-0 top-0 h-[45vh] bg-black",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                ref: heroParagraphRef,
                                className: "absolute right-4 top-1/2 max-w-xs -translate-y-1/2 text-right text-xs font-regular leading-snug tracking-tight text-white/90 sm:right-6 sm:max-w-sm sm:text-sm md:max-w-md md:text-base lg:right-8 lg:max-w-lg lg:text-base xl:right-10 xl:max-w-xl xl:text-xl xl:tracking-[-0.08em] xl:leading-tight",
                                children: HERO_PARA_WORDS.map((word, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-block overflow-hidden",
                                        style: {
                                            verticalAlign: "bottom"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "hero-para-word inline-block leading-snug",
                                                children: word
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 226,
                                                columnNumber: 17
                                            }, this),
                                            i < HERO_PARA_WORDS.length - 1 && "\u00A0"
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 221,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 211,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                ref: heroTitleRef,
                                className: "absolute bottom-[-0.08em] left-4 text-5xl font-semibold uppercase tracking-[-0.06em] text-white sm:left-6 sm:text-6xl md:left-8 md:text-7xl lg:left-8 lg:text-8xl xl:left-10 xl:text-9xl xl:tracking-[-0.07em]",
                                style: {
                                    lineHeight: 1
                                },
                                children: HERO_TITLE.split("").map((char, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            display: "inline-block",
                                            overflow: "hidden",
                                            verticalAlign: "bottom",
                                            paddingLeft: "0.09em",
                                            paddingRight: "0.09em",
                                            marginLeft: "-0.09em",
                                            marginRight: "-0.09em"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "hero-title-char",
                                            style: {
                                                display: "inline-block"
                                            },
                                            children: char
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 256,
                                            columnNumber: 17
                                        }, this)
                                    }, i, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 244,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 233,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 205,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        ref: developerH2Ref,
                        className: "absolute left-3 top-[45vh] -translate-y-2 text-[5.5rem] font-semibold uppercase tracking-[-0.06em] text-black sm:left-4 md:left-6 md:text-[9rem] lg:left-6 lg:text-[12em] xl:left-7.5 xl:text-[16em] xl:tracking-[-0.07em]",
                        style: {
                            lineHeight: 1
                        },
                        children: [
                            "Developer\u00A0",
                            "\u2014"
                        ].map((word, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-block overflow-hidden",
                                style: {
                                    verticalAlign: "bottom"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "dev-char-inner inline-block",
                                    children: word
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 282,
                                    columnNumber: 15
                                }, this)
                            }, i, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 277,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 265,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        ref: navRef,
                        "aria-label": "Primary",
                        className: "fixed bottom-16 left-1/2 z-50 flex h-12 w-md max-w-[calc(100vw-9rem)] -translate-x-1/2 items-center bg-black px-4 sm:bottom-8 sm:px-8 lg:bottom-10 lg:px-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "flex w-full items-center justify-center gap-4 sm:gap-8 lg:gap-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "#top",
                                        className: "text-xs font-medium uppercase tracking-tight text-white hover:text-white/80 sm:text-sm lg:text-lg lg:tracking-tighter",
                                        children: "Francis Oliver"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 299,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 298,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "#projects",
                                        className: "text-xs font-medium uppercase tracking-tight text-white hover:text-white/80 sm:text-sm lg:text-lg lg:tracking-tighter",
                                        children: "Projects"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 308,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 307,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "#gallery",
                                        className: "text-xs font-medium uppercase tracking-tight text-white hover:text-white/80 sm:text-sm lg:text-lg lg:tracking-tighter",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-block align-baseline text-base leading-none sm:text-lg lg:text-2xl",
                                                children: "."
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 322,
                                                columnNumber: 17
                                            }, this),
                                            "Gallery"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 317,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 316,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 297,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 288,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: bottomLeftRef,
                        className: "fixed bottom-6 left-4 z-40 text-xs font-medium tracking-tight text-black sm:bottom-8 sm:left-6 sm:text-sm lg:bottom-10 lg:left-10 lg:tracking-tighter",
                        children: timestamp
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 331,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: bottomRightRef,
                        className: "fixed bottom-6 right-4 z-40 text-xs font-medium tracking-tight text-black sm:bottom-8 sm:right-6 sm:text-sm lg:bottom-10 lg:right-10 lg:tracking-tighter",
                        children: "FULL-STACK DEV"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 339,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 202,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 178,
        columnNumber: 5
    }, this);
}
_s(Home, "brsihR6+a0cFJlY5V957sgKGRbQ=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_page_tsx_dda9881a._.js.map