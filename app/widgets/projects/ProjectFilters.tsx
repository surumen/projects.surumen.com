import React from 'react';
import { X } from 'react-bootstrap-icons';
import useProjects from '@/hooks/useProjects';
import { useProjectsStore } from '@/store/store';

interface ProjectFiltersProps {
  search?: boolean;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({ search = true }) => {
  const { filters, activeFilters } = useProjects();
  const { toggleFilter, clearFilters } = useProjectsStore();
  
  const isSelected = (filter: string) => activeFilters.includes(filter);
  
  return (
    <div className="row align-items-center overflow-x-auto g-6 m-0">
      <ul className="row list-unstyled flex-nowrap" style={{ 
        display: 'flex',
        flexWrap: 'nowrap',
        overflowX: 'auto',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}>
        {filters.map((filter) => (
          <li key={filter} className="col-auto">
            <button 
              onClick={() => toggleFilter(filter)}
              className={`btn btn-sm rounded-pill shadow-none ${
                isSelected(filter) 
                  ? 'btn-primary border-primary' 
                  : 'btn-outline-primary'
              }`}
            >
              {filter}
              {isSelected(filter) && (
                <X size={14} className="ms-2 me-n1" />
              )}
            </button>
          </li>
        ))}
        
        <li className="col-auto">
          <button 
            onClick={clearFilters}
            disabled={activeFilters.length === 0}
            className="btn btn-sm btn-light border rounded-pill"
          >
            <X size={16} className="pe-2" />
            <span>Clear Filters</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ProjectFilters;
