import { Container, Row, Col, Table, Button, Badge } from 'react-bootstrap';
import React, { useState, useEffect, useMemo } from 'react';
import { Eye, FileEarmark, Pencil, Plus, Trash2, Search, Filter } from 'react-bootstrap-icons';
import Head from 'next/head';
import Link from 'next/link';
import { useCMSStore } from '@/store/cmsStore';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { SmartTable } from '@/widgets';
import type { ColumnConfig, SelectionConfig } from '@/types';

function ProjectsManagementPage() {
  const { projects, loading, error, fetchProjects, deleteProject } = useCMSStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedProjects, setSelectedProjects] = useState<any[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{id: string, title: string} | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Calculate project statistics
  const projectStats = useMemo(() => {
    const published = projects.filter(p => p.published).length;
    const drafts = projects.filter(p => !p.published).length;
    const total = projects.length;
    
    return {
      total,
      published,
      drafts,
      archived: 0, // Future feature
      publishedPercentage: total > 0 ? (published / total) * 100 : 0,
      draftsPercentage: total > 0 ? (drafts / total) * 100 : 0
    };
  }, [projects]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && project.published) ||
                         (filterStatus === 'draft' && !project.published);
    
    return matchesSearch && matchesFilter;
  });

  const handleDeleteProject = async (project: any) => {
    setDeleteConfirm({ id: project.id, title: project.title });
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      await deleteProject(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // SmartTable column configuration
  const columns: ColumnConfig[] = [
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
        render: (value, row) => (
          <>
            <span className={`legend-indicator ${row.published ? 'bg-success' : 'bg-warning'} me-2`}></span>
            {row.published ? 'Published' : 'Draft'}
          </>
        )
      }
    },
    {
      key: 'technologies',
      header: 'Technologies',
      renderer: 'technologies'
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
      renderer: 'custom',
      customConfig: {
        render: (value) => (
          <span className="text-muted">
            {formatDate(value)}
          </span>
        )
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      renderer: 'custom',
      customConfig: {
        render: (value, row) => (
          <div className="d-flex gap-1">
            {row.published && (
              <Link href={`/project/${row.slug}`}>
                <Button size="sm" variant="outline-primary" title="View Project">
                  <Eye size={12} />
                </Button>
              </Link>
            )}
            <Link href={`/admin/project/${row.id}/edit`}>
              <Button size="sm" variant="outline-secondary" title="Edit Project">
                <Pencil size={12} />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={() => handleDeleteProject(row)}
              title="Delete Project"
              disabled={!!deleteConfirm}
            >
              <Trash2 size={12} />
            </Button>
          </div>
        )
      }
    }
  ];

  // Selection configuration
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
        <div className="card mb-3 mb-lg-5">
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
                    <div className="row justify-content-start mb-2">
                      <div className="col-auto">
                        <span className="legend-indicator bg-primary"></span>
                        Published ({projectStats.published})
                      </div>
                      <div className="col-auto">
                        <span className="legend-indicator bg-success"></span>
                        Drafts ({projectStats.drafts})
                      </div>
                      <div className="col-auto">
                        <span className="legend-indicator"></span>
                        Archived ({projectStats.archived})
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="progress rounded-pill">
                      <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ width: `${projectStats.publishedPercentage}%` }}
                        aria-valuenow={projectStats.publishedPercentage} 
                        aria-valuemin={0} 
                        aria-valuemax={100}
                      ></div>
                      <div 
                        className="progress-bar bg-success" 
                        role="progressbar" 
                        style={{ width: `${projectStats.draftsPercentage}%` }}
                        aria-valuenow={projectStats.draftsPercentage} 
                        aria-valuemin={0} 
                        aria-valuemax={100}
                      ></div>
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
              {selectedProjects.length > 0 && (
                <div className="d-flex align-items-center">
                  <span className="fs-6 me-3">
                    {selectedProjects.length} selected
                  </span>
                  <Button size="sm" variant="outline-danger">
                    <Trash2 size={12} className="me-1" />
                    Delete Selected
                  </Button>
                </div>
              )}

              {/* Delete Confirmation */}
              {deleteConfirm && (
                <div className="d-flex align-items-center">
                  <span className="fs-6 me-3 text-danger">
                    Delete "{deleteConfirm.title}"?
                  </span>
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="outline-secondary" onClick={cancelDelete}>
                      Cancel
                    </Button>
                    <Button size="sm" variant="danger" onClick={confirmDelete}>
                      Delete
                    </Button>
                  </div>
                </div>
              )}

              {/* Filter Dropdown */}
              {!deleteConfirm && selectedProjects.length === 0 && (
                <div className="dropdown">
                  <button 
                    type="button" 
                    className="btn btn-white btn-sm w-100" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <Filter size={16} className="me-1" /> Filter
                    {filterStatus !== 'all' && (
                      <span className="badge bg-soft-dark text-dark rounded-circle ms-1">1</span>
                    )}
                  </button>

                  <div className="dropdown-menu dropdown-menu-end">
                    <button 
                      className={`dropdown-item ${filterStatus === 'all' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('all')}
                    >
                      All Projects
                    </button>
                    <button 
                      className={`dropdown-item ${filterStatus === 'published' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('published')}
                    >
                      Published Only
                    </button>
                    <button 
                      className={`dropdown-item ${filterStatus === 'draft' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('draft')}
                    >
                      Drafts Only
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Smart Table */}
          <div className="table-responsive datatable-custom">
            <SmartTable
              data={filteredProjects}
              columns={columns}
              variant="basic"
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
                  onClick: () => window.location.href = '/admin/project/new'
                } : undefined
              }}
            />
          </div>

          {/* Footer */}
          {filteredProjects.length > 0 && (
            <div className="card-footer">
              <div className="row justify-content-center justify-content-sm-between align-items-sm-center">
                <div className="col-sm mb-2 mb-sm-0">
                  <div className="d-flex justify-content-center justify-content-sm-start align-items-center">
                    <span className="me-2">Showing:</span>
                    <span className="fw-semibold">{filteredProjects.length}</span>
                    <span className="text-secondary mx-2">of</span>
                    <span id="datatableWithPaginationInfoTotalQty">{projects.length}</span>
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
