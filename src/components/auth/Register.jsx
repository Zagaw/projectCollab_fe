import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import AuthLayout from './AuthLayout';
import PasswordField from './PasswordField';
import { authErrorMessage } from '../../utils/authError';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    studentId: '',
    phone: '',
    role: 'STUDENT',
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    if (formData.password.length < 8) {
      const message = 'Password must be at least 8 characters long';
      setFormError(message);
      toast.error(message);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        username: formData.username.trim(),
        email: formData.email.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim() || null,
        studentId: formData.role === 'LECTURER' ? null : (formData.studentId.trim() || null),
      };
      const userData = await register(payload);
      
      // Check if lecturer registration is pending
      if (userData.role === 'LECTURER' && userData.status === 'PENDING_VERIFICATION') {
        toast.success('Account created! Please wait for admin approval.');
        navigate('/pending-verification', { replace: true });
      } else {
        toast.success('Account created successfully!');
        // Redirect based on role
        switch (userData.role) {
          case 'STUDENT':
            navigate('/student/dashboard', { replace: true });
            break;
          case 'TEAM_LEADER':
            navigate('/teamleader/dashboard', { replace: true });
            break;
          case 'LECTURER':
            navigate('/lecturer/dashboard', { replace: true });
            break;
          case 'ADMIN':
            navigate('/admin/dashboard', { replace: true });
            break;
          default:
            navigate('/dashboard', { replace: true });
        }
      }
    } catch (error) {
      const message = authErrorMessage(error, 'Could not create the account. Check the form and try again.');
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create account" 
      subtitle="Join Collabora and start collaborating with your team"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-700" role="alert">
            {formError}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="label">
              First name *
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="field"
              placeholder="John"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="label">
              Last name *
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="field"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label htmlFor="username" className="label">
            Username *
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
            className={`field ${formError.toLowerCase().includes('username') ? 'border-red-300' : ''}`}
          />
        </div>

        <div>
          <label htmlFor="email" className="label">
            Email address *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={`field ${formError.toLowerCase().includes('email') ? 'border-red-300' : ''}`}
          />
        </div>

        <div>
          <label htmlFor="password" className="label">
            Password * (min. 8 characters)
          </label>
          <PasswordField
            id="password"
            name="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            invalid={Boolean(formError && formError.toLowerCase().includes('password'))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {formData.role === 'STUDENT' && (
            <div>
              <label htmlFor="studentId" className="label">
                Student ID <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <input
                id="studentId"
                name="studentId"
                type="text"
                value={formData.studentId}
                onChange={handleChange}
                className={`field ${formError.toLowerCase().includes('student id') ? 'border-red-300' : ''}`}
                placeholder="STU12345"
              />
            </div>
          )}
          <div className={formData.role === 'STUDENT' ? '' : 'sm:col-span-2'}>
            <label htmlFor="phone" className="label">
              Phone number <span className="font-normal text-gray-500">(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="field"
              placeholder="+1234567890"
            />
          </div>
        </div>

        <div>
          <label className="label">
            Register as *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setFormError('');
                setFormData({...formData, role: 'STUDENT'});
              }}
              className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition ${
                formData.role === 'STUDENT'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-indigo-300'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => {
                setFormError('');
                setFormData({ ...formData, role: 'LECTURER', studentId: '' });
              }}
              className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition ${
                formData.role === 'LECTURER'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-indigo-300'
              }`}
            >
              Lecturer
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {formData.role === 'LECTURER'
              ? 'Lecturer accounts do not need a student ID. An administrator must approve your account before you can use Collabora.'
              : 'Lecturers need to be verified by the system administrator.'}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-gray-500">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
