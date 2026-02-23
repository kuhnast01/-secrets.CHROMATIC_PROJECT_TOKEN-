import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { VipPerkList } from './VipPerkList';
export function VipLevelCard({ level, perks, dailyReward, locked, current }) {
    return (_jsxs("div", { style: {
            opacity: locked ? 0.5 : 1,
            background: current ? '#e6f7ff' : '#fff',
            border: current ? '2px solid #3182ce' : '1px solid #eee',
            borderRadius: 12,
            padding: 20,
            margin: '8px 0',
            boxShadow: current ? '0 2px 8px #3182ce22' : '0 1px 4px #0001',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 220,
        }, children: [_jsxs("div", { style: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 }, children: ["Level ", level, " ", current && _jsx("span", { style: { color: '#3182ce' }, children: "(Current)" })] }), _jsx("div", { style: { fontSize: 14, color: '#666', marginBottom: 8 }, children: _jsx(VipPerkList, { perks: perks }) }), _jsxs("div", { style: { fontSize: 13, color: '#888' }, children: ["Daily Reward: ", dailyReward] }), locked && _jsx("div", { style: { color: '#aaa', fontSize: 13, marginTop: 8 }, children: "Locked" })] }));
}
