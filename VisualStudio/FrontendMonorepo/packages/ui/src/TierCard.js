import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text, Icon } from '@chakra-ui/react';
import { FaLock, FaCheckCircle, FaCrown, FaGift } from 'react-icons/fa';
export const TierCard = ({ id, title, status, xp, reward, claimed, isCurrent = false, onClick, }) => {
    let statusIcon = _jsx(Icon, { as: FaLock, color: "gray.400", boxSize: 6 });
    let cardBg = 'gray.50';
    let borderColor = 'gray.200';
    let titleColor = 'gray.700';
    let rewardIcon = _jsx(Icon, { as: FaGift, color: "yellow.400", boxSize: 5, mr: 1 });
    if (claimed) {
        statusIcon = _jsx(Icon, { as: FaCheckCircle, color: "teal.400", boxSize: 6 });
        cardBg = 'teal.50';
        borderColor = 'teal.400';
        titleColor = 'teal.700';
    }
    else if (status === 'Unlocked') {
        statusIcon = _jsx(Icon, { as: FaCrown, color: "yellow.400", boxSize: 6 });
        cardBg = 'yellow.50';
        borderColor = 'yellow.400';
        titleColor = 'yellow.700';
    }
    if (isCurrent) {
        borderColor = 'blue.500';
    }
    return (_jsxs(Box, { p: 4, borderWidth: 2, borderRadius: "lg", minW: "140px", bg: cardBg, borderColor: borderColor, textAlign: "center", cursor: onClick ? 'pointer' : 'default', onClick: onClick, _hover: onClick ? { boxShadow: 'lg', bg: 'blue.50' } : {}, transition: "box-shadow 0.2s, background 0.2s", boxShadow: claimed ? 'md' : 'sm', position: "relative", children: [_jsx(Box, { mb: 2, children: statusIcon }), _jsx(Text, { fontWeight: "bold", color: titleColor, fontSize: "lg", children: title }), _jsxs(Box, { display: "flex", justifyContent: "center", alignItems: "center", mt: 1, mb: 1, gap: 1, children: [rewardIcon, _jsx(Text, { fontSize: "sm", color: "gray.600", children: reward })] }), _jsxs(Text, { fontSize: "xs", color: "gray.500", mt: 1, children: ["XP: ", xp] }), isCurrent && _jsx(Box, { position: "absolute", top: 1, right: 1, bg: "blue.500", borderRadius: "full", w: 3, h: 3 })] }));
};
