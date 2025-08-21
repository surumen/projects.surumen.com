import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import Head from 'next/head';
import { useAuth } from '../../lib/firebase/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { user, loading, isAdmin, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [user, loading, isAdmin, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <>
      <Head>
        <title>CMS Admin Dashboard | Moses Surumen</title>
      </Head>
      
      <Container className="py-5">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="mb-1">CMS Admin Dashboard</h1>
                <p className="text-muted mb-0">Welcome, {user.email}</p>
              </div>
              <div>
                <Link href="/" passHref>
                  <Button variant="outline-secondary" className="me-2">← Back to Site</Button>
                </Link>
                <Button variant="outline-danger" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
            
            <div className="alert alert-success mb-4">
              <strong>🔥 Firebase Authentication Active!</strong> Secure magic link authentication with session management.
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title className="d-flex align-items-center">
                      <i className="bi bi-file-earmark-text me-2"></i>
                      Blog Posts
                    </Card.Title>
                    <Card.Text>Manage your blog content and project documentation</Card.Text>
                    <Link href="/admin/posts" passHref>
                      <Button variant="primary">Manage Posts</Button>
                    </Link>
                  </Card.Body>
                </Card>
              </div>
              
              <div className="col-md-6 mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title className="d-flex align-items-center">
                      <i className="bi bi-plus-circle me-2"></i>
                      Create New Post
                    </Card.Title>
                    <Card.Text>Write a new blog post with rich content editor</Card.Text>
                    <Link href="/admin/posts/new" passHref>
                      <Button variant="success">New Post</Button>
                    </Link>
                  </Card.Body>
                </Card>
              </div>
              
              <div className="col-md-6 mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title className="d-flex align-items-center">
                      <i className="bi bi-gear me-2"></i>
                      Settings
                    </Card.Title>
                    <Card.Text>Configure CMS settings and preferences</Card.Text>
                    <Button variant="outline-primary" disabled>
                      Coming Soon
                    </Button>
                  </Card.Body>
                </Card>
              </div>
              
              <div className="col-md-6 mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title className="d-flex align-items-center">
                      <i className="bi bi-bar-chart me-2"></i>
                      Analytics
                    </Card.Title>
                    <Card.Text>View content performance and engagement metrics</Card.Text>
                    <Button variant="outline-primary" disabled>
                      Coming Soon
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
