import React from 'react';
import Link from 'next/link';
import SkipLink from './SkipLink';
import HeaderClient from './HeaderClient';

const Header = async (): Promise<React.ReactElement> => {
  return (
    <header className="w-full fixed top-0 z-10 text-white p-0 bg-slate-800">
      <SkipLink />
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center font-bold text-xl" aria-label="Bookishelf homepage">
          Bookishelf
        </Link>
        <HeaderClient />
      </div>
    </header>
  );
};

export default Header;
