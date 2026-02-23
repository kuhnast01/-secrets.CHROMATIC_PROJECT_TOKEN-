import { jsx as _jsx } from "react/jsx-runtime";
export function VipPerkList({ perks }) {
    if (!perks || perks.length === 0) {
        return _jsx("div", { style: { color: '#aaa', fontSize: 14 }, children: "No perks available." });
    }
    return (_jsx("ul", { style: { paddingLeft: 20, margin: 0 }, children: perks.map((perk, i) => (_jsx("li", { style: { fontSize: 15, color: '#444', marginBottom: 4 }, children: perk }, i))) }));
}
