import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  Form, 
  Field, 
  FieldGroup, 
  InputGroup, 
  InputGroupPrefix,
  validationRules,
  useFormContext,
} from '@/widgets/modern-forms';
import { 
  SelectField,
  SwitchField,
  TagsField
} from '@/widgets/modern-forms/advanced';
import { useCMSStore } from '@/store/cmsStore';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import * as Icons from 'react-bootstrap-icons';
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

// Submit button that accesses form validation state
const SubmitButton = () => {
  const { loading } = useCMSStore();
  const { isValid, isSubmitting, values } = useFormContext();
  
  // Check if required fields have values
  const requiredFields = ['title', 'category', 'year', 'shortDescription', 'description', 'technologies'];
  const hasRequiredValues = requiredFields.every(field => {
    const value = values[field];
    if (field === 'technologies') {
      return Array.isArray(value) && value.length > 0;
    }
    return value && value.toString().trim().length > 0;
  });
  
  const isDisabled = !isValid || !hasRequiredValues || isSubmitting || loading;
  
  return (
    <button 
      type="submit" 
      className="btn btn-primary btn-lg"
      disabled={isDisabled}
    >
      {loading || isSubmitting ? 'Creating Project...' : 'Create Project'}
    </button>
  );
};

function NewProjectPage() {
  const router = useRouter();
  const { createProject, loading } = useCMSStore();

  const handleSubmit = async (values: any) => {
    try {
      // Generate slug from title if not provided
      const slug = values.slug || generateSlug(values.title);
      
      const projectData: Partial<Project> = {
        title: values.title,
        slug: slug,
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
      console.error('Project creation failed:', error);
    }
  };

  // Sample data for form fields
  const categoryOptions = [
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
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });

  const techSuggestions = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Python',
    'Node.js', 'Firebase', 'MongoDB', 'PostgreSQL', 'AWS',
    'Docker', 'Kubernetes', 'Machine Learning', 'AI/ML',
    'OpenAI', 'Anthropic', 'TensorFlow', 'Bootstrap', 'Tailwind CSS',
    'Vue.js', 'Angular', 'Express.js', 'Django', 'Laravel',
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'Java',
    'C#', '.NET', 'Go', 'Rust', 'PHP', 'Ruby on Rails'
  ];

  return (
    <ProtectedRoute>
      <Head>
        <title>Add New Project | Admin</title>
      </Head>
      
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

      <div className="row justify-content-start">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary">
              <h4 className="text-bg-primary mb-0">Project Information</h4>
            </div>
            <div className="card-body p-4">
              <Form
                  onSubmit={handleSubmit}
                  initialValues={{
                    title: '',
                    slug: '',
                    category: '',
                    year: currentYear.toString(),
                    shortDescription: '',
                    description: '',
                    technologies: [],
                    demo: '',
                    blog: '',
                    published: false
                  }}
              >
                {/* Basic Project Information */}
                <h5 className="mb-3">Basic Information</h5>

                {/* Project Title */}
                <InputGroup label="Project Name" required className="input-group-merge">
                  <InputGroupPrefix>
                    <Icons.Briefcase />
                  </InputGroupPrefix>
                  <Field
                      name="title"
                      placeholder="Enter project name here"
                      required
                      validators={[
                        validationRules.required('Project name'),
                        validationRules.minLength(3, 'Project name'),
                        validationRules.maxLength(100, 'Project name')
                      ]}
                      helpText="The main title of your project displayed publicly"
                  />
                </InputGroup>

                {/* Category and Year */}
                <FieldGroup>
                  <SelectField
                      name="category"
                      label="Category"
                      columns={6}
                      options={categoryOptions}
                      placeholder="Select category"
                      required
                      validators={[
                        validationRules.required('Category')
                      ]}
                  />

                  <SelectField
                      name="year"
                      label="Year Completed"
                      columns={6}
                      options={yearOptions}
                      placeholder="Select year"
                      required
                      validators={[
                        validationRules.required('Completion year')
                      ]}
                  />
                </FieldGroup>

                {/* Slug and Blog */}
                <FieldGroup>
                  <div className="col-6">
                    <InputGroup label="URL Slug" className="input-group-merge">
                      <InputGroupPrefix>
                        <Icons.Link45deg />
                      </InputGroupPrefix>
                      <Field
                          name="slug"
                          placeholder="generated-from-project-name"
                          validators={[
                            validationRules.pattern(
                                /^[a-z0-9-]*$/,
                                'Slug must contain only lowercase letters, numbers, and hyphens'
                            )
                          ]}
                          helpText="Auto-generated from title if left empty"
                      />
                    </InputGroup>
                  </div>

                  <div className="col-6">
                    <InputGroup label="Blog Post Slug" className="input-group-merge">
                      <InputGroupPrefix>
                        <Icons.Newspaper />
                      </InputGroupPrefix>
                      <Field
                          name="blog"
                          placeholder="blog-post-slug"
                          helpText="Optional blog post slug"
                      />
                    </InputGroup>
                  </div>
                </FieldGroup>

                {/* Demo URL */}
                <InputGroup label="Demo URL" className="input-group-merge">
                  <InputGroupPrefix>
                    <Icons.Globe />
                  </InputGroupPrefix>
                  <Field
                      name="demo"
                      type="url"
                      placeholder="https://demo.example.com"
                      validators={[
                        validationRules.url()
                      ]}
                      helpText="Optional demo or live project URL"
                  />
                </InputGroup>

                {/* Technologies */}
                <div className="border-top pt-4 mt-4">
                  <h5 className="mb-3">Technologies</h5>

                  <TagsField
                      name="technologies"
                      label="Technologies & Tools"
                      suggestions={techSuggestions}
                      maxTags={15}
                      allowCustomOptions={true}
                      placeholder="Type technologies and press Enter..."
                      helpText="Add technologies, frameworks, and tools used in your project"
                      required
                      validators={[
                        validationRules.required('Technologies')
                      ]}
                      tagTransform={(tag) => tag.trim()}
                      tagValidator={(tag) => tag.length >= 2 ? true : 'Technology must be at least 2 characters'}
                  />
                </div>

                {/* Content */}
                <div className="border-top pt-4 mt-4">
                  <h5 className="mb-3">Content</h5>

                  <Field
                      name="shortDescription"
                      label="Short Description"
                      type="textarea"
                      rows={3}
                      placeholder="Brief summary for project listings"
                      required
                      validators={[
                        validationRules.required('Short description'),
                        validationRules.minLength(10, 'Short description'),
                        validationRules.maxLength(200, 'Short description')
                      ]}
                      helpText="Brief summary displayed in project listings (10-200 characters)"
                  />

                  <Field
                      name="description"
                      label="Full Description"
                      type="textarea"
                      rows={8}
                      placeholder="Enter detailed description of your project..."
                      required
                      validators={[
                        validationRules.required('Full description'),
                        validationRules.minLength(50, 'Full description')
                      ]}
                      helpText="Detailed description of your project (minimum 50 characters)"
                  />
                </div>

                {/* Publishing */}
                <div className="border-top pt-4 mt-4">
                  <h5 className="mb-3">Publishing</h5>

                  <SwitchField
                      name="published"
                      label="Publish Project"
                      helpText="Publishing this project will make it visible to the public immediately"
                      inline={true}
                      defaultValue={false}
                  />
                </div>

                {/* Submit button */}
                <div className="d-grid gap-2 mt-4">
                  <SubmitButton />
                  <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => router.push('/admin')}
                      disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default NewProjectPage;
