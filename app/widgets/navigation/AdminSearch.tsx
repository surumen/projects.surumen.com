import React, { useState } from 'react';
import { Search, X } from 'react-bootstrap-icons';

interface AdminSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const AdminSearch: React.FC<AdminSearchProps> = ({ 
  placeholder = "Search in admin", 
  onSearch 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch?.('');
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  return (
    <div className="dropdown ms-2">
      {/* Desktop Search */}
      <div className="d-none d-lg-block">
        <div className="input-group input-group-merge input-group-borderless input-group-hover-light navbar-input-group">
          <div className="input-group-prepend input-group-text">
            <Search size={16} />
          </div>
          <input 
            type="search" 
            className="form-control" 
            placeholder={placeholder}
            aria-label={placeholder}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button
              type="button"
              className="input-group-append input-group-text"
              onClick={handleClearSearch}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Button */}
      <button 
        className="btn btn-ghost-secondary btn-icon rounded-circle d-lg-none" 
        type="button"
        onClick={toggleMobileSearch}
      >
        <Search size={16} />
      </button>

      {/* Mobile Search Dropdown (placeholder) */}
      {isMobileSearchOpen && (
        <div className="dropdown-menu dropdown-menu-form-search navbar-dropdown-menu-borderless show">
          <div className="card">
            <div className="card-body-height">
              <div className="d-lg-none">
                <div className="input-group input-group-merge navbar-input-group mb-5">
                  <div className="input-group-prepend input-group-text">
                    <Search size={16} />
                  </div>
                  <input 
                    type="search" 
                    className="form-control" 
                    placeholder={placeholder}
                    aria-label={placeholder}
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button
                    type="button"
                    className="input-group-append input-group-text"
                    onClick={handleClearSearch}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              
              <span className="dropdown-header">Recent searches</span>
              <div className="dropdown-item bg-transparent text-wrap">
                <span className="text-muted">No recent searches</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSearch;
