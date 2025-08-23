// app/widgets/tables/cellRenderers/PaymentMethodCell.tsx
// Payment method cell renderer with icon and masked text

import React from 'react';
import Image from 'next/image';
import type { TableCellProps } from '@/types';

const PaymentMethodCell: React.FC<TableCellProps> = ({ value, row, column }) => {
  const config = column.paymentMethodConfig;
  if (!config) {
    return <span className="text-muted">—</span>;
  }

  const imageSrc = row[config.imagePath];
  const text = row[config.textPath];

  if (!imageSrc && !text) {
    return <span className="text-muted">—</span>;
  }

  return (
    <div className="d-flex align-items-center">
      {imageSrc && (
        <Image 
          className="avatar avatar-xss avatar-4x3 me-2" 
          src={imageSrc} 
          alt="Payment Method"
          width={24}
          height={16}
        />
      )}
      {text && (
        <span className="text-dark">{text}</span>
      )}
    </div>
  );
};

export default PaymentMethodCell;
