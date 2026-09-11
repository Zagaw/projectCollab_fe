import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';

const PendingVerification = () => {
  const { user, logout } = useAuth();

  return (
    <AuthLayout
      title="Account pending verification"
      subtitle="Your lecturer account is waiting for admin approval."
    >
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          You will receive a notification once your account is verified
          {user?.email ? ` at ${user.email}` : ''}.
        </p>

        <div className="surface p-4">
          <h3 className="text-sm font-medium text-ink">What happens next?</h3>
          <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>An administrator will review your application</li>
            <li>You'll receive an email confirmation once approved</li>
            <li>You can then log in and access lecturer features</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button type="button" onClick={logout} className="btn-primary w-full">
            Logout
          </button>
          <Link to="/login" className="btn-secondary w-full">
            Back to login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default PendingVerification;
