import { GetServerSideProps } from 'next';
import { Container, Row, Col, Card, Table, Button, Badge, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useCMSStore } from '../../../app/store/cmsStore';
import { BlogPost } from '../../../app/types/cms';

export default function PostsManagementPage() {
  const { posts, loading, error, fetchPosts, deletePost } = useCMSStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && post.published) ||
                         (filterStatus === 'draft' && !post.published);
    
    return matchesSearch && matchesFilter;
  });

  const handleDeletePost = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deletePost(id);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Head>
        <title>Manage Posts | CMS Admin</title>
      </Head>
      
      <Container className="py-4">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Manage Blog Posts</h1>
              <div className="d-flex gap-2">
                <Link href="/admin" passHref>
                  <Button variant="outline-secondary">← Dashboard</Button>
                </Link>
                <Link href="/admin/posts/new" passHref>
                  <Button variant="success">
                    <i className="bi bi-plus"></i> New Post
                  </Button>
                </Link>
              </div>
            </div>

            <Card>
              <Card.Header>
                <Row className="align-items-center">
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                    >
                      <option value="all">All Posts</option>
                      <option value="published">Published</option>
                      <option value="draft">Drafts</option>
                    </Form.Select>
                  </Col>
                  <Col md={3} className="text-end">
                    <small className="text-muted">
                      {filteredPosts.length} of {posts.length} posts
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
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-file-earmark-text" style={{ fontSize: '3rem' }}></i>
                    <h5 className="mt-3">No posts found</h5>
                    <p>
                      {posts.length === 0 
                        ? "You haven't created any posts yet." 
                        : "No posts match your current filters."
                      }
                    </p>
                    {posts.length === 0 && (
                      <Link href="/admin/posts/new" passHref>
                        <Button variant="primary">Create Your First Post</Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <Table responsive hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Title</th>
                        <th>Project</th>
                        <th>Status</th>
                        <th>Tags</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPosts.map((post) => (
                        <tr key={post.id}>
                          <td>
                            <div>
                              <strong>{post.title}</strong>
                              {post.excerpt && (
                                <div className="text-muted small">
                                  {post.excerpt.substring(0, 100)}...
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            {post.projectSlug ? (
                              <Badge bg="info">{post.projectSlug}</Badge>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td>
                            <Badge bg={post.published ? 'success' : 'warning'}>
                              {post.published ? 'Published' : 'Draft'}
                            </Badge>
                          </td>
                          <td>
                            {post.tags.map((tag) => (
                              <Badge key={tag} bg="secondary" className="me-1">
                                {tag}
                              </Badge>
                            ))}
                          </td>
                          <td className="text-muted">
                            {formatDate(post.createdAt)}
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              {post.published && post.projectSlug && (
                                <Link href={`/project/${post.projectSlug}`} passHref>
                                  <Button size="sm" variant="outline-primary">
                                    <i className="bi bi-eye"></i>
                                  </Button>
                                </Link>
                              )}
                              <Link href={`/admin/posts/${post.id}/edit`} passHref>
                                <Button size="sm" variant="outline-secondary">
                                  <i className="bi bi-pencil"></i>
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDeletePost(post.id, post.title)}
                              >
                                <i className="bi bi-trash"></i>
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
