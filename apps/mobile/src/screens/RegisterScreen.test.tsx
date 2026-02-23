/* eslint-env jest */
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { RegisterScreen } from '../screens/RegisterScreen';

it('renders RegisterScreen and handles registration', async () => {
  const onRegister = jest.fn();
  const { getByPlaceholderText, getByText } = render(
    <RegisterScreen onRegister={onRegister} />,
  );

  fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
  fireEvent.changeText(getByPlaceholderText('Password'), 'testpass');
  fireEvent.press(getByText('Register'));

  await waitFor(() => expect(onRegister).toHaveBeenCalled());
});
