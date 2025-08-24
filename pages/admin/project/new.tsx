import React, { useState, useMemo, useCallback } from 'react';
import { Container, Row, Col, Button, Breadcrumb, Card } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { SmartForm } from '@/widgets';
import { validationRules } from '@/widgets/forms';
import { FormIcons } from '@/widgets/forms';
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

  // Simple coordination state
  const [allFormValues, setAllFormValues] = useState<Record<string, any>>({});
  const [sectionValidation, setSectionValidation] = useState<Record<string, { isValid: boolean; errors: Record<string, string> }>>({});
  const [formKeys, setFormKeys] = useState({ basic: 0, tech: 0, content: 0, publish: 0 });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Project-specific field configurations (memoized to prevent re-creation)
  const basicInfoFields: FieldConfig[] = useMemo(() => [
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
        },
        labelIcon: {
          icon: FormIcons.help,
          tooltip: 'Displayed on public forums, portfolios, and project listings',
          position: 'after'
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
  ], []);

  const technicalFields: FieldConfig[] = useMemo(() => [
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
  ], []);

  const contentFields: FieldConfig[] = useMemo(() => [
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
  ], []);

  const publishingFields: FieldConfig[] = useMemo(() => [
    {
      name: 'published',
      label: 'Confirm you want to publish this project',
      type: 'switch',
      initialValue: false,
      helpText: 'Publishing this project will show it to the public immediately'
    }
  ], []);

  // Simple coordination handlers
  const handleSectionChange = useCallback((sectionId: string, values: Record<string, any>) => {
    setAllFormValues(prev => ({
      ...prev,
      ...values
    }));

    // Auto-generate slug from title if slug is empty
    if (values.title && !values.slug) {
      setAllFormValues(prev => ({
        ...prev,
        ...values,
        slug: generateSlug(values.title)
      }));
    }
  }, []);

  const handleSectionValidation = useCallback((sectionId: string, isValid: boolean, errors: Record<string, string>) => {
    setSectionValidation(prev => ({
      ...prev,
      [sectionId]: { isValid, errors }
    }));
  }, []);

  // Reset all forms
  const handleResetForm = () => {
    setShowResetConfirm(true);
  };

  const confirmResetForm = () => {
    setAllFormValues({});
    setSectionValidation({});
    setFormKeys(prev => ({
      basic: prev.basic + 1,
      tech: prev.tech + 1,
      content: prev.content + 1,
      publish: prev.publish + 1
    }));
    setShowResetConfirm(false);
  };

  const cancelResetForm = () => {
    setShowResetConfirm(false);
  };

  // Handle discard with reliable navigation
  const handleDiscard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = '/admin';
  };

  // Calculate overall form status
  const { progress, canSubmit, totalErrors } = useMemo(() => {
    const allSections = Object.values(sectionValidation);
    const isAllValid = allSections.length > 0 && allSections.every(section => section.isValid);
    
    // Required fields check
    const requiredFields = ['title', 'shortDescription', 'description', 'technologies', 'year', 'category'];
    const hasRequiredFields = requiredFields.every(field => {
      const value = allFormValues[field];
      if (field === 'technologies') {
        return Array.isArray(value) && value.length > 0;
      }
      return value && value.toString().trim().length > 0;
    });

    const totalFields = basicInfoFields.length + technicalFields.length + contentFields.length + publishingFields.length;
    const completedFields = Object.keys(allFormValues).filter(key => {
      const value = allFormValues[key];
      return value !== undefined && value !== null && value !== '';
    }).length;

    const calculatedProgress = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
    const errors = allSections.reduce((sum, section) => sum + Object.keys(section.errors).length, 0);

    return {
      progress: calculatedProgress,
      canSubmit: isAllValid && hasRequiredFields,
      totalErrors: errors
    };
  }, [sectionValidation, allFormValues, basicInfoFields, technicalFields, contentFields, publishingFields]);

  // Handle final form submission
  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      const projectData: Partial<Project> = {
        title: allFormValues.title,
        slug: allFormValues.slug || generateSlug(allFormValues.title),
        shortDescription: allFormValues.shortDescription,
        description: allFormValues.description,
        technologies: allFormValues.technologies || [],
        year: parseInt(allFormValues.year),
        category: allFormValues.category,
        blog: allFormValues.blog || undefined,
        published: allFormValues.published || false
      };

      const newProject = await createProject(projectData);
      if (newProject) {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Project creation failed:', error);
    }
  };

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
              <Card className="card-lg">
                <Card.Header>
                  <h4 className="card-header-title">Project Details</h4>
                </Card.Header>
                <Card.Body>
                  <SmartForm
                    key={formKeys.basic}
                    config={{
                      fields: basicInfoFields,
                      onSubmit: () => {},
                      validation: { mode: 'onChange' }
                    }}
                    onFieldChange={(name, value, allValues) => handleSectionChange('basic', allValues)}
                    onValidationChange={(isValid, errors) => handleSectionValidation('basic', isValid, errors)}
                    renderSubmitButton={() => null}
                  />
                </Card.Body>
              </Card>

              {/* Technologies Section */}
              <Card className="card-lg">
                <Card.Header>
                  <h4 className="card-header-title">Technologies</h4>
                </Card.Header>
                <Card.Body>
                  <SmartForm
                    key={formKeys.tech}
                    config={{
                      fields: technicalFields,
                      onSubmit: () => {},
                      validation: { mode: 'onChange' }
                    }}
                    onFieldChange={(name, value, allValues) => handleSectionChange('tech', allValues)}
                    onValidationChange={(isValid, errors) => handleSectionValidation('tech', isValid, errors)}
                    renderSubmitButton={() => null}
                  />
                </Card.Body>
              </Card>

              {/* Description Section */}
              <Card className="card-lg">
                <Card.Header>
                  <h4 className="card-header-title">Description</h4>
                </Card.Header>
                <Card.Body>
                  <SmartForm
                    key={formKeys.content}
                    config={{
                      fields: contentFields,
                      onSubmit: () => {},
                      validation: { mode: 'onChange' }
                    }}
                    onFieldChange={(name, value, allValues) => handleSectionChange('content', allValues)}
                    onValidationChange={(isValid, errors) => handleSectionValidation('content', isValid, errors)}
                    renderSubmitButton={() => null}
                  />
                </Card.Body>
              </Card>

              {/* Publishing Section */}
              <Card className="card-lg">
                <Card.Header>
                  <h4 className="card-header-title">Publish</h4>
                </Card.Header>
                <Card.Body>
                  <SmartForm
                    key={formKeys.publish}
                    config={{
                      fields: publishingFields,
                      onSubmit: () => {},
                      validation: { mode: 'onChange' }
                    }}
                    onFieldChange={(name, value, allValues) => handleSectionChange('publish', allValues)}
                    onValidationChange={(isValid, errors) => handleSectionValidation('publish', isValid, errors)}
                    renderSubmitButton={() => null}
                  />
                </Card.Body>
              </Card>

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
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}
                  />
                </div>
                <span className="ms-4">{Math.round(progress)}%</span>
              </div>
              
              <div className="mt-3">
                <div className="d-flex justify-content-between text-sm">
                  <span>Completed sections:</span>
                  <span>{Object.values(sectionValidation).filter(section => section.isValid).length} / {Object.keys(formKeys).length}</span>
                </div>
                {totalErrors > 0 && (
                  <div className="d-flex justify-content-between text-sm text-warning">
                    <span>Total errors:</span>
                    <span>{totalErrors}</span>
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
                {allFormValues.title ? (
                  <div className="project-preview">
                    {/* Header Section */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="mb-0 fw-bold">{allFormValues.title}</h5>
                        {allFormValues.year && (
                          <span className="badge bg-soft-secondary fs-6">
                            {allFormValues.year}
                          </span>
                        )}
                      </div>
                      
                      {allFormValues.category && (
                        <div className="mb-2">
                          <span className="badge bg-soft-info me-2">
                            {allFormValues.category}
                          </span>
                          <span className={`badge ${allFormValues.published ? 'bg-soft-success' : 'bg-soft-warning'}`}>
                            {allFormValues.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      )}
                      
                      {allFormValues.shortDescription && (
                        <p className="text-muted mb-2 lh-sm">
                          {allFormValues.shortDescription}
                        </p>
                      )}
                    </div>

                    {/* Rich Description Preview */}
                    {allFormValues.description && (
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
                          dangerouslySetInnerHTML={{ __html: allFormValues.description }}
                        />
                      </div>
                    )}

                    {/* Technologies */}
                    {allFormValues.technologies && allFormValues.technologies.length > 0 && (
                      <div className="mb-3">
                        <h6 className="text-muted small text-uppercase mb-2">Technologies</h6>
                        <div className="d-flex gap-1 flex-wrap">
                          {allFormValues.technologies.map((tech: string, index: number) => (
                            <span key={index} className="badge bg-primary">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Links Section */}
                    {allFormValues.blog && (
                      <div className="mb-3">
                        <h6 className="text-muted small text-uppercase mb-2">Blog</h6>
                        <div className="bg-soft-secondary p-2 rounded">
                          <code className="small text-muted">
                            {allFormValues.blog}
                          </code>
                        </div>
                      </div>
                    )}

                    {/* URL Preview */}
                    {(allFormValues.slug || allFormValues.title) && (
                      <div className="mb-3">
                        <h6 className="text-muted small text-uppercase mb-2">URL</h6>
                        <div className="bg-soft-secondary p-2 rounded">
                          <code className="small text-muted">
                            /project/{allFormValues.slug || generateSlug(allFormValues.title)}
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
              {showResetConfirm ? (
                // Reset Confirmation State
                <div className="row justify-content-center align-items-center">
                  <div className="col">
                    <span className="text-light">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Reset form? All unsaved changes will be lost.
                    </span>
                  </div>
                  <div className="col-auto">
                    <div className="d-flex gap-3">
                      <Button 
                        type="button"
                        variant="ghost-light"
                        onClick={cancelResetForm}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={confirmResetForm}
                        disabled={loading}
                      >
                        Yes, Reset
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                // Normal State
                <div className="row justify-content-center justify-content-sm-between">
                  <div className="col">
                    <Button 
                      type="button"
                      variant="ghost-danger" 
                      disabled={loading}
                      onClick={handleResetForm}
                    >
                      Reset Form
                    </Button>
                  </div>
                  <div className="col-auto">
                    <div className="d-flex gap-3">
                      <Button 
                        type="button"
                        variant="ghost-light"
                        onClick={handleDiscard}
                        disabled={loading}
                      >
                        Discard
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        disabled={!canSubmit || loading}
                        onClick={handleSubmit}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Validation Status */}
              {!showResetConfirm && !canSubmit && progress > 0 && (
                <div className="row mt-2">
                  <div className="col">
                    <small className="text-light opacity-75">
                      Complete required fields to save
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