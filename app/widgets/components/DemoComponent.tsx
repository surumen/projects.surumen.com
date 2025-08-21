import React from 'react';

interface DemoComponentProps {
  componentName?: string;
  [key: string]: any;
}

const DemoComponent: React.FC<DemoComponentProps> = ({ componentName = 'Demo', ...props }) => {
  return (
    <div className="border rounded p-3 my-3 bg-light">
      <div className="d-flex align-items-center mb-2">
        <i className="bi bi-gear-fill text-primary me-2"></i>
        <strong>Custom Component: {componentName}</strong>
      </div>
      <div className="small text-muted">
        This is a placeholder for the <code>&lt;{componentName} /&gt;</code> component.
      </div>
      {Object.keys(props).length > 0 && (
        <div className="mt-2">
          <small className="text-muted">Props:</small>
          <div className="small">
            {Object.entries(props).map(([key, value]) => (
              <div key={key}>
                <code>{key}:</code> {String(value)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoComponent;
