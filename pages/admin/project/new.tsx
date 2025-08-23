import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Button, Breadcrumb } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { SmartForm } from '@/widgets';
import { validationRules } from '@/widgets/forms';
import { useCMSStore } from '@/store/cmsStore';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import type { FieldConfig, FormConfig } from '@/types/forms/advanced';
import type { Project } from '@/types';

function NewProjectPage() {
  const router = useRouter();
  const { createProject, loading } = useCMSStore();
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isValid, setIsValid] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formKey, setFormKey] = useState(0); // Key to force form re-render
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Form field configuration
  const projectFields: FieldConfig[] = [
    {
      name: 'title',
      label: 'Project Name',
      type: 'input',
      inputType: 'text',
      required: true,
      placeholder: 'Tournament Brackets AI Assistant, Fantasy Manager, etc.',
      helpText: 'The main title of your project',
      validate: [
        validationRules.required('Project name'),
        validationRules.minLength(3),
        validationRules.maxLength(100)
      ]
    },
    {
      name: 'slug',
      label: 'URL Slug',
      type: 'input',
      inputType: 'text',
      required: false,
      placeholder: 'auto-generated-from-title',
      helpText: 'URL-friendly identifier (auto-generated from title if left empty)',
      validate: [
        validationRules.pattern(
          /^[a-z0-9-]*$/,
          'Slug must contain only lowercase letters, numbers, and hyphens'
        )
      ]
    },
    {
      name: 'shortDescription',
      label: 'Short Description',
      type: 'textarea',
      required: true,
      rows: 3,
      placeholder: 'A brief summary for dashboard and list views...',
      helpText: 'Brief description shown in project listings',
      validate: [
        validationRules.required('Short description'),
        validationRules.minLength(10),
        validationRules.maxLength(200)
      ]
    },
    {
      name: 'description',
      label: 'Full Description',
      type: 'richtext',
      required: true,
      placeholder: 'Enter detailed description for the project...',
      helpText: 'Rich HTML content for detailed project page (supports formatting)',
      toolbar: 'full',
      height: 300,
      validate: [
        validationRules.required('Full description'),
        validationRules.minLength(50)
      ]
    },
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
    },
    {
      name: 'year',
      label: 'Completion Year',
      type: 'select',
      required: true,
      placeholder: 'Select completion year',
      initialValue: new Date().getFullYear(),
      helpText: 'Year the project was completed',
      options: Array.from(
        { length: new Date().getFullYear() - 2015 + 1 }, 
        (_, i) => {
          const year = new Date().getFullYear() - i;
          return { value: year, label: year.toString() };
        }
      ),
      validate: [
        validationRules.required('Completion year')
      ]
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      placeholder: 'Select project category',
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
      name: 'demo',
      label: 'Demo URL or Component',
      type: 'input',
      inputType: 'text',
      placeholder: 'https://demo.example.com or component-name',
      helpText: 'Optional: URL to live demo or custom component name'
    },
    {
      name: 'blog',
      label: 'Blog URL/Slug',
      type: 'input',
      inputType: 'text',
      placeholder: 'blog-post-slug',
      helpText: 'Optional: Link to related blog post or documentation'
    },
    {
      name: 'published',
      label: 'Published',
      type: 'switch',
      initialValue: false,
      helpText: 'Make this project visible to the public'
    }
  ];

  // Auto-generate slug from title
  const handleFieldChange = (name: string, value: any, allValues: Record<string, any>) => {
    setFormValues(allValues);
    setLastUpdated(new Date());
    
    // Auto-generate slug from title if slug is empty
    if (name === 'title' && value) {
      const generatedSlug = generateSlug(value);
      
      // Update slug field if it's empty
      if (!allValues.slug || allValues.slug.trim() === '') {
        setFormValues(prev => ({ ...prev, slug: generatedSlug }));
      }
    }
  };

  // Check if form has minimum required fields
  const isFormValid = useMemo(() => {
    const requiredFields = ['title', 'shortDescription', 'description', 'technologies', 'year', 'category'];
    return requiredFields.every(field => {
      const value = formValues[field];
      if (field === 'technologies') {
        return Array.isArray(value) && value.length > 0;
      }
      if (field === 'year') {
        return value && (typeof value === 'number' || !isNaN(Number(value)));
      }
      return value && value.toString().trim().length > 0;
    });
  }, [formValues]);

  // Handle validation changes
  const handleValidationChange = (valid: boolean, errors: Record<string, string>) => {
    setIsValid(valid);
    setFormErrors(errors);
  };

  // Reset form function
  const handleResetForm = () => {
    setShowResetConfirm(true);
  };

  const confirmResetForm = () => {
    setFormValues({});
    setIsValid(false);
    setFormErrors({});
    setLastUpdated(null);
    setFormKey(prev => prev + 1); // Force form re-render with initial values
    setShowResetConfirm(false);
  };

  const cancelResetForm = () => {
    setShowResetConfirm(false);
  };

  // Use ONLY the basic form validity check for enabling submit
  const canSubmit = isFormValid;
    const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Form submission
  const handleSubmit = async (values: Record<string, any>) => {
    try {
      // Auto-generate slug if empty
      const finalSlug = values.slug && values.slug.trim() !== '' 
        ? values.slug 
        : generateSlug(values.title);

      const projectData: Partial<Project> = {
        title: values.title,
        slug: finalSlug,
        shortDescription: values.shortDescription,
        description: values.description,
        technologies: values.technologies || [],
        year: parseInt(values.year),
        category: values.category,
        demo: values.demo || undefined,
        blog: values.blog || undefined,
        published: values.published || false
      };

      const newProject = await createProject(projectData);
      
      if (newProject) {
        router.push('/admin');
      }
    } catch (error) {
      // Error handling can be improved with user-friendly notifications
    }
  };

  // Form configuration
  const formConfig: FormConfig = {
    fields: projectFields,
    onSubmit: handleSubmit,
    validation: {
      mode: 'onChange',
      revalidateMode: 'onChange'
    }
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Add New Project | Admin</title>
      </Head>
      
      <Container fluid className="py-4">
        {/* Page Header */}
        <div className="page-header mb-4">
          <div className="row align-items-center">
            <div className="col-sm mb-2 mb-sm-0">
              <Breadcrumb className="breadcrumb-no-gutter">
                <Breadcrumb.Item href="/admin">
                  Projects
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Add Project</Breadcrumb.Item>
              </Breadcrumb>

              <h1 className="page-header-title">Add Project</h1>
            </div>
          </div>
        </div>

        <Row>
          {/* Main Form Column */}
          <Col lg={8} className="mb-3 mb-lg-0">
            <div className="card mb-3 mb-lg-5">
              <div className="card-header">
                <h4 className="card-header-title">Project Information</h4>
              </div>
              <div className="card-body">
                <SmartForm
                  key={formKey} // Force re-render when form is reset
                  config={formConfig}
                  onFieldChange={handleFieldChange}
                  onValidationChange={handleValidationChange}
                  renderSubmitButton={() => null} // We'll handle submit in the sidebar
                />
              </div>
            </div>
          </Col>

          {/* Sidebar Column */}
          <Col lg={4}>
            <div className="card mb-3 mb-lg-5">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-header-title mb-0">Live Preview</h4>
                <div className="d-flex align-items-center gap-2">
                  {lastUpdated && (
                    <small className="text-muted">
                      <i className="bi bi-clock-history me-1"></i>
                      {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </small>
                  )}
                  {formValues.title && (
                    <span className="badge bg-soft-primary">
                      {Object.keys(formValues).filter(key => formValues[key] && formValues[key] !== '').length} / {projectFields.length}
                    </span>
                  )}
                </div>
              </div>
              <div className="card-body">
                {/* Project Preview */}
                {formValues.title ? (
                  <div className="project-preview">
                    {/* Header Section */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="mb-0 fw-bold">{formValues.title}</h5>
                        {formValues.year && (
                          <span className="badge bg-soft-secondary fs-6">
                            {formValues.year}
                          </span>
                        )}
                      </div>
                      
                      {formValues.category && (
                        <div className="mb-2">
                          <span className="badge bg-soft-info me-2">
                            {formValues.category}
                          </span>
                          <span className={`badge ${formValues.published ? 'bg-soft-success' : 'bg-soft-warning'}`}>
                            {formValues.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      )}
                      
                      {formValues.shortDescription && (
                        <p className="text-muted mb-2 lh-sm">
                          {formValues.shortDescription}
                        </p>
                      )}
                    </div>

                    {/* Rich Description Preview */}
                    {formValues.description && (
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
                          dangerouslySetInnerHTML={{ __html: formValues.description }}
                        />
                      </div>
                    )}

                    {/* Technologies */}
                    {formValues.technologies && formValues.technologies.length > 0 && (
                      <div className="mb-3">
                        <h6 className="text-muted small text-uppercase mb-2">Technologies</h6>
                        <div className="d-flex gap-1 flex-wrap">
                          {formValues.technologies.map((tech: string, index: number) => (
                            <span key={index} className="badge bg-primary">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Links Section */}
                    {(formValues.demo || formValues.blog) && (
                      <div className="mb-3">
                        <h6 className="text-muted small text-uppercase mb-2">Links</h6>
                        <div className="d-flex flex-column gap-1">
                          {formValues.demo && (
                            <div className="d-flex align-items-center">
                              <i className="bi bi-play-circle me-2 text-primary"></i>
                              <small className="text-truncate">{formValues.demo}</small>
                            </div>
                          )}
                          {formValues.blog && (
                            <div className="d-flex align-items-center">
                              <i className="bi bi-journal-text me-2 text-info"></i>
                              <small className="text-truncate">{formValues.blog}</small>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* URL Preview */}
                    {(formValues.slug || formValues.title) && (
                      <div className="mb-3">
                        <h6 className="text-muted small text-uppercase mb-2">URL</h6>
                        <div className="bg-soft-secondary p-2 rounded">
                          <code className="small text-muted">
                            /project/{formValues.slug || generateSlug(formValues.title)}
                          </code>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="bi bi-eye-slash fs-1 text-muted mb-3 d-block"></i>
                    <p className="text-muted mb-0">
                      Start filling out the form to see a live preview
                    </p>
                    <small className="text-muted">
                      Preview will update as you type
                    </small>
                  </div>
                )}

                <hr className="my-4" />

                {/* Completion Status */}
                <div className="progress-completion">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 small text-uppercase text-muted">Completion</h6>
                    <span className="small text-muted">
                      {Math.round((Object.keys(formValues).filter(key => formValues[key] && formValues[key] !== '').length / projectFields.length) * 100)}%
                    </span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar bg-primary"
                      style={{ 
                        width: `${Math.round((Object.keys(formValues).filter(key => formValues[key] && formValues[key] !== '').length / projectFields.length) * 100)}%`,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                  <div className="mt-2">
                    <small className="text-muted">
                      {canSubmit ? (
                        <><i className="bi bi-check-circle text-success me-1"></i>Ready to save</>
                      ) : (
                        <><i className="bi bi-exclamation-circle text-warning me-1"></i>Complete required fields</>
                      )}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Fixed Bottom Actions */}
        <div className="position-fixed start-50 bottom-0 translate-middle-x w-100" style={{ zIndex: 99, marginBottom: '1rem', maxWidth: '40rem' }}>
          <div className="card card-sm bg-dark border-dark mx-2">
            <div className="card-body">
              {showResetConfirm ? (
                // Reset Confirmation State
                <Row className="justify-content-center align-items-center">
                  <Col>
                    <span className="text-light">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Reset form? All unsaved changes will be lost.
                    </span>
                  </Col>
                  <Col xs="auto">
                    <div className="d-flex gap-3">
                      <Button 
                        variant="ghost-light"
                        onClick={cancelResetForm}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="danger"
                        onClick={confirmResetForm}
                        disabled={loading}
                      >
                        Yes, Reset
                      </Button>
                    </div>
                  </Col>
                </Row>
              ) : (
                // Normal State
                <Row className="justify-content-center justify-content-sm-between">
                  <Col>
                    <Button 
                      variant="ghost-danger" 
                      disabled={loading}
                      onClick={handleResetForm}
                    >
                      Reset Form
                    </Button>
                  </Col>
                  <Col xs="auto">
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
                        disabled={!canSubmit || loading}
                        onClick={() => {
                          const form = document.querySelector('form');
                          if (form) {
                            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                          }
                        }}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </Col>
                </Row>
              )}
            </div>
          </div>
        </div>
      </Container>
    </ProtectedRoute>
  );
}

export default NewProjectPage;