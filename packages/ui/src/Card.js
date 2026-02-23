import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Platform, View, Text, StyleSheet } from 'react-native';
export const Card = ({ children, title }) => {
    if (Platform.OS === 'web') {
        return (_jsxs("div", { style: { border: '1px solid #ddd', borderRadius: 8, padding: 16, margin: 8 }, children: [title && _jsx("h2", { style: { marginBottom: 8 }, children: title }), children] }));
    }
    return (_jsxs(View, { style: styles.card, children: [title && _jsx(Text, { style: styles.title, children: title }), children] }));
};
const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 16,
        margin: 8,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});
