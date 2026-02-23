import { jsx as _jsx } from "react/jsx-runtime";
import { Platform, TouchableOpacity, Text, StyleSheet } from 'react-native';
export const Button = ({ title, onPress, color }) => {
    if (Platform.OS === 'web') {
        return (_jsx("button", { style: { backgroundColor: color || '#007bff', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: 4 }, onClick: onPress, children: title }));
    }
    return (_jsx(TouchableOpacity, { style: [styles.button, !!color && { backgroundColor: color }], onPress: onPress, children: _jsx(Text, { style: styles.text, children: title }) }));
};
const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
