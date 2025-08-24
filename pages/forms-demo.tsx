import React, { useState } from 'react';
import { 
  Form, 
  Field, 
  FieldGroup, 
  InputGroup, 
  InputGroupPrefix, 
  InputGroupSuffix,
  validationRules,
  asyncValidationRules
} from '@/widgets';
import * as Icons from 'react-bootstrap-icons';

const FormsDemo = () => {
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = (values) => {
    console.log('Form submitted:', values);
    setSubmittedData(values);
  };

  // Simulated async validation for email uniqueness
  const checkEmailUniqueness = async (email: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate some emails being taken
    const takenEmails = ['test@example.com', 'admin@test.com', 'user@demo.com'];
    return !takenEmails.includes(email.toLowerCase());
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold">Modern Forms Demo</h1>
              <p className="lead text-muted">
                Testing Phases 1, 2 & 3: Form, Field, InputGroup, and Advanced Validation
              </p>
            </div>

            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Project Registration Form</h4>
              </div>
              <div className="card-body p-4">
                <Form
                  onSubmit={handleSubmit}
                  initialValues={{
                    title: '',
                    category: 'web'
                  }}
                >
                  {/* Advanced Validation Examples - Phase 3 features */}
                  <h5 className="mb-3">Advanced Validation (Phase 3)</h5>
                  
                  {/* Email with async validation */}
                  <InputGroup 
                    label="Email Address" 
                    className="input-group-merge"
                    helpText="We'll check if this email is available"
                  >
                    <InputGroupPrefix>
                      <Icons.Envelope />
                    </InputGroupPrefix>
                    <Field 
                      name="userEmail" 
                      type="email"
                      required
                      placeholder="your@email.com"
                      validators={[
                        validationRules.required('Email'),
                        validationRules.email()
                      ]}
                      asyncValidators={[
                        asyncValidationRules.customAsync(
                          checkEmailUniqueness,
                          'This email is already taken'
                        )
                      ]}
                      updateOn="blur"
                    />
                  </InputGroup>

                  {/* Password with advanced validation */}
                  <InputGroup label="Password" className="input-group-merge">
                    <InputGroupPrefix>
                      <Icons.Lock />
                    </InputGroupPrefix>
                    <Field 
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      validators={[
                        validationRules.required('Password'),
                        validationRules.minLength(8, 'Password'),
                        validationRules.pattern(
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          'Password must contain at least one lowercase letter, one uppercase letter, and one number'
                        )
                      ]}
                      updateOn="change"
                    />
                  </InputGroup>

                  {/* Confirm password with field dependency */}
                  <InputGroup label="Confirm Password" className="input-group-merge">
                    <InputGroupPrefix>
                      <Icons.ShieldCheck />
                    </InputGroupPrefix>
                    <Field 
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      validators={[
                        validationRules.required('Password confirmation'),
                        validationRules.matches('password', 'password')
                      ]}
                      deps={['password']}
                      updateOn="blur"
                    />
                  </InputGroup>

                  {/* Username with custom validation */}
                  <InputGroup label="Username" className="input-group-flush">
                    <InputGroupPrefix>@</InputGroupPrefix>
                    <Field 
                      name="username"
                      placeholder="username"
                      transform={(value) => value.toLowerCase().replace(/[^a-z0-9]/g, '')}
                      validators={[
                        validationRules.required('Username'),
                        validationRules.minLength(3, 'Username'),
                        validationRules.maxLength(20, 'Username'),
                        validationRules.pattern(
                          /^[a-z0-9]+$/,
                          'Username can only contain lowercase letters and numbers'
                        )
                      ]}
                      updateOn="change"
                    />
                  </InputGroup>

                  {/* Age and phone with numeric validation */}
                  <FieldGroup>
                    <Field 
                      name="age"
                      label="Age"
                      type="number"
                      columns={4}
                      placeholder="25"
                      validators={[
                        validationRules.required('Age'),
                        validationRules.min(18),
                        validationRules.max(120)
                      ]}
                    />
                    <Field 
                      name="phoneNumber"
                      label="Phone Number"
                      type="tel"
                      columns={8}
                      placeholder="+1 (555) 123-4567"
                      validators={[
                        validationRules.phone()
                      ]}
                    />
                  </FieldGroup>

                  {/* URL validation */}
                  <Field 
                    name="personalWebsite"
                    label="Personal Website"
                    type="url"
                    placeholder="https://yoursite.com"
                    validators={[
                      validationRules.url()
                    ]}
                    helpText="Optional: Your personal or portfolio website"
                  />

                  {/* InputGroup examples - Phase 2 features */}
                  <div className="border-top pt-4 mt-4">
                    <h5 className="mb-3">InputGroup Examples (Phase 2)</h5>
                  
                    {/* Basic InputGroup with icon */}
                    <InputGroup label="Company Name" className="input-group-merge">
                      <InputGroupPrefix>
                        <Icons.Building />
                      </InputGroupPrefix>
                      <Field name="company" placeholder="Enter company name" />
                    </InputGroup>

                    {/* Currency input */}
                    <InputGroup label="Salary Range" className="input-group-flush">
                      <InputGroupPrefix>$</InputGroupPrefix>
                      <Field name="minSalary" type="number" placeholder="50000" />
                      <InputGroupSuffix>USD</InputGroupSuffix>
                    </InputGroup>

                    {/* Search input with button */}
                    <InputGroup label="Search Projects">
                      <InputGroupPrefix>
                        <Icons.Search />
                      </InputGroupPrefix>
                      <Field name="searchTerm" placeholder="Search projects..." />
                      <InputGroupSuffix type="button">
                        <button type="button" className="btn btn-primary">Search</button>
                      </InputGroupSuffix>
                    </InputGroup>
                  </div>

                  {/* Standard Fields (Phase 1) */}
                  <div className="border-top pt-4 mt-4">
                    <h5 className="mb-3">Standard Fields (Phase 1)</h5>
                    
                    <Field 
                      name="title" 
                      label="Project Title" 
                      required 
                      className="form-control-lg"
                      helpText="Enter a descriptive title for your project"
                      placeholder="e.g. My Awesome Project"
                    />
                    
                    {/* Fields in same row */}
                    <FieldGroup>
                      <Field 
                        name="firstName" 
                        label="First Name" 
                        columns={6} 
                        required 
                        placeholder="John"
                      />
                      <Field 
                        name="lastName" 
                        label="Last Name" 
                        columns={6} 
                        required 
                        placeholder="Doe"
                      />
                    </FieldGroup>

                    {/* Textarea field */}
                    <Field 
                      name="description" 
                      label="Project Description" 
                      type="textarea" 
                      rows={4}
                      placeholder="Describe your project..."
                      helpText="Provide a detailed description of your project goals and features"
                    />

                    {/* Date and color fields */}
                    <FieldGroup>
                      <Field 
                        name="startDate" 
                        label="Start Date" 
                        type="date" 
                        columns={6}
                      />
                      <Field 
                        name="brandColor" 
                        label="Brand Color" 
                        type="color" 
                        columns={6}
                        defaultValue="#007bff"
                      />
                    </FieldGroup>

                    <Field 
                      name="priority" 
                      label="Project Priority" 
                      type="range" 
                      min="1"
                      max="10"
                      defaultValue="5"
                      helpText="1 = Low priority, 10 = High priority"
                    />
                  </div>

                  {/* Submit button */}
                  <div className="d-grid gap-2 mt-4">
                    <button type="submit" className="btn btn-primary btn-lg">
                      Submit Project
                    </button>
                  </div>
                </Form>

                {/* Display submitted data */}
                {submittedData && (
                  <div className="mt-4">
                    <div className="alert alert-success">
                      <h6 className="alert-heading">Form Submitted Successfully!</h6>
                      <small>Check the browser console for the full data object.</small>
                    </div>
                    <div className="card bg-light">
                      <div className="card-header">
                        <h6 className="mb-0">Submitted Data</h6>
                      </div>
                      <div className="card-body">
                        <pre className="mb-0 small">
                          {JSON.stringify(submittedData, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features demonstration */}
            <div className="row mt-5">
              <div className="col-md-3">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '3rem', height: '3rem' }}>
                      <i className="bi bi-check2-circle"></i>
                    </div>
                    <h5>Simple API</h5>
                    <p className="text-muted small">
                      Just <code>&lt;Field name="email" /&gt;</code> for basic cases
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '3rem', height: '3rem' }}>
                      <i className="bi bi-grid-3x3-gap"></i>
                    </div>
                    <h5>Layout System</h5>
                    <p className="text-muted small">
                      Bootstrap grid with <code>FieldGroup</code> and <code>columns</code>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '3rem', height: '3rem' }}>
                      <i className="bi bi-plus-circle"></i>
                    </div>
                    <h5>Input Groups</h5>
                    <p className="text-muted small">
                      Prefix/suffix addons with <code>InputGroup</code> components
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '3rem', height: '3rem' }}>
                      <i className="bi bi-shield-check"></i>
                    </div>
                    <h5>Advanced Validation</h5>
                    <p className="text-muted small">
                      Sync/async rules, dependencies with <code>validators</code> prop
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Set layout to BlankLayout
FormsDemo.Layout = 'BlankLayout';

export default FormsDemo;
