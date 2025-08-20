import React from 'react';
import { Form } from 'react-bootstrap';
import { Search, X } from 'react-bootstrap-icons';
import { useProjectsStore } from '@/store/store';

interface ProjectSearchProps {
  placeholder?: string;
  className?: string;
}

const ProjectSearch: React.FC<ProjectSearchProps> = ({ 
  placeholder = "Search projects...",
  className = ""
}) => {
  const { search, setSearch } = useProjectsStore();

  const handleClearSearch = () => {
    setSearch('');
  };

  return (
    <div className={`position-relative ${className}`}>
      <Form.Control
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="ps-5"
      />
      
      <Search 
        size={16} 
        className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" 
      />
      
      {search && (
        <button
          type="button"
          onClick={handleClearSearch}
          className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-1 text-muted"
          style={{ border: 'none', background: 'none' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ProjectSearch;
