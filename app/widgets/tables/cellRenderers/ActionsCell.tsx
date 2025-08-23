// app/widgets/tables/cellRenderers/ActionsCell.tsx
// Actions cell renderer with buttons and dropdown

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { TableCellProps } from '@/types';

const ActionsCell: React.FC<TableCellProps> = ({ value, row, column }) => {
  const config = column.actionsConfig;
  if (!config) {
    return <span className="text-muted">—</span>;
  }

  const { buttons = [], dropdown = [] } = config;

  // Replace pattern placeholders in URLs
  const replacePattern = (pattern: string) => {
    return pattern.replace(/\{([^}]+)\}/g, (match, key) => row[key] || '');
  };

  const renderButton = (button: any, index: number) => {
    const className = [
      'btn',
      `btn-${button.variant || 'white'}`,
      `btn-${button.size || 'sm'}`,
      button.className
    ].filter(Boolean).join(' ');

    const content = (
      <>
        {button.icon && <i className={`bi-${button.icon} me-1`}></i>}
        {button.label}
      </>
    );

    if (button.href) {
      const href = replacePattern(button.href);
      return (
        <Link key={index} href={href} className={className}>
          {content}
        </Link>
      );
    }

    return (
      <button
        key={index}
        type="button"
        className={className}
        onClick={() => button.onClick?.(row)}
      >
        {content}
      </button>
    );
  };

  const renderDropdown = () => {
    if (dropdown.length === 0) return null;

    const dropdownId = `dropdown-${row.id || Math.random()}`;

    return (
      <div className="btn-group">
        <button
          type="button"
          className="btn btn-white btn-icon btn-sm dropdown-toggle dropdown-toggle-empty"
          id={dropdownId}
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {config.dropdownIcon && <i className={`bi-${config.dropdownIcon}`}></i>}
        </button>

        <div className="dropdown-menu dropdown-menu-end mt-1" aria-labelledby={dropdownId}>
          {dropdown.map((item, index) => {
            if (item.divider) {
              return <div key={index} className="dropdown-divider"></div>;
            }

            const className = [
              'dropdown-item',
              item.variant === 'danger' ? 'text-danger' : ''
            ].filter(Boolean).join(' ');

            const content = (
              <>
                {item.icon && (
                  item.icon.startsWith('/') || item.icon.startsWith('http') ? (
                    <Image 
                      className="avatar avatar-xss avatar-4x3 me-2" 
                      src={item.icon} 
                      alt=""
                      width={20}
                      height={15}
                    />
                  ) : (
                    <i className={`bi-${item.icon} dropdown-item-icon`}></i>
                  )
                )}
                {item.label}
              </>
            );

            if (item.href) {
              const href = replacePattern(item.href);
              return (
                <Link key={index} href={href} className={className}>
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={index}
                type="button"
                className={className}
                onClick={() => item.onClick?.(row)}
              >
                {content}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="btn-group" role="group">
      {buttons.map(renderButton)}
      {renderDropdown()}
    </div>
  );
};

export default ActionsCell;
