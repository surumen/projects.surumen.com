import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Plus, Eye, Pencil, Trash3 } from 'react-bootstrap-icons';
import Head from 'next/head';
import Link from 'next/link';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useCMSStore } from '@/store/cmsStore';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { SmartTable } from '@/widgets';
import type { ColumnConfig, SelectionConfig } from '@/types';

// Constants
const FILTER_OPTIONS = {
  ALL: 'all',
  PUBLISHED: 'published', 
  DRAFT: 'draft',
  ARCHIVED: 'archived'
} as const;

const STATUS_CONFIG = {
  published: { label: 'Published', color: 'primary' },
  drafts: { label: 'Drafts', color: 'success' },
  archived: { label: 'Archived', color: 'secondary' }
};

// Navigation helpers
const navigateTo = (url: string) => window.location.href = url;
const openInNewTab = (url: string) => window.open(url, '_blank');

// Column definitions
const createColumns = (handleDeleteProject: (project: any) => void, deleteInProgress: boolean): ColumnConfig[] => [
  {
    key: 'project',
    header: 'Project',
    renderer: 'custom',
    customConfig: {
      render: (value, row) => (
        <div className="d-flex align-items-center">
          <div className="avatar avatar-soft-primary avatar-circle me-3">
            <span className="avatar-initials">
              {row.title.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <span className="d-block h5 text-inherit mb-0">{row.title}</span>
            <span className="d-block fs-6 text-body">
              {row.shortDescription.length > 50 
                ? `${row.shortDescription.substring(0, 50)}...` 
                : row.shortDescription
              }
            </span>
          </div>
        </div>
      )
    }
  },
  {
    key: 'status',
    header: 'Status',
    renderer: 'custom',
    customConfig: {
      render: (value, row) => {
        if (row.archived) {
          return (
            <>
              <span className="legend-indicator bg-secondary me-2"></span>
              Archived
            </>
          );
        }
        return (
          <>
            <span className={`legend-indicator ${row.published ? 'bg-success' : 'bg-warning'} me-2`}></span>
            {row.published ? 'Published' : 'Draft'}
          </>
        );
      }
    }
  },
  {
    key: 'technologies',
    header: 'Technologies',
    renderer: 'badge'
  },
  {
    key: 'category',
    header: 'Category',
    renderer: 'badge',
    badgeConfig: {
      colorMap: {
        'web development': 'info',
        'data science': 'primary',
        'mobile': 'success'
      }
    }
  },
  {
    key: 'createdAt',
    header: 'Created',
    format: 'date'
  },
  {
    key: 'actions',
    header: 'Actions',
    renderer: 'custom',
    customConfig: {
      render: (value, row) => (
        <div className="btn-group" role="group">
          {row.published && (
            <button
              type="button"
              className="btn btn-white btn-sm"
              onClick={() => openInNewTab(`/project/${row.slug}`)}
            >
              <Eye size={12} className='me-1' /> View
            </button>
          )}
          <button
            type="button"
            className="btn btn-white btn-sm"
            onClick={() => navigateTo(`/admin/project/${row.id}/edit`)}
          >
            <Pencil size={12} className='me-1' /> Edit
          </button>
          <button
            type="button"
            className="btn btn-white text-danger btn-sm"
            onClick={() => handleDeleteProject(row)}
            disabled={deleteInProgress}
          >
            <Trash3 size={12} className='me-1'/> Delete
          </button>
        </div>
      )
    }
  }
];

function ProjectsManagementPage() {
  const { 
    projects, 
    loading, 
    error, 
    fetchProjects, 
    deleteProject,
    batchDeleteProjects,
    batchArchiveProjects,
    batchPublishProjects,
    batchUnpublishProjects
  } = useCMSStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>(FILTER_OPTIONS.ALL);
  const [selectedProjects, setSelectedProjects] = useState<any[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Calculate project statistics with status configurations
  const projectStats = useMemo(() => {
    const published = projects.filter(p => p.published && !p.archived).length;
    const drafts = projects.filter(p => !p.published && !p.archived).length;
    const archived = projects.filter(p => p.archived).length;
    const total = projects.length;
    
    const stats = {
      total,
      published,
      drafts,
      archived,
    };
    
    // Calculate percentages
    const statuses = Object.keys(STATUS_CONFIG).map(key => ({
      key,
      ...STATUS_CONFIG[key],
      count: stats[key],
      percentage: total > 0 ? (stats[key] / total) * 100 : 0
    }));

    return {
      ...stats,
      statuses
    };
  }, [projects]);

  // Filtered projects based on search and filter
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterStatus === FILTER_OPTIONS.ALL || 
                           (filterStatus === FILTER_OPTIONS.PUBLISHED && project.published && !project.archived) ||
                           (filterStatus === FILTER_OPTIONS.DRAFT && !project.published && !project.archived) ||
                           (filterStatus === FILTER_OPTIONS.ARCHIVED && project.archived);
      
      return matchesSearch && matchesFilter;
    });
  }, [projects, searchTerm, filterStatus]);

  // Find project being deleted
  const deleteTarget = useMemo(() => 
    deleteTargetId ? projects.find(p => p.id === deleteTargetId) : null,
    [deleteTargetId, projects]
  );

  // Event handlers
  const handleDeleteProject = (project: any) => setDeleteTargetId(project.id);
  const confirmDelete = async () => {
    if (deleteTargetId) {
      await deleteProject(deleteTargetId);
      setDeleteTargetId(null);
    }
  };
  const cancelDelete = () => setDeleteTargetId(null);

  // Selection action handlers
  const handleDeleteSelected = async () => {
    if (selectedProjects.length === 0) return;
    
    const projectTitles = selectedProjects.map(p => p.title).join('", "');
    const confirmMessage = `Are you sure you want to permanently delete ${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''}?\n\n"${projectTitles}"\n\nThis action cannot be undone and will also delete all associated blog posts.`;
    
    if (!confirm(confirmMessage)) return;
    
    try {
      const projectIds = selectedProjects.map(p => p.id);
      await batchDeleteProjects(projectIds);
      setSelectedProjects([]);
      // Success feedback could be added here (toast notification)
    } catch (error) {
      console.error('Failed to delete projects:', error);
      // Error feedback could be added here
    }
  };

  const handleArchiveSelected = async () => {
    if (selectedProjects.length === 0) return;
    
    try {
      const projectIds = selectedProjects.map(p => p.id);
      await batchArchiveProjects(projectIds);
      setSelectedProjects([]);
      // Success: Projects archived and hidden from public view
    } catch (error) {
      console.error('Failed to archive projects:', error);
    }
  };

  const handlePublishSelected = async () => {
    if (selectedProjects.length === 0) return;
    
    // Only publish unpublished projects
    const unpublishedProjects = selectedProjects.filter(p => !p.published);
    if (unpublishedProjects.length === 0) {
      alert('All selected projects are already published.');
      return;
    }
    
    try {
      const projectIds = unpublishedProjects.map(p => p.id);
      await batchPublishProjects(projectIds);
      setSelectedProjects([]);
      // Success: Projects published and now visible on portfolio
    } catch (error) {
      console.error('Failed to publish projects:', error);
    }
  };

  const handleUnpublishSelected = async () => {
    if (selectedProjects.length === 0) return;
    
    // Only unpublish published projects
    const publishedProjects = selectedProjects.filter(p => p.published);
    if (publishedProjects.length === 0) {
      alert('All selected projects are already unpublished.');
      return;
    }
    
    try {
      const projectIds = publishedProjects.map(p => p.id);
      await batchUnpublishProjects(projectIds);
      setSelectedProjects([]);
      // Success: Projects hidden from public view
    } catch (error) {
      console.error('Failed to unpublish projects:', error);
    }
  };

  // Table configuration
  const columns = useMemo(() => 
    createColumns(handleDeleteProject, !!deleteTargetId), 
    [deleteTargetId]
  );

  const selectionConfig: SelectionConfig = {
    mode: 'multiple',
    selectedRows: selectedProjects,
    onSelectionChange: setSelectedProjects,
    selectRowsBy: 'id'
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Admin | Projects Dashboard</title>
      </Head>
      
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="page-header-title">Admin Dashboard</h1>
            </div>
            <div className="col-auto">
              <Link href="/admin/project/new" className="btn btn-primary">
                <Plus size={16} className="me-1" /> New project
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="card shadow-none mb-3 mb-lg-5">
          <div className="card-body">
            <div className="d-flex align-items-md-center">
              <div className="flex-shrink-0">
                <span className="display-3 text-dark">{projectStats.total}</span>
              </div>

              <div className="flex-grow-1 ms-3">
                <div className="row mx-md-n3">
                  <div className="col-md px-md-4 align-middle">
                    <span className="d-block">Total projects</span>
                  </div>

                  <div className="col-md-9 col-lg-10 column-md-divider px-md-4">
                    {/* Status Legend */}
                    <div className="row justify-content-start mb-2">
                      {projectStats.statuses.map((status) => (
                        <div key={status.key} className="col-auto">
                          <span className={`legend-indicator bg-${status.color}`}></span>
                          {status.label} ({status.count})
                        </div>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="progress rounded-pill">
                      {projectStats.statuses.map((status, index) => (
                        <div
                          key={status.key}
                          className={`progress-bar ${index === 0 ? '' : `bg-${status.color}`}`}
                          role="progressbar"
                          style={{ width: `${status.percentage}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Table Card */}
        <div className="card">
          {/* Header */}
          <div className="card-header card-header-content-md-between">
            <div className="mb-2 mb-md-0">
              <form onSubmit={(e) => e.preventDefault()}>
                {/* Search */}
                <div className="input-group input-group-merge input-group-flush">
                  <div className="input-group-prepend input-group-text">
                    <Search size={16} />
                  </div>
                  <input 
                    type="search" 
                    className="form-control" 
                    placeholder="Search projects" 
                    aria-label="Search projects"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
            </div>

            <div className="d-grid d-sm-flex justify-content-md-end align-items-sm-center gap-2">
              {/* Selection Actions */}
              {selectedProjects.length > 0 ? (
                <div className="d-sm-flex justify-content-lg-end align-items-sm-center">
                  <span className="d-block d-sm-inline-block fs-5 me-3 mb-2 mb-sm-0">
                    <span id="datatableCounter">{selectedProjects.length}</span> Selected
                  </span>
                  <button 
                    className="btn btn-outline-danger btn-sm mb-2 mb-sm-0 me-2" 
                    type="button"
                    onClick={handleDeleteSelected}
                  >
                    <i className="bi-trash"></i> Delete
                  </button>
                  <button 
                    className="btn btn-white btn-sm mb-2 mb-sm-0 me-2" 
                    type="button"
                    onClick={handleArchiveSelected}
                  >
                    <i className="bi-archive"></i> Archive
                  </button>
                  <button 
                    className="btn btn-white btn-sm mb-2 mb-sm-0 me-2" 
                    type="button"
                    onClick={handlePublishSelected}
                  >
                    <i className="bi-upload"></i> Publish
                  </button>
                  <button 
                    className="btn btn-white btn-sm mb-2 mb-sm-0" 
                    type="button"
                    onClick={handleUnpublishSelected}
                  >
                    <i className="bi-x-lg"></i> Unpublish
                  </button>
                </div>
              ) : deleteTarget ? (
                /* Delete Confirmation */
                <div className="d-flex align-items-center">
                  <span className="fs-6 me-3 text-danger">
                    Delete "{deleteTarget.title}"?
                  </span>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cancelDelete}>
                      Cancel
                    </button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={confirmDelete}>
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                /* Filter Dropdown */
                <div className="dropdown">
                  <button 
                    type="button" 
                    className="btn btn-ghost-white btn-sm w-100"
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <Filter size={16} className="me-1" /> Filter
                    {filterStatus !== FILTER_OPTIONS.ALL && (
                      <span className="badge bg-soft-dark text-dark rounded-circle ms-1">1</span>
                    )}
                  </button>

                  <div className="dropdown-menu dropdown-menu-end">
                    <button 
                      className={`dropdown-item ${filterStatus === FILTER_OPTIONS.ALL ? 'active' : ''}`}
                      onClick={() => setFilterStatus(FILTER_OPTIONS.ALL)}
                    >
                      All Projects
                    </button>
                    <button 
                      className={`dropdown-item ${filterStatus === FILTER_OPTIONS.PUBLISHED ? 'active' : ''}`}
                      onClick={() => setFilterStatus(FILTER_OPTIONS.PUBLISHED)}
                    >
                      Published Only
                    </button>
                    <button 
                      className={`dropdown-item ${filterStatus === FILTER_OPTIONS.DRAFT ? 'active' : ''}`}
                      onClick={() => setFilterStatus(FILTER_OPTIONS.DRAFT)}
                    >
                      Drafts Only
                    </button>
                    <button 
                      className={`dropdown-item ${filterStatus === FILTER_OPTIONS.ARCHIVED ? 'active' : ''}`}
                      onClick={() => setFilterStatus(FILTER_OPTIONS.ARCHIVED)}
                    >
                      Archived Only
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Smart Table */}
          <SmartTable
            data={filteredProjects}
            columns={columns}
            selection={selectionConfig}
            styling={{
              size: 'lg',
              theme: 'borderless',
              headerLight: true,
              nowrap: true,
              verticalAlign: 'middle',
              className: 'card-table'
            }}
            loading={{
              show: loading,
              rowCount: 5,
              message: 'Loading projects...'
            }}
            emptyState={{
              show: !loading && filteredProjects.length === 0,
              message: projects.length === 0 
                ? "You haven't created any projects yet." 
                : "No projects match your current filters.",
              icon: 'folder',
              action: projects.length === 0 ? {
                label: 'Create Your First Project',
                onClick: () => navigateTo('/admin/project/new')
              } : undefined
            }}
          />

          {/* Footer */}
          {filteredProjects.length > 0 && (
            <div className="card-footer">
              <div className="row justify-content-center justify-content-sm-between align-items-sm-center">
                <div className="col-sm mb-2 mb-sm-0">
                  <div className="d-flex justify-content-center justify-content-sm-start align-items-center">
                    <span className="me-2">Showing:</span>
                    <span>{filteredProjects.length}</span>
                    <span className="text-secondary mx-2">of</span>
                    <span>{projects.length}</span>
                    <span className="text-secondary ms-1">projects</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default ProjectsManagementPage;
