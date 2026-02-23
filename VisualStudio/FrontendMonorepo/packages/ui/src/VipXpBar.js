import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
export function VipXpBar({ currentXp, nextLevelXp, animate }) {
    const percent = Math.min(100, (currentXp / nextLevelXp) * 100);
    return (_jsxs("div", { style: { margin: '12px 0' }, children: [_jsxs("div", { style: { fontSize: 14, color: '#666' }, children: ["XP: ", currentXp, " / ", nextLevelXp] }), _jsx("div", { style: { background: '#eee', borderRadius: 8, height: 16, width: '100%', marginTop: 4, overflow: 'hidden' }, children: _jsx("div", { style: {
                        background: '#3182ce',
                        height: '100%',
                        borderRadius: 8,
                        width: `${percent}%`,
                        transition: animate ? 'width 0.7s cubic-bezier(.68,-0.55,.27,1.55)' : 'none',
                    } }) })] }));
}
