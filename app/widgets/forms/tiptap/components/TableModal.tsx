import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Table } from 'react-bootstrap';
import type { Editor } from '@tiptap/core';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor;
}

const TableModal: React.FC<TableModalProps> = ({ isOpen, onClose, editor }) => {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(3);
  const [hasHeader, setHasHeader] = useState(true);

  const handleInsertTable = () => {
    try {
      // Use Tiptap's native insertTable command - keep it simple
      editor.chain().focus().insertTable({
        rows,
        cols,
        withHeaderRow: hasHeader
      }).run();
    } catch (error) {
      console.error('Failed to insert table:', error);
    }
    
    // Reset form and close
    handleClose();
  };

  const handleClose = () => {
    setRows(2);
    setCols(3);
    setHasHeader(true);
    onClose();
  };

  // Simple preview table
  const renderPreview = () => {
    const previewRows = Math.min(rows + (hasHeader ? 1 : 0), 4);
    const previewCols = Math.min(cols, 5);
    
    return (
      <Table size="sm" className="mt-3">
        {hasHeader && (
          <thead>
            <tr>
              {Array.from({ length: previewCols }).map((_, col) => (
                <th key={col} className="text-center p-2">H</th>
              ))}
              {cols > 5 && <th className="text-center p-2">...</th>}
            </tr>
          </thead>
        )}
        <tbody>
          {Array.from({ length: Math.min(rows, hasHeader ? 3 : 4) }).map((_, row) => (
            <tr key={row}>
              {Array.from({ length: previewCols }).map((_, col) => (
                <td key={col} className="text-center p-2">•</td>
              ))}
              {cols > 5 && <td className="text-center p-2">...</td>}
            </tr>
          ))}
          {rows > (hasHeader ? 3 : 4) && (
            <tr>
              {Array.from({ length: previewCols }).map((_, col) => (
                <td key={col} className="text-center p-1">⋮</td>
              ))}
            </tr>
          )}
        </tbody>
      </Table>
    );
  };

  return (
    <Modal show={isOpen} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Insert Table</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <h6 className="mb-3">Table Dimensions</h6>
            
            <Form.Group className="mb-3">
              <Form.Label>Rows</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="20"
                value={rows}
                onChange={(e) => setRows(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
              />
              <Form.Text className="text-muted">Maximum 20 rows</Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Columns</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => setCols(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              />
              <Form.Text className="text-muted">Maximum 10 columns</Form.Text>
            </Form.Group>

            <h6 className="mb-3">Table Options</h6>
            
            <Form.Check
              type="checkbox"
              id="hasHeader"
              label="Include header row"
              checked={hasHeader}
              onChange={(e) => setHasHeader(e.target.checked)}
              className="mb-3"
            />
          </Col>
          
          <Col md={6}>
            <h6 className="mb-3">Preview ({rows} × {cols})</h6>
            {renderPreview()}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleInsertTable}
          disabled={rows < 1 || cols < 1}
        >
          Insert Table ({rows} × {cols})
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TableModal;