import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function VipRewardPopup({ reward, onClose }) {
    return (_jsxs("div", { style: {
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }, children: [_jsxs("div", { style: {
                    background: '#fff', borderRadius: 16, padding: 40, minWidth: 320, textAlign: 'center',
                    boxShadow: '0 4px 24px #0003', animation: 'pop 0.4s cubic-bezier(.68,-0.55,.27,1.55)',
                }, children: [_jsx("div", { style: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 }, children: "Reward Claimed!" }), _jsx("div", { style: { fontSize: 18, color: '#3182ce', marginBottom: 24 }, children: reward }), _jsx("button", { style: { background: '#3182ce', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }, onClick: onClose, children: "Close" })] }), _jsx("style", { children: '@keyframes pop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }' })] }));
}
