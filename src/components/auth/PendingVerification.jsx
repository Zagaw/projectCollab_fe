import React, { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import userApi from '../../api/userApi';
import toast from 'react-hot-toast';
import AuthLayout from './AuthLayout';
import { RefreshCw } from 'lucide-react';

const POLL_MS = 15000;

const PendingVerification = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  const applyProfile = useCallback((profile, { silent } = {}) => {
    if (!profile) return;
    updateUser(profile);
    if (profile.role === 'LECTURER' && profile.status === 'ACTIVE') {
      toast.success('Your lecturer account is approved.');
      navigate('/lecturer/dashboard', { replace: true });
      return;
    }
    if (profile.status === 'INACTIVE' || profile.status === 'SUSPENDED') {
      setRejected(true);
      return;
    }
    if (!silent) {
      toast('Still waiting for admin approval.');
    }
  }, [navigate, updateUser]);

  const checkStatus = useCallback(async ({ silent = false } = {}) => {
    setChecking(true);
    try {
      const response = await userApi.getCurrentUser();
      setLastChecked(new Date());
      applyProfile(response.data, { silent });
    } catch (error) {
      const status = error.response?.status;
      if (status === 401 || status === 404) {
        logout();
        setRejected(true);
        return;
      }
      if (!silent) {
        toast.error(error.response?.data?.error || 'Could not check status. Try again.');
      }
    } finally {
      setChecking(false);
    }
  }, [applyProfile, logout]);

  useEffect(() => {
    checkStatus({ silent: true });
    const timer = setInterval(() => checkStatus({ silent: true }), POLL_MS);
    return () => clearInterval(timer);
  }, [checkStatus]);

  if (!user && !rejected) {
    return <Navigate to="/login" replace />;
  }

  if (rejected) {
    return (
      <AuthLayout
        title="Registration not approved"
        subtitle="An administrator did not activate this lecturer account."
      >
        <div className="space-y-5">
          <p className="text-sm text-gray-600">
            You can create a new account or contact an administrator if you think this was a mistake.
          </p>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            className="btn-primary w-full"
          >
            Back to login
          </button>
        </div>
      </AuthLayout>
    );
  }

  const handleManualCheck = () => {
    checkStatus({ silent: false });
  };

  return (
    <AuthLayout
      title="Account pending verification"
      subtitle="Your lecturer account is waiting for admin approval."
    >
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          Stay on this page or come back and sign in later. Collabora will update automatically
          when an administrator approves your account
          {user?.email ? ` (${user.email})` : ''}.
        </p>

        <div className="surface p-4">
          <h3 className="text-sm font-medium text-ink">What happens next?</h3>
          <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>An administrator reviews your registration</li>
            <li>This page checks for approval about every 15 seconds</li>
            <li>When approved, you will be taken to the lecturer dashboard</li>
            <li>If you sign in later, a notice will also be waiting in the bell</li>
          </ul>
        </div>

        {lastChecked && (
          <p className="text-xs text-gray-500">
            Last checked {lastChecked.toLocaleTimeString()}
          </p>
        )}

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleManualCheck}
            disabled={checking}
            className="btn-primary w-full"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} strokeWidth={2} aria-hidden />
            {checking ? 'Checking…' : 'Check status'}
          </button>
          <button type="button" onClick={logout} className="btn-secondary w-full">
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
