import { GetServerSideProps } from 'next';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useCMSStore } from '../../../app/store/cmsStore';
import { getAllProjects } from '../../../lib/getProjectBySlug';
import { Project } from '../../../app/types';

// Dynamic import to avoid SSR issues
const RichEditor = dynamic(() => import('../../../app/components/admin/RichEditor'), { ssr: false });

interface NewPostPageProps {
  projects: Project[];
}

export default function NewPostPage({ projects }: NewPostPageProps) {
  const router = useRouter();
  const { createPost } = useCMSStore();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    projectSlug: '',
    tags: '',
    published: false,
    seoTitle: '',
    seoDescription: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      seoTitle: title,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const postData = {
        ...formData,
        tags: tagsArray,
        author: 'Moses Surumen',
        excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
      };

      const newPost = await createPost(postData);
      
      if (newPost) {
        router.push('/admin/posts');
      } else {
        setError('Failed to create post. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create New Post | CMS Admin</title>
      </Head>
      
      <Container className="py-4">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Create New Blog Post</h1>
              <Link href="/admin/posts" passHref>
                <Button variant="outline-secondary">← Back to Posts</Button>
              </Link>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Label>Title *</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          required
                          placeholder="Enter post title"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Slug *</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          required
                          placeholder="post-url-slug"
                        />
                        <Form.Text className="text-muted">
                          This will be the URL: /project/{formData.slug}
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Content *</Form.Label>
                        <RichEditor
                          content={formData.content}
                          onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                          placeholder="Write your blog post content here..."
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Excerpt</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={formData.excerpt}
                          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                          placeholder="Brief description for search engines and previews"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Project Association</Form.Label>
                        <Form.Select
                          value={formData.projectSlug}
                          onChange={(e) => setFormData(prev => ({ ...prev, projectSlug: e.target.value }))}
                        >
                          <option value="">Select a project (optional)</option>
                          {projects.map(project => (
                            <option key={project.slug} value={project.slug}>
                              {project.title}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Tags</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.tags}
                          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                          placeholder="AI, React, JavaScript"
                        />
                        <Form.Text className="text-muted">
                          Comma-separated tags
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Publish immediately"
                          checked={formData.published}
                          onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                        />
                      </Form.Group>

                      <hr />

                      <h6>SEO Settings</h6>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>SEO Title</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.seoTitle}
                          onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                          placeholder="Custom title for search engines"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>SEO Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={formData.seoDescription}
                          onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                          placeholder="Meta description for search engines"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end gap-2">
                    <Link href="/admin/posts" passHref>
                      <Button variant="secondary">Cancel</Button>
                    </Link>
                    <Button
                      type="submit"
                      variant={formData.published ? "success" : "primary"}
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : (formData.published ? 'Create & Publish' : 'Save Draft')}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<NewPostPageProps> = async (context) => {
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
  
  const projects = getAllProjects();
  
  return {
    props: {
      projects,
    },
  };
};
