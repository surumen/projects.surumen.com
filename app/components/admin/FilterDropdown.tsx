import React, { useCallback } from 'react';
import { Dropdown } from '@/widgets/components/dropdown';
import { Filter } from 'react-bootstrap-icons';

interface FilterDropdownProps {
  showPublished: boolean;
  showDrafts: boolean;
  showArchived: boolean;
  onTogglePublished: (show: boolean) => void;
  onToggleDrafts: (show: boolean) => void;
  onToggleArchived: (show: boolean) => void;
  projectStats: {
    total: number;
    published: number;
    drafts: number;
    archived: number;
  };
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  showPublished,
  showDrafts,
  showArchived,
  onTogglePublished,
  onToggleDrafts,
  onToggleArchived,
  projectStats
}) => {
  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    if (showPublished) count++;
    if (showDrafts) count++;
    if (showArchived) count++;
    return count;
  }, [showPublished, showDrafts, showArchived]);

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <button 
          type="button" 
          className="btn btn-white btn-sm w-100"
        >
          <Filter size={16} className="me-1" /> Filter
          {getActiveFilterCount() > 0 && (
            <span className="badge bg-soft-dark text-dark rounded-circle ms-1">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
      </Dropdown.Trigger>
      
      <Dropdown.Content className="dropdown-menu-sm-end dropdown-card card-dropdown-filter-centered">
        <div className="card card-sm">
          <div className="card-body">
            <div className="d-grid gap-3">
              {/* Published Switch */}
              <div className="d-flex justify-content-between align-items-center gap-4">
                <div>
                  <span>Published</span>
                  <span className="text-muted small ms-2">({projectStats.published})</span>
                </div>
                <div className="form-check form-switch mb-0">
                  <input 
                    type="checkbox" 
                    className="form-check-input d-flex align-items-center justify-content-end me-0"
                    id="togglePublished"
                    checked={showPublished}
                    onChange={(e) => onTogglePublished(e.target.checked)}
                  />
                </div>
              </div>

              {/* Draft Switch */}
              <div className="d-flex justify-content-between align-items-center gap-4">
                <div>
                  <span>Draft</span>
                  <span className="text-muted small ms-2">({projectStats.drafts})</span>
                </div>
                <div className="form-check form-switch mb-0">
                  <input 
                    type="checkbox" 
                    className="form-check-input d-flex align-items-center justify-content-end me-0"
                    id="toggleDrafts"
                    checked={showDrafts}
                    onChange={(e) => onToggleDrafts(e.target.checked)}
                  />
                </div>
              </div>

              {/* Archived Switch */}
              <div className="d-flex justify-content-between align-items-center gap-4">
                <div>
                  <span>Archived</span>
                  <span className="text-muted small ms-2">({projectStats.archived})</span>
                </div>
                <div className="form-check form-switch mb-0">
                  <input 
                    type="checkbox" 
                    className="form-check-input d-flex align-items-center justify-content-end me-0"
                    id="toggleArchived"
                    checked={showArchived}
                    onChange={(e) => onToggleArchived(e.target.checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dropdown.Content>
    </Dropdown>
  );
};

export default FilterDropdown;
