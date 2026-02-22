import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const { token } = await apiRequest('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      localStorage.setItem('admin_token', token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h6" gutterBottom>Admin Login</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleLogin}>
          <TextField label="Username" fullWidth margin="normal" value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUsername(e.target.value); }} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); }} />
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} type="submit">Login</Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
