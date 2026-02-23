"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAccessibilityFocus = useAccessibilityFocus;
const react_1 = require("react");
function useAccessibilityFocus(ref, open) {
    (0, react_1.useEffect)(() => {
        if (open && ref.current) {
            ref.current.focus();
        }
    }, [open, ref]);
}
