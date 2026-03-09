'use client';

import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function NavigationBar() {
  const ctx = useContext(GlobalContext);
  const isDark = ctx?.theme === 'dark';

  return (
    <nav className={`navbar ${isDark ? 'dark' : ''}`}>
      <div className="nav-left">
        <a href="/" className="logo">
          <div className="logo-img">
            <Image
              src="/logo/doklogo4.png"
              alt="DÖKnet Logo"
              width={42}
              height={42}
              className="logo-desktop"
            />
          </div>
          <span className="logo-text">DÖKnet</span>
        </a>

        <div className="nav-links">
          <a href="/calendar">Naptár</a>
          <a href="/gallery">Galéria</a>

          {ctx?.user &&
            ['admin', 'teacher', 'president'].includes(
              (ctx.user as any).role,
            ) && (
              <>
                <a href="/news-editor">Hírszerkesztő</a>
                <a href="/vote">Szavazás</a>
              </>
            )}

          {ctx?.user && <a href="/chat">Chat</a>}
        </div>
      </div>

      <div className="nav-right">
        <button onClick={ctx?.toggleTheme} className="theme-toggle">
          {isDark ? '☀️' : '🌙'}
        </button>

        {ctx?.user && (ctx.user as any).role === 'admin' && (
          <a href="/admin">Admin Panel</a>
        )}

        <span className="username">{ctx?.user?.username || 'Vendég'}</span>

        {ctx?.user ? (
          <button
            onClick={() => {
              ctx?.setUser(null);
              localStorage.removeItem('user');
              toast.info('Kijelentkeztél.', {
                style: { marginTop: '4.5rem' },
              });
            }}
          >
            Kijelentkezés
          </button>
        ) : (
          <div className="login-register">
            <a href="/login">Bejelentkezés</a>
            <a href="/register">Regisztráció</a>
          </div>
        )}
      </div>
    </nav>
  );
}
