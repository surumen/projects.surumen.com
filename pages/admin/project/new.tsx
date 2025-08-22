import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import ProtectedRoute from '../../../app/components/auth/ProtectedRoute';
import { useCMSStore } from '../../../app/store/cmsStore';

function NewProjectPage() {
  const router = useRouter();
  const { createProject } = useCMSStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // TODO: Re-implement with cleaned up SmartForm
  const handleCreateProject = async () => {
    setError('Form temporarily removed during SmartForm cleanup. Will be re-added soon.');
  };

  return (
    <ProtectedRoute>
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

            <Card>
              <Card.Header>
                <h5 className="mb-0">🚧 Form Temporarily Unavailable</h5>
              </Card.Header>
              <Card.Body>
                <p>The project creation form has been temporarily removed while we clean up the SmartForm architecture.</p>
                <p>It will be re-implemented with the improved form system shortly.</p>
                
                <Link href="/admin" passHref>
                  <button className="btn btn-primary">Return to Dashboard</button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </ProtectedRoute>
  );
}

export default NewProjectPage;