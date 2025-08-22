import { Container, Row, Col, Table, Button, Badge } from 'react-bootstrap';
import React, { useState, useEffect, useMemo } from 'react';
import { Eye, FileEarmark, Pencil, Plus, Trash2, Search, Filter } from 'react-bootstrap-icons';
import Head from 'next/head';
import Link from 'next/link';
import { useCMSStore } from '@/store/cmsStore';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function ProjectsManagementPage() {
  const { projects, loading, error, fetchProjects, deleteProject } = useCMSStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
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

  const handleDeleteProject = async (id: string, title: string) => {
    setDeleteConfirm({ id, title });
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

        {/* Projects Card */}
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
              {!deleteConfirm && (
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

          {/* Table */}
          <div className="table-responsive datatable-custom">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger m-3">
                <strong>Error:</strong> {error}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <FileEarmark size={48} className="mb-3" />
                <h5 className="mt-3">No projects found</h5>
                <p>
                  {projects.length === 0 
                    ? "You haven't created any projects yet." 
                    : "No projects match your current filters."
                  }
                </p>
                {projects.length === 0 && (
                  <Link href="/admin/project/new" className="btn btn-outline-primary">
                    Create Your First Project
                  </Link>
                )}
              </div>
            ) : (
              <table className="table table-lg table-borderless table-thead-bordered table-nowrap table-align-middle card-table">
                <thead className="thead-light">
                  <tr>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Technologies</th>
                    <th>Category</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-soft-primary avatar-circle me-3">
                            <span className="avatar-initials">
                              {project.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <span className="d-block h5 text-inherit mb-0">{project.title}</span>
                            <span className="d-block fs-6 text-body">
                              {project.shortDescription.length > 50 
                                ? `${project.shortDescription.substring(0, 50)}...` 
                                : project.shortDescription
                              }
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`legend-indicator ${project.published ? 'bg-success' : 'bg-warning'}`}></span>
                        {project.published ? 'Published' : 'Draft'}
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {project.technologies.slice(0, 2).map((tech) => (
                            <Badge key={tech} bg="secondary" className="small">
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 2 && (
                            <Badge bg="light" className="text-dark small">
                              +{project.technologies.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-soft-info text-info">
                          {project.category}
                        </span>
                      </td>
                      <td className="text-muted">
                        {formatDate(project.createdAt)}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          {project.published && (
                            <Link href={`/project/${project.slug}`}>
                              <Button size="sm" variant="outline-primary" title="View Project">
                                <Eye size={12} />
                              </Button>
                            </Link>
                          )}
                          <Link href={`/admin/project/${project.id}/edit`}>
                            <Button size="sm" variant="outline-secondary" title="Edit Project">
                              <Pencil size={12} />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDeleteProject(project.id, project.title)}
                            title="Delete Project"
                            disabled={!!deleteConfirm}
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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