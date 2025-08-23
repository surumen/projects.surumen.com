import React, { useState } from 'react';
import { Container, Row, Col, Button, Breadcrumb, Card } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FormCardSection } from '@/widgets/forms';
import { validationRules } from '@/widgets/forms';
import { FormIcons } from '@/widgets/forms';
import { useFormCoordinator } from '@/hooks/useFormCoordinator';
import { useCMSStore } from '@/store/cmsStore';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import type { FieldConfig } from '@/types/forms/advanced';
import type { Project } from '@/types';

// Project-specific slug generation
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

function NewProjectPage() {
  const router = useRouter();
  const { createProject, loading } = useCMSStore();

  // Project-specific configuration
  const requiredFields = ['title', 'shortDescription', 'description', 'technologies', 'year', 'category'];
  
  // Project-specific value change handler (for slug generation)
  const handleValueChange = (name: string, value: any, allValues: Record<string, any>) => {
    // Auto-generate slug from title if slug is empty
    if (name === 'title' && value && !allValues.slug) {
      coordinator.updateValues({ slug: generateSlug(value) });
    }
  };

  // Initialize form coordinator with project-specific config
  const coordinator = useFormCoordinator({
    initialValues: {},
    requiredFields,
    onValueChange: handleValueChange
  });

  // Project-specific field configurations
  const basicInfoFields: FieldConfig[] = [
    {
      name: 'title',
      label: 'Project name',
      type: 'input',
      inputType: 'text',
      required: true,
      placeholder: 'Enter project name here',
      helpText: 'The main title of your project displayed publicly',
      styling: {
        inputGroup: {
          prepend: {
            icon: FormIcons.briefcase
          },
          merge: true
        }
      },
      validate: [
        validationRules.required('Project name'),
        validationRules.minLength(3),
        validationRules.maxLength(100)
      ]
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      placeholder: 'Select category',
      row: { columns: 6 },
      options: [
        { value: 'Web Development', label: 'Web Development' },
        { value: 'Mobile App', label: 'Mobile App' },
        { value: 'AI/ML', label: 'AI/ML' },
        { value: 'Data Science', label: 'Data Science' },
        { value: 'DevOps', label: 'DevOps' },
        { value: 'API/Backend', label: 'API/Backend' },
        { value: 'Frontend', label: 'Frontend' },
        { value: 'Full Stack', label: 'Full Stack' },
        { value: 'Automation', label: 'Automation' },
        { value: 'Other', label: 'Other' }
      ],
      validate: [
        validationRules.required('Category')
      ]
    },
    {
      name: 'year',
      label: 'Year Completed',
      type: 'select',
      required: true,
      placeholder: 'Select year',
      initialValue: new Date().getFullYear(),
      row: { columns: 6 },
      options: Array.from({ length: 10 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return { value: year, label: year.toString() };
      }),
      validate: [
        validationRules.required('Completion year')
      ]
    },
    {
      name: 'slug',
      label: 'URL Slug',
      type: 'input',
      inputType: 'text',
      placeholder: 'generated-from-project-name',
      helpText: 'Auto-generated from title if left empty',
      row: { columns: 6 },
      styling: {
        inputGroup: {
          prepend: {
            icon: FormIcons.clipboard
          },
          merge: true
        }
      },
      validate: [
        validationRules.pattern(
          /^[a-z0-9-]*$/,
          'Slug must contain only lowercase letters, numbers, and hyphens'
        )
      ]
    },
    {
      name: 'blog',
      label: 'Blog',
      type: 'input',
      inputType: 'text',
      placeholder: 'blog-post-slug',
      row: { columns: 6 },
      styling: {
        inputGroup: {
          prepend: {
            icon: FormIcons.text
          },
          merge: true
        }
      }
    }
  ];

  const technicalFields: FieldConfig[] = [
    {
      name: 'technologies',
      label: 'Technologies',
      type: 'tags',
      required: true,
      placeholder: 'Add technologies...',
      helpText: 'Tech stack used in this project',
      suggestions: [
        'React', 'Next.js', 'TypeScript', 'JavaScript', 'Python',
        'Node.js', 'Firebase', 'MongoDB', 'PostgreSQL', 'AWS',
        'Docker', 'Kubernetes', 'Machine Learning', 'AI/ML',
        'OpenAI', 'Anthropic', 'TensorFlow', 'Bootstrap', 'Tailwind CSS'
      ],
      allowCustomTags: true,
      maxTags: 10,
      validate: [
        validationRules.required('Technologies')
      ]
    }
  ];

  const contentFields: FieldConfig[] = [
    {
      name: 'shortDescription',
      label: 'Short description',
      type: 'textarea',
      required: true,
      rows: 3,
      placeholder: 'Short description',
      helpText: 'Brief summary for project listings',
      validate: [
        validationRules.required('Short description'),
        validationRules.minLength(10),
        validationRules.maxLength(200)
      ]
    },
    {
      name: 'description',
      label: 'Full description',
      type: 'richtext',
      required: true,
      placeholder: 'Enter detailed description...',
      toolbar: 'full',
      height: 300,
      validate: [
        validationRules.required('Full description'),
        validationRules.minLength(50)
      ]
    }
  ];

  const publishingFields: FieldConfig[] = [
    {
      name: 'published',
      label: 'Confirm you want to publish this project',
      type: 'switch',
      initialValue: false,
      helpText: 'Publishing this project will show it to the public immediately'
    }
  ];

  // Handle final form submission
  const handleSubmit = async () => {
    if (!coordinator.canSubmit) return;

    try {
      const projectData: Partial<Project> = {
        title: coordinator.values.title,
        slug: coordinator.values.slug || generateSlug(coordinator.values.title),
        shortDescription: coordinator.values.shortDescription,
        description: coordinator.values.description,
        technologies: coordinator.values.technologies || [],
        year: parseInt(coordinator.values.year),
        category: coordinator.values.category,
        blog: coordinator.values.blog || undefined,
        published: coordinator.values.published || false
      };

      const newProject = await createProject(projectData);
      if (newProject) {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Project creation failed:', error);
    }
  };

  // Status icon helper - removed since we're keeping it simple

  return (
    <ProtectedRoute>
      <Head>
        <title>Add New Project | Admin</title>
      </Head>
      
      <Container fluid className="py-4">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col-sm mb-2 mb-sm-0">
              <Breadcrumb className="breadcrumb breadcrumb-no-gutter">
                <Breadcrumb.Item href="/admin">Projects</Breadcrumb.Item>
                <Breadcrumb.Item active>Add Project</Breadcrumb.Item>
              </Breadcrumb>
              <h1 className="page-header-title">Create New Project</h1>
            </div>
          </div>
        </div>

        <Row>
          <Col lg={8}>
            <div className="d-grid gap-3 gap-lg-5">
              
              {/* Basic Information Section */}
              <FormCardSection
                sectionId="basic"
                title="Project Details"
                fields={basicInfoFields}
                coordinator={coordinator}
              />

              {/* Technologies Section */}
              <FormCardSection
                sectionId="technical"
                title="Technologies"
                fields={technicalFields}
                coordinator={coordinator}
              />

              {/* Description Section */}
              <FormCardSection
                sectionId="content"
                title="Description"
                fields={contentFields}
                coordinator={coordinator}
              />

              {/* Publishing Section */}
              <FormCardSection
                sectionId="publishing"
                title="Publish"
                fields={publishingFields}
                coordinator={coordinator}
              >
              </FormCardSection>

            </div>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Progress Card */}
            <Card className="card-body mb-3 mb-lg-5">
              <h5>Progress</h5>
              <div className="d-flex justify-content-between align-items-center">
                <div className="progress flex-grow-1">
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ width: `${coordinator.progress}%` }}
                    aria-valuenow={coordinator.progress}
                  />
                </div>
                <span className="ms-4">{Math.round(coordinator.progress)}%</span>
              </div>
              
              <div className="mt-3">
                <div className="d-flex justify-content-between text-sm">
                  <span>Completed sections:</span>
                  <span>{coordinator.completedSections.length} / {Object.keys(coordinator.sectionValidation).length}</span>
                </div>
                {coordinator.totalErrors > 0 && (
                  <div className="d-flex justify-content-between text-sm text-warning">
                    <span>Total errors:</span>
                    <span>{coordinator.totalErrors}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Preview Card */}
            <Card className="mb-3 mb-lg-5">
              <Card.Header>
                <h4 className="card-header-title">Preview</h4>
              </Card.Header>
              <Card.Body>
                {coordinator.values.title ? (
                  <div className="project-preview">
                    {/* Header Section */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="mb-0 fw-bold">{coordinator.values.title}</h5>
                        {coordinator.values.year && (
                          <span className="badge bg-soft-secondary fs-6">
                            {coordinator.values.year}
                          </span>
                        )}
                      </div>
                      
                      {coordinator.values.category && (
                        <div className="mb-2">
                          <span className="badge bg-soft-info me-2">
                            {coordinator.values.category}
                          </span>
                          <span className={`badge ${coordinator.values.published ? 'bg-soft-success' : 'bg-soft-warning'}`}>
                            {coordinator.values.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      )}
                      
                      {coordinator.values.shortDescription && (
                        <p className="text-muted mb-2 lh-sm">
                          {coordinator.values.shortDescription}
                        </p>
                      )}
                    </div>

                    {/* Rich Description Preview */}
                    {coordinator.values.description && (
                      <div className="mb-3">
                        <h6 className="text-muted small text-uppercase mb-2">Description</h6>
                        <div 
                          className="border rounded p-3 bg-soft-light"
                          style={{ 
                            maxHeight: '200px', 
                            overflow: 'auto',
                            fontSize: '0.875rem',
                            lineHeight: '1.4'
                          }}
                          dangerouslySetInnerHTML={{ __html: coordinator.values.description }}
                        />
                      </div>
                    )}

                    {/* Technologies */}
                    {coordinator.values.technologies && coordinator.values.technologies.length > 0 && (
                      <div className="mb-3">
                        <h6 className="text-muted small text-uppercase mb-2">Technologies</h6>
                        <div className="d-flex gap-1 flex-wrap">
                          {coordinator.values.technologies.map((tech: string, index: number) => (
                            <span key={index} className="badge bg-primary">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* URL Preview */}
                    {(coordinator.values.slug || coordinator.values.title) && (
                      <div className="mb-3">
                        <h6 className="text-muted small text-uppercase mb-2">URL</h6>
                        <div className="bg-soft-secondary p-2 rounded">
                          <code className="small text-muted">
                            /project/{coordinator.values.slug || generateSlug(coordinator.values.title)}
                          </code>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <p className="text-muted mb-0">
                      Start filling out the form to see a live preview
                    </p>
                    <small className="text-muted">
                      Preview will update as you type
                    </small>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Fixed Bottom Actions */}
        <div className="position-fixed start-50 bottom-0 translate-middle-x w-100" style={{ zIndex: 99, marginBottom: '1rem', maxWidth: '40rem' }}>
          <Card className="card-sm bg-dark border-dark mx-2">
            <Card.Body>
              <div className="row justify-content-center justify-content-sm-between">
                <div className="col">
                  <Button 
                    variant="ghost-danger" 
                    disabled={loading}
                    onClick={() => coordinator.resetForm()}
                  >
                    Reset All
                  </Button>
                </div>
                <div className="col-auto">
                  <div className="d-flex gap-3">
                    <Button 
                      variant="ghost-light"
                      onClick={() => router.push('/admin')}
                      disabled={loading}
                    >
                      Discard
                    </Button>
                    <Button
                      variant="primary"
                      disabled={!coordinator.canSubmit || loading}
                      onClick={handleSubmit}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Validation Status */}
              {!coordinator.canSubmit && coordinator.progress > 0 && (
                <div className="row mt-2">
                  <div className="col">
                    <small className="text-light opacity-75">
                      {coordinator.sectionsWithErrors.length > 0 ? (
                        <>Complete required fields to save</>
                      ) : (
                        <>Complete required fields to save</>
                      )}
                    </small>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </Container>
    </ProtectedRoute>
  );
}

export default NewProjectPage;
