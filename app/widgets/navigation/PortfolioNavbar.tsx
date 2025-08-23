import React from 'react';
import Link from 'next/link';
import { Search, XLg } from 'react-bootstrap-icons';
import { LogoIcon, QuickMenu } from '@/widgets';
import { useProjectsStore } from '@/store/store';

const PortfolioNavbar: React.FC = () => {
  const { search, setSearch } = useProjectsStore();

  const handleClearSearch = () => {
    setSearch('');
  };

  // Search component for navbar
  const navbarSearch = (
    <div className='d-none d-md-block'>
      <div className='input-group input-group-merge input-group-borderless navbar-input-group rounded'>
        <div className='input-group-prepend input-group-text'>
          <Search size={12} className='me-1'/>
        </div>
        <input 
          type='search' 
          className='form-control focus rounded' 
          placeholder='Search projects, technologies, descriptions...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="input-group-append input-group-text"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <XLg size={12} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Logo */}
      <Link href="/" className='navbar-brand d-none'>
        <LogoIcon primary={'#377dff'} dark={'#1c232c'} />
      </Link>

      <div className='navbar-nav-wrap-content-start'>
        {navbarSearch}
      </div>

      <div className='navbar-nav-wrap-content-end'>
        <ul className='navbar-nav'>
          <QuickMenu />
        </ul>
      </div>
    </>
  );
};

export default PortfolioNavbar;
