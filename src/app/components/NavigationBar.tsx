'use client';

import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { toast } from 'react-toastify';

export default function NavigationBar() {
  const ctx = useContext(GlobalContext);
  return (
    <nav className="navbar">
      <div className="nav-left">
        <a href="/">Home</a>
        <a href="/news">News</a>
        <a href="/calendar">Calendar</a>
      </div>

      <div className="nav-right">
        <span className="username">{ctx?.user?.username || 'Vendég'}</span>

        {ctx?.user ? (
          <button
            className="logout-btn"
            onClick={() => {
              ctx?.setUser(null);
              localStorage.removeItem('user');
              toast.info('Kijelentkeztél.');
            }}
          >
            Kijelentkezés
          </button>
        ) : (
          <>
            <a href="/register">Sign Up</a>
            <a href="/login">Login</a>
          </>
        )}
      </div>
    </nav>
  );
}
