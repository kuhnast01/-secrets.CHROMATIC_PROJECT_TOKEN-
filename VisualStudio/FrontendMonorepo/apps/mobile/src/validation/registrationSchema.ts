import * as yup from 'yup';

// Example: Registration form validation schema
export const registrationSchema = yup.object().shape({
  username: yup.string().trim().min(3).max(32).required('Username is required'),
  email: yup.string().trim().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

// Usage example (in a form handler):
// try {
//   await registrationSchema.validate(formData, { abortEarly: false });
// } catch (err) {
//   // handle validation errors
// }
