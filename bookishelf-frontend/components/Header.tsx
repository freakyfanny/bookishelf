'use client';

import Link from "next/link";
import { useState, useEffect, useRef } from 'react';
import SkipLink from './SkipLink';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
  if (!menuOpen || !navRef.current || !buttonRef.current) return;

  const element = navRef.current;
  const removeButton = buttonRef.current;

  const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusableElements = element.querySelectorAll<HTMLElement>(focusableSelectors);
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  const shutdownFocusTrap = () => {
    setMenuOpen(false);
    element.removeEventListener('keydown', handleKeydown);
    removeButton.removeEventListener('click', shutdownFocusTrap);
    removeButton.focus();
  };

  const handleKeydown = (event: KeyboardEvent) => {
    const isEscPressed = event.key === 'Escape';
    const isTabPressed = event.key === 'Tab' || event.keyCode === 9;

    if (isEscPressed) {
      shutdownFocusTrap();
      return;
    }

    if (!isTabPressed) return;

    if (event.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeydown);
  removeButton.addEventListener('click', shutdownFocusTrap);
  firstFocusableElement?.focus();
  document.body.style.overflowY = 'hidden';

  return () => {
    document.body.style.overflowY = 'auto';
    element.removeEventListener('keydown', handleKeydown);
    removeButton.removeEventListener('click', shutdownFocusTrap);
  };
  }, [menuOpen]);

  return (
    <header className="w-full fixed top-0 z-10 text-white p-0 bg-slate-800">
      <SkipLink />
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center font-bold text-xl" aria-label="Bookishelf homepage">
          Bookishelf
        </Link>

        <button
          ref={buttonRef}
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="md:hidden p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <svg
            className="h-6 w-6 text-white"
            viewBox="0 0 24 24"
            role="img"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>  
        </button>

        <nav
          ref={navRef}
          className={`${menuOpen ? 'block' : 'hidden'} sm:flex sm:items-center sm:space-x-4 absolute sm:relative top-16 sm:top-0 left-0 w-full sm:w-auto bg-slate-800 p-4 sm:p-0`}
          aria-hidden={!menuOpen}
          aria-label="Main navigation"
        >
          <ul className="flex flex-col sm:flex-row sm:space-x-4">
            <li><Link href="/" className="text-sky-300 hover:text-white py-1">Home</Link></li>
            <li><Link href="/favourites" className="text-sky-300 hover:text-white py-1">Favourites</Link></li>
          </ul>
          <label htmlFor="search-filter" className="sr-only">Search filter</label>
        </nav>
      </div>
    </header>
  );
};

export default Header;
