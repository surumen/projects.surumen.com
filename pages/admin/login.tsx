import { GetServerSideProps } from 'next';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth, actionCodeSettings, isAdminEmail } from '../../lib/firebase/config';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/firebase/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'danger'>('success');
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user && isAdminEmail(user.email || '')) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  // Handle magic link authentication
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      setLoading(true);
      setMessage('Processing magic link...');
      setMessageType('success');
      
      let emailForSignIn = window.localStorage.getItem('emailForSignIn');
      
      if (!emailForSignIn) {
        const urlParams = new URLSearchParams(window.location.search);
        emailForSignIn = urlParams.get('email');
      }
      
      if (!emailForSignIn) {
        emailForSignIn = window.prompt('Please provide your email for confirmation');
      }
      
      if (emailForSignIn && isAdminEmail(emailForSignIn)) {
        signInWithEmailLink(auth, emailForSignIn, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            setMessage('Sign-in successful! Redirecting to admin dashboard...');
            setMessageType('success');
            
            setTimeout(() => {
              router.push('/admin');
            }, 1500);
          })
          .catch((error) => {
            setMessage('Error signing in: ' + error.message);
            setMessageType('danger');
            setLoading(false);
          });
      } else {
        setMessage('Access denied. Email not authorized or not provided.');
        setMessageType('danger');
        setLoading(false);
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!isAdminEmail(email)) {
      setMessage('Access denied. This email is not authorized to access the admin panel.');
      setMessageType('danger');
      setLoading(false);
      return;
    }

    try {
      const actionCodeSettingsWithEmail = {
        ...actionCodeSettings,
        url: `${actionCodeSettings.url}?email=${encodeURIComponent(email)}`
      };
      
      await sendSignInLinkToEmail(auth, email, actionCodeSettingsWithEmail);
      window.localStorage.setItem('emailForSignIn', email);
      setMessage('Magic link sent! Check your email to sign in.');
      setMessageType('success');
    } catch (error: any) {
      setMessage('Error sending magic link: ' + error.message);
      setMessageType('danger');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Login | Moses Surumen</title>
      </Head>
      
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2>Admin Login</h2>
                  <p className="text-muted">Firebase Magic Link Authentication</p>
                </div>

                <Alert variant="info" className="small">
                  <strong>Secure Login:</strong> Enter your admin email to receive a magic link. 
                  Click the link in your email to sign in securely.
                </Alert>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Admin Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your admin email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <Form.Text className="text-muted">
                      Must be configured in ADMIN_EMAILS environment variable
                    </Form.Text>
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? 'Sending Magic Link...' : 'Send Magic Link'}
                  </Button>
                </Form>

                {message && (
                  <Alert variant={messageType} className="mt-3 small">
                    {message}
                  </Alert>
                )}

                <div className="text-center mt-3">
                  <small className="text-muted">
                    Only authorized administrators can access the CMS
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};
