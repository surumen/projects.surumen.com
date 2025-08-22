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
      type: 'textarea',
      required: true,
      rows: 8,
      placeholder: 'Enter detailed HTML description for the project header...',
      helpText: 'Rich HTML content for detailed project page (supports HTML tags)',
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
      console.error('Failed to create project:', error);
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
              <div className="card-header">
                <h4 className="card-header-title">Preview</h4>
              </div>
              <div className="card-body">
                {/* Project Preview */}
                {formValues.title && (
                  <div className="mb-4">
                    <h5 className="mb-2">{formValues.title}</h5>
                    {formValues.shortDescription && (
                      <p className="text-muted small mb-2">{formValues.shortDescription}</p>
                    )}
                    {formValues.technologies && formValues.technologies.length > 0 && (
                      <div className="d-flex gap-1 flex-wrap mb-2">
                        {formValues.technologies.slice(0, 4).map((tech: string, index: number) => (
                          <span key={index} className="badge bg-info">
                            {tech}
                          </span>
                        ))}
                        {formValues.technologies.length > 4 && (
                          <span className="badge bg-secondary">
                            +{formValues.technologies.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                    {formValues.category && (
                      <p className="small mb-2">
                        <strong>Category:</strong> {formValues.category}
                      </p>
                    )}
                    {formValues.year && (
                      <p className="small mb-2">
                        <strong>Year:</strong> {formValues.year}
                      </p>
                    )}
                    <div className="small">
                      <strong>Status:</strong>{' '}
                      <span className={`badge ${formValues.published ? 'bg-success' : 'bg-warning'}`}>
                        {formValues.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                )}

                <hr className="my-4" />

                {/* Preview Only - No Action Buttons */}
                <div className="text-center text-muted">
                  <small>Use the buttons at the bottom of the page to save or discard changes.</small>
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