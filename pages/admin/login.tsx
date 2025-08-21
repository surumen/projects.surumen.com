import { GetServerSideProps } from 'next';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth, actionCodeSettings, isAdminEmail } from '../../lib/firebase/config';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/firebase/AuthContext';
import { DynamicForm } from '@/widgets';
import type { FieldConfig } from '@/types';

export default function AdminLogin() {
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

  // Define form fields for DynamicForm
  const loginFields: FieldConfig[] = [
    {
      name: 'email',
      label: 'Email',
      type: 'input',
      inputType: 'email',
      required: true,
      validate: (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && isAdminEmail(email);
      },
      initialValue: ''
    }
  ];

  const handleFormSubmit = async (values: Record<string, any>) => {
    const { email } = values;
    setLoading(true);
    setMessage('');

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
      
      <div className="content container">
        <div className="row justify-content-lg-center pt-lg-5 pt-xl-10">
          <div className="col-lg-9">
            <div className="card shadow-none">
              <div className="card-body">
                <div className="text-center mb-4">
                  <h2>Admin Login</h2>
                  <p className="text-muted">Firebase Magic Link Authentication</p>
                </div>

                {message && (
                  <Alert variant={messageType} className="small mb-3">
                    {message}
                  </Alert>
                )}

                <DynamicForm
                  fields={loginFields}
                  onSubmit={handleFormSubmit}
                  submitLabel={loading ? 'Sending Magic Link...' : 'Send Magic Link'}
                  formClassName="mb-3"
                />

                <div className="text-center mt-3">
                  <small className="text-muted">
                    Only authorized administrators can access the CMS
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};
