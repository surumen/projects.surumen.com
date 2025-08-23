// app/widgets/tables/cellRenderers/AvatarCell.tsx
// Avatar cell renderer with name and subtitle

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { TableCellProps } from '@/types';

const AvatarCell: React.FC<TableCellProps> = ({ value, row, column }) => {
  const config = column.avatarConfig;
  if (!config) {
    return <span className="text-muted">—</span>;
  }

  // Extract values from row data
  const name = config.namePath ? row[config.namePath] : value;
  const subtitle = config.subtitlePath ? row[config.subtitlePath] : '';
  const imageSrc = config.imagePath ? row[config.imagePath] : null;

  if (!name) {
    return <span className="text-muted">—</span>;
  }

  // Generate initials if no image
  const initials = name
    .split(' ')
    .map((part: string) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const avatarSize = config.size || 'md';
  const avatarShape = config.shape || 'circle';
  
  const avatarClasses = [
    'avatar',
    avatarSize !== 'md' ? `avatar-${avatarSize}` : '',
    avatarShape === 'circle' ? 'avatar-circle' : '',
    !imageSrc && config.showInitials !== false ? 'avatar-soft-primary' : ''
  ].filter(Boolean).join(' ');

  const renderAvatar = () => (
    <div className={avatarClasses}>
      {imageSrc ? (
        <Image 
          className="avatar-img" 
          src={imageSrc} 
          alt={name}
          width={40}
          height={40}
        />
      ) : (
        config.showInitials !== false && (
          <span className="avatar-initials">{initials}</span>
        )
      )}
    </div>
  );

  const renderText = () => (
    <div className="ms-3">
      <span className="d-block h5 text-inherit mb-0">
        {name}
      </span>
      {subtitle && (
        <span className="d-block fs-5 text-body">
          {subtitle}
        </span>
      )}
    </div>
  );

  // If it's a link pattern, wrap in Link
  if (column.linkConfig?.linkPattern) {
    const href = column.linkConfig.linkPattern.replace(
      /\{([^}]+)\}/g,
      (match, key) => row[key] || ''
    );

    return (
      <Link href={href} className="d-flex align-items-center text-decoration-none">
        {renderAvatar()}
        {renderText()}
      </Link>
    );
  }

  // Otherwise, just render as div
  return (
    <div className="d-flex align-items-center">
      {renderAvatar()}
      {renderText()}
    </div>
  );
};

export default AvatarCell;
