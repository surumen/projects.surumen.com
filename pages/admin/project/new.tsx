import { GetServerSideProps } from 'next';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { DynamicForm } from '@/widgets';
import type { FieldConfig } from '@/types';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Project categories options
  const categoryOptions = [
    { value: 'AI/ML', label: 'AI/ML' },
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Mobile App', label: 'Mobile App' },
    { value: 'Data Visualization', label: 'Data Visualization' },
    { value: 'Game Development', label: 'Game Development' },
    { value: 'DevOps/Infrastructure', label: 'DevOps/Infrastructure' },
    { value: 'Other', label: 'Other' }
  ];

  // Common technologies for quick selection
  const commonTechnologies = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Python',
    'Firebase', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes',
    'Machine Learning', 'TensorFlow', 'PyTorch', 'D3.js', 'Chart.js',
    'Bootstrap', 'Tailwind CSS', 'SCSS', 'Redux', 'Zustand', 'GraphQL',
    'Express.js', 'FastAPI', 'Django', 'Flask', 'React Native', 'Flutter'
  ];

  // Define form fields for project creation
  const projectFields: FieldConfig[] = [
    {
      name: 'title',
      label: 'Project Title',
      type: 'input',
      inputType: 'text',
      required: true,
      validate: (val: string) => val.length >= 3,
      initialValue: ''
    },
    {
      name: 'slug',
      label: 'Project Slug',
      type: 'input',
      inputType: 'text',
      required: true,
      validate: (val: string) => /^[a-z0-9-]+$/.test(val) && val.length >= 3,
      initialValue: ''
    },
    {
      name: 'shortDescription',
      label: 'Short Description',
      type: 'input',
      inputType: 'text',
      required: true,
      validate: (val: string) => val.length >= 10 && val.length <= 200,
      initialValue: ''
    },
    {
      name: 'category',
      label: 'Project Category',
      type: 'select',
      options: categoryOptions,
      required: true,
      initialValue: ''
    },
    {
      name: 'year',
      label: 'Completion Year',
      type: 'input',
      inputType: 'number',
      required: true,
      validate: (val: number) => val >= 2020 && val <= new Date().getFullYear() + 1,
      initialValue: new Date().getFullYear()
    },
    {
      name: 'technologies',
      label: 'Technologies Used',
      type: 'input',
      inputType: 'text',
      required: true,
      validate: (val: string) => val.trim().length > 0,
      initialValue: ''
    },
    {
      name: 'demo',
      label: 'Demo Component Name',
      type: 'input',
      inputType: 'text',
      required: false,
      initialValue: ''
    }
  ];

  const handleFieldChange = (values: Record<string, any>) => {
    // Auto-generate slug when title changes
    if (values.title && (!values.slug || values.slug === generateSlug(values.title))) {
      // Find and update the slug field
      const titleInput = document.querySelector('input[name="title"]') as HTMLInputElement;
      const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;
      
      if (titleInput && slugInput && titleInput.value) {
        slugInput.value = generateSlug(titleInput.value);
        slugInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  const handleFormSubmit = async (values: Record<string, any>) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Parse technologies string into array
      const technologiesArray = values.technologies
        .split(',')
        .map((tech: string) => tech.trim())
        .filter((tech: string) => tech.length > 0);

      // Create project object
      const projectData = {
        slug: values.slug,
        title: values.title,
        shortDescription: values.shortDescription,
        description: `
          <p><strong>${values.title}</strong> is ${values.shortDescription.toLowerCase()}</p>
          <p>This project demonstrates expertise in ${technologiesArray.slice(0, 3).join(', ')} and showcases modern development practices.</p>
          <ul>
            <li><strong>Technology Stack:</strong> ${technologiesArray.join(', ')}</li>
            <li><strong>Category:</strong> ${values.category}</li>
            <li><strong>Year:</strong> ${values.year}</li>
          </ul>
        `,
        technologies: technologiesArray,
        year: parseInt(values.year),
        category: values.category,
        demo: values.demo || values.slug, // Use slug as demo component name if not specified
        cms: {
          blogEnabled: true,
          hasContent: false,
          contentType: 'none' as const
        }
      };

      // For now, just show success message and the generated data
      // In a real implementation, you'd send this to an API endpoint
      console.log('Project data to be saved:', projectData);
      
      setSuccess(`Project "${values.title}" configuration generated successfully! Check the console for the data structure.`);
      
      // You could navigate back or clear the form here
      // router.push('/admin');
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create New Project | CMS Admin</title>
      </Head>
      
      <div className="content container py-4">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Create New Project</h1>
              <Link href="/admin" passHref>
                <button className="btn btn-outline-secondary">← Back to Dashboard</button>
              </Link>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div className="row">
              <div className="col-lg-8">
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Project Metadata</h5>
                  </Card.Header>
                  <Card.Body>
                    <DynamicForm
                      fields={projectFields}
                      onSubmit={handleFormSubmit}
                      onFieldChange={handleFieldChange}
                      submitLabel={loading ? 'Creating Project...' : 'Create Project'}
                      formClassName=""
                    />
                  </Card.Body>
                </Card>
              </div>
              
              <div className="col-lg-4">
                <Card className="mb-4">
                  <Card.Header>
                    <h6 className="mb-0">💡 Tips</h6>
                  </Card.Header>
                  <Card.Body className="small">
                    <ul className="mb-0">
                      <li><strong>Slug:</strong> URL-friendly identifier (auto-generated from title)</li>
                      <li><strong>Short Description:</strong> Used in project listings and meta tags</li>
                      <li><strong>Technologies:</strong> Comma-separated list (e.g., React, TypeScript, Firebase)</li>
                      <li><strong>Demo Component:</strong> Name of the demo component file (optional)</li>
                    </ul>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Header>
                    <h6 className="mb-0">Common Technologies</h6>
                  </Card.Header>
                  <Card.Body className="small">
                    <div className="d-flex flex-wrap gap-1">
                      {commonTechnologies.map(tech => (
                        <span 
                          key={tech}
                          className="badge bg-light text-dark border cursor-pointer"
                          style={{ fontSize: '0.75rem' }}
                          onClick={() => {
                            const techInput = document.querySelector('input[name="technologies"]') as HTMLInputElement;
                            if (techInput) {
                              const current = techInput.value;
                              const newValue = current ? `${current}, ${tech}` : tech;
                              techInput.value = newValue;
                              techInput.dispatchEvent(new Event('input', { bubbles: true }));
                            }
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <small className="text-muted mt-2 d-block">
                      Click to add to technologies field
                    </small>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Check if logged in using our simple cookie system
  const adminSession = context.req.cookies['admin-session'];
  const adminEmail = context.req.cookies['admin-email'];
  
  if (!adminSession || !adminEmail) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  try {
    const decodedEmail = Buffer.from(adminSession, 'base64').toString();
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim());

    if (decodedEmail !== adminEmail || !adminEmails.includes(adminEmail)) {
      return {
        redirect: {
          destination: '/admin/login',
          permanent: false,
        },
      };
    }
  } catch (error) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
  
  return {
    props: {},
  };
};
