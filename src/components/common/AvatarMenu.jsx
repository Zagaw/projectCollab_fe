import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AvatarMenu = ({ profilePath }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || 'U';

  useEffect(() => {
    const onClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-white/10 transition"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="h-8 w-8 rounded-full bg-white text-ink text-xs font-semibold flex items-center justify-center">
          {initials}
        </span>
        <span className="hidden md:block text-sm text-white/90 max-w-[10rem] truncate">
          {user?.firstName} {user?.lastName}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-gray-200 z-50 py-1 text-ink">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <Link
            to={profilePath}
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm hover:bg-gray-50"
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default AvatarMenu;
