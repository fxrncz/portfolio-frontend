(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
            const nextY = tRect.top - cRect.top + tRect.height / 2 - 6; // center a 12px square
            setMarkerY(nextY);
        }
    }["TopRightNav.useEffect"], [
        targetIndex,
        items
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TopRightNav.useEffect": ()=>{
            // Slower, subtler spin per move.
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
                    className: "pointer-events-none absolute right-0 h-3 w-3 bg-black will-change-transform",
                    style: {
                        transform: `translate3d(0, ${markerY}px, 0) rotate(${markerTurns * 360}deg)`,
                        transition: "transform 780ms cubic-bezier(0.22, 1, 0.36, 1)"
                    }
                }, void 0, false, {
                    fileName: "[project]/app/about/TopRightNav.tsx",
                    lineNumber: 71,
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
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/app/about/TopRightNav.tsx",
                                lineNumber: 92,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": true,
                                className: "h-3 w-3 shrink-0 opacity-0"
                            }, void 0, false, {
                                fileName: "[project]/app/about/TopRightNav.tsx",
                                lineNumber: 106,
                                columnNumber: 15
                            }, this)
                        ]
                    }, item.label, true, {
                        fileName: "[project]/app/about/TopRightNav.tsx",
                        lineNumber: 84,
                        columnNumber: 13
                    }, this);
                })
            ]
        }, void 0, true, {
            fileName: "[project]/app/about/TopRightNav.tsx",
            lineNumber: 70,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/about/TopRightNav.tsx",
        lineNumber: 65,
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
]);

//# sourceMappingURL=app_about_TopRightNav_tsx_36b80da3._.js.map