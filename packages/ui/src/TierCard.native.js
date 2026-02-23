import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
export const TierCard = ({ title, status, xp, reward, claimed, isCurrent = false, onPress, }) => {
    let icon = _jsx(FontAwesome, { name: "lock", size: 24, color: "#a0aec0" });
    let bg = { backgroundColor: '#f7fafc' };
    let titleColor = { color: '#4a5568' };
    let rewardIcon = _jsx(FontAwesome5, { name: "gift", size: 18, color: "#ecc94b", style: { marginRight: 4 } });
    let statusText = 'Locked';
    if (claimed) {
        icon = _jsx(FontAwesome, { name: "check-circle", size: 24, color: "#38b2ac" });
        bg = { backgroundColor: '#e6fffa' };
        titleColor = { color: '#319795' };
        statusText = 'Claimed';
    }
    else if (status === 'Unlocked') {
        icon = _jsx(MaterialCommunityIcons, { name: "crown", size: 24, color: "#ecc94b" });
        bg = { backgroundColor: '#fefcbf' };
        titleColor = { color: '#b7791f' };
        statusText = 'Unlocked';
    }
    let borderColor = '#e2e8f0';
    let borderWidth = 2;
    if (isCurrent) {
        borderColor = '#3182ce';
    }
    return (_jsx(TouchableOpacity, { onPress: onPress, activeOpacity: onPress ? 0.8 : 1, children: _jsxs(View, { style: [
                { minWidth: 140, alignItems: 'center', borderRadius: 8, marginHorizontal: 4, padding: 12, borderWidth, borderColor, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
                bg,
            ], children: [icon, _jsx(Text, { style: [{ fontWeight: 'bold', fontSize: 16, marginTop: 4 }, titleColor], children: title }), _jsxs(View, { style: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 }, children: [rewardIcon, _jsx(Text, { style: { fontSize: 14, color: '#b7791f' }, children: reward })] }), _jsxs(Text, { style: { fontSize: 12, color: '#718096', marginTop: 2 }, children: ["XP: ", xp] }), _jsx(Text, { style: { fontSize: 12, color: titleColor.color, marginTop: 2 }, children: statusText })] }) }));
};
