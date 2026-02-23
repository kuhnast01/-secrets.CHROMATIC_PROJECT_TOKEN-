import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FontAwesome5 } from '@expo/vector-icons';
import { register, getPlayer } from '@api';

interface RegisterScreenProps {
  onRegister: () => void;
}

// i18n resource keys required in your translation files:
// {
//   "register": {
//     "heading": "Register",
//     "username": "Username",
//     "password": "Password",
//     "show": "Show",
//     "hide": "Hide",
//     "register": "Register",
//     "registering": "Registering...",
//     "error": "Registration failed",
//     "loading": "Loading indicator"
//   }
// }

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister }: RegisterScreenProps) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await register(username, password);
      await getPlayer();
      onRegister();
    } catch (err: any) {
      setError(err.message || t('register.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      accessible accessibilityLabel={t('register.heading')}
    >
      <View style={styles.headerWrap}>
        <FontAwesome5 name="user-plus" size={32} color="#3182ce" style={{ marginBottom: 8 }} />
        <Text style={styles.heading} accessibilityRole="header" testID="register-heading">{t('register.heading')}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder={t('register.username')}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="username"
        accessibilityLabel={t('register.username')}
        returnKeyType="next"
        editable={!loading}
      />
      <View style={{ width: '100%', maxWidth: 320, position: 'relative' }}>
        <TextInput
          style={styles.input}
          placeholder={t('register.password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          textContentType="password"
          accessibilityLabel={t('register.password')}
          returnKeyType="done"
          editable={!loading}
        />
        <TouchableOpacity
          style={styles.showPasswordBtn}
          onPress={() => { setShowPassword((v) => !v); }}
          accessible accessibilityLabel={showPassword ? t('register.hide') : t('register.show')}
          disabled={loading}
        >
          <Text style={styles.showPasswordText}>{showPassword ? t('register.hide') : t('register.show')}</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text> : null}
      <TouchableOpacity
        style={[styles.registerBtn, (loading || !username || !password) && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={loading || !username || !password}
        accessibilityLabel={t('register.register')}
        accessibilityRole="button"
        testID="register-btn"
      >
        <FontAwesome5 name="star" size={18} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.registerBtnText}>{loading ? t('register.registering') : t('register.register')}</Text>
      </TouchableOpacity>
      {loading && (
        <ActivityIndicator style={{ marginTop: 12 }} color="#3182ce" accessibilityLabel={t('register.loading')} />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  headerWrap: { alignItems: 'center', marginBottom: 12 },
  heading: { fontSize: 26, fontWeight: 'bold', marginBottom: 4, color: '#2b6cb0', letterSpacing: 1 },
  input: { width: '100%', maxWidth: 320, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 12, marginBottom: 14, fontSize: 16, backgroundColor: '#f9f9f9' },
  error: { color: 'red', marginBottom: 12, fontSize: 16, textAlign: 'center' },
  showPasswordBtn: { position: 'absolute', right: 16, top: 16, padding: 4 },
  showPasswordText: { color: '#3182ce', fontWeight: 'bold' },
  registerBtn: { flexDirection: 'row', backgroundColor: '#3182ce', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  registerBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 },
});
