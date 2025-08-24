import React, { ReactNode } from 'react';

interface BlankLayoutProps {
  children: ReactNode;
}

const BlankLayout: React.FC<BlankLayoutProps> = ({ children }) => {
  // No body classes needed for blank layout
  
  return (
    <main id="content" role="main" className="main">
      <div className="container py-5 py-sm-7">
        <div className="mx-auto" style={{ maxWidth: '30rem' }}>
          {children}
        </div>
      </div>
    </main>
  );
};

export default BlankLayout;
