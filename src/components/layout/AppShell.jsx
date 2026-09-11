import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import BrandLogo from '../common/BrandLogo';
import NavIcon from '../common/NavIcon';
import AvatarMenu from '../common/AvatarMenu';
import NotificationBell from '../notifications/NotificationBell';

const isNavActive = (pathname, path) => {
  if (pathname === path) return true;
  if (path.endsWith('/dashboard')) return false;
  return pathname.startsWith(`${path}/`);
};

const AppShell = ({ homePath, profilePath, roleLabel, sections }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="px-3 pb-8 space-y-5">
      {sections.map((section) => (
        <div key={section.title}>
          <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
            {section.title}
          </p>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const active = isNavActive(location.pathname, item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                    active
                      ? 'bg-white/15 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <NavIcon name={item.icon} className="w-[18px] h-[18px] shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-paper">
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed inset-y-0 left-0 z-40 w-64 bg-ink text-white flex flex-col transition-transform duration-200`}
      >
        <div className="px-4 py-4 border-b border-white/10">
          <BrandLogo to={homePath} />
          <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-white/45">
            {roleLabel}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto pt-4">{nav}</div>
      </aside>

      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 bg-ink text-white">
          <div className="h-14 px-3 sm:px-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="lg:hidden p-2 rounded-lg text-white/80 hover:bg-white/10"
                aria-label="Open menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className="hidden sm:inline text-sm text-white/70 truncate">
                Collaborate. Build. Achieve.
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <NotificationBell tone="ink" />
              <AvatarMenu profilePath={profilePath} />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
