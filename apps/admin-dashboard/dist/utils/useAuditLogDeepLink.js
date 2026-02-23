"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuditLogDeepLink = useAuditLogDeepLink;
const react_1 = require("react");
function useAuditLogDeepLink(onDeepLink) {
    (0, react_1.useEffect)(() => {
        // Listen for deep link events (e.g., from audit log UI)
        // Example: window.addEventListener('auditLogDeepLink', ...)
        // Call onDeepLink(entryId) when triggered
        // Cleanup listener on unmount
        return () => { };
    }, [onDeepLink]);
}
