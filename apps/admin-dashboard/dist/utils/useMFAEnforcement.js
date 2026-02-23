"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMFAEnforcement = useMFAEnforcement;
const react_1 = require("react");
function useMFAEnforcement(isSensitiveAction, onRequireMFA) {
    (0, react_1.useEffect)(() => {
        if (isSensitiveAction) {
            // Placeholder: trigger MFA modal or redirect
            onRequireMFA();
        }
    }, [isSensitiveAction, onRequireMFA]);
}
