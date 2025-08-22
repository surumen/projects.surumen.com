import { Container, Row, Col, Card, Table, Button, Badge } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { Eye, FileEarmark, Pencil, Plus, Trash2 } from 'react-bootstrap-icons';
import Head from 'next/head';
import Link from 'next/link';
import { useCMSStore } from '@/store/cmsStore';
import { SmartForm } from '@/widgets';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import type { FieldConfig } from '@/types/forms/advanced';

function ProjectsManagementPage() {
  const { projects, loading, error, fetchProjects, deleteProject } = useCMSStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && project.published) ||
                         (filterStatus === 'draft' && !project.published);
    
    return matchesSearch && matchesFilter;
  });

  const handleDeleteProject = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteProject(id);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Form fields for filters
  const filterFields: FieldConfig[] = [
    {
      name: 'search',
      label: 'Search Projects',
      type: 'input',
      inputType: 'text',
      placeholder: 'Search projects...',
      initialValue: searchTerm
    },
    {
      name: 'status',
      label: 'Filter by Status',
      type: 'select',
      options: [
        { value: 'all', label: 'All Projects' },
        { value: 'published', label: 'Published' },
        { value: 'draft', label: 'Drafts' }
      ],
      initialValue: filterStatus
    }
  ];

  const handleFilterSubmit = (values: Record<string, any>) => {
    setSearchTerm(values.search || '');
    setFilterStatus(values.status || 'all');
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Admin | Manage Projects</title>
      </Head>
      
      <Container className="py-4">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>Manage Projects</h3>
              <div className="d-flex gap-2">
                <Link href="/admin/project/new" passHref>
                  <button className="btn btn-sm btn-success">
                    <Plus size={12} className='me-2' /> New Project
                  </button>
                </Link>
              </div>
            </div>

            <Card>
              <Card.Header>
                <Row className="align-items-center">
                  <Col md={8}>
                    <SmartForm
                      config={{
                        fields: filterFields,
                        onSubmit: handleFilterSubmit
                      }}
                      onFieldChange={(name, value) => {
                        // Real-time filtering
                        if (name === 'search') {
                          setSearchTerm(value || '');
                        } else if (name === 'status') {
                          setFilterStatus(value || 'all');
                        }
                      }}
                      renderSubmitButton={() => null} // No submit button needed for real-time filtering
                    />
                  </Col>
                  <Col md={4} className="text-end">
                    <small className="text-muted">
                      {filteredProjects.length} of {projects.length} projects
                    </small>
                  </Col>
                </Row>
              </Card.Header>

              <Card.Body className="p-0">
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
                    <FileEarmark size={24} />
                    <h5 className="mt-3">No projects found</h5>
                    <p>
                      {projects.length === 0 
                        ? "You haven't created any projects yet." 
                        : "No projects match your current filters."
                      }
                    </p>
                    {projects.length === 0 && (
                      <Link href="/admin/project/new" passHref>
                        <button className="btn btn-outline-primary">
                          Create Your First Project
                        </button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <Table responsive hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Title</th>
                        <th>Slug</th>
                        <th>Status</th>
                        <th>Technologies</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((project) => (
                        <tr key={project.id}>
                          <td>
                            <div>
                              <strong>{project.title}</strong>
                              <div className="text-muted small">
                                {project.shortDescription.substring(0, 60)}...
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge bg="info">{project.slug}</Badge>
                          </td>
                          <td>
                            <Badge bg={project.published ? 'success' : 'warning'}>
                              {project.published ? 'Published' : 'Draft'}
                            </Badge>
                          </td>
                          <td>
                            {project.technologies.slice(0, 3).map((tech) => (
                              <Badge key={tech} bg="secondary" className="me-1">
                                {tech}
                              </Badge>
                            ))}
                            {project.technologies.length > 3 && (
                              <Badge bg="light" className="text-dark">
                                +{project.technologies.length - 3}
                              </Badge>
                            )}
                          </td>
                          <td className="text-muted">
                            {formatDate(project.createdAt)}
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              {project.published && (
                                <Link href={`/project/${project.slug}`} passHref>
                                  <Button size="sm" variant="outline-primary">
                                    <Eye size={12} />
                                  </Button>
                                </Link>
                              )}
                              <Link href={`/admin/project/${project.id}/edit`} passHref>
                                <Button size="sm" variant="outline-secondary">
                                  <Pencil size={12} />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDeleteProject(project.id, project.title)}
                              >
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </ProtectedRoute>
  );
}

export default ProjectsManagementPage;