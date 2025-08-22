import { Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth, actionCodeSettings, isAdminEmail } from '../../lib/firebase/config';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/firebase/AuthContext';
import { SmartForm, LogoIcon } from '@/widgets';
import type { FieldConfig } from '@/types/forms/advanced';
import BlankLayout from '../../layouts/BlankLayout';

function AdminLogin() {
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

  // Handle magic link authentication when user returns from email
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      setLoading(true);
      setMessage('Processing magic link...');
      setMessageType('success');
      
      // Get email from localStorage or URL params
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
            
            // Clean up URL and redirect
            window.history.replaceState({}, document.title, '/admin/login');
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

  // Form fields for email input
  const loginFields: FieldConfig[] = [
    {
      name: 'email',
      label: 'Your email',
      type: 'input',
      inputType: 'email',
      required: true,
      validate: [
        {
          test: (email: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email) && isAdminEmail(email);
          },
          message: 'Please enter a valid admin email address'
        }
      ],
      initialValue: '',
      styling: {
        size: 'lg',
        customClasses: {
          control: 'form-control-lg'
        }
      },
      placeholder: 'Enter your email address'
    }
  ];

  const handleFormSubmit = async (values: Record<string, any>) => {
    const { email } = values;
    setLoading(true);
    setMessage('');

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
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
      <main id="content" role="main" className="main">
        <div className="container py-5 py-sm-7">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Login | Moses Surumen</title>
      </Head>
      
      <main id="content" role="main" className="main">
        <div className="container py-5 py-sm-7">
          <div className="d-flex justify-content-center mb-5">
            <div style={{ width: '8rem', height: '8rem' }}>
              <LogoIcon primary="#377dff" dark="#132144" />
            </div>
          </div>
          
          <div className="mx-auto" style={{ maxWidth: '30rem' }}>
            <div className="card card-lg mb-5">
              <div className="card-body">
                <div className="text-center mb-5">
                  <h1 className="display-5">Admin Login</h1>
                </div>

                {message && (
                  <Alert variant={messageType} className="mb-4">
                    {message}
                  </Alert>
                )}

                <SmartForm
                  config={{
                    fields: loginFields,
                    onSubmit: handleFormSubmit
                  }}
                  renderSubmitButton={({ isValid, submit }) => (
                    <div className="d-grid gap-2">
                      <button 
                        type="button"
                        onClick={submit}
                        className="btn btn-primary btn-lg"
                        disabled={loading || !isValid}
                      >
                        {loading ? 'Sending Magic Link...' : 'Send Magic Link'}
                      </button>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

AdminLogin.Layout = BlankLayout;
export default AdminLogin;