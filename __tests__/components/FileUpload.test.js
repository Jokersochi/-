/**
 * FileUpload Component Tests
 */

import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from '../../components/FileUpload';

describe('FileUpload', () => {
  it('renders upload input', () => {
    const mockOnFileSelect = jest.fn();
    render(<FileUpload onFileSelect={mockOnFileSelect} />);
    
    const input = screen.getByLabelText(/загрузите фото комнаты/i);
    expect(input).toBeInTheDocument();
  });

  it('calls onFileSelect when file is selected', () => {
    const mockOnFileSelect = jest.fn();
    render(<FileUpload onFileSelect={mockOnFileSelect} />);
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/загрузите фото комнаты/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(mockOnFileSelect).toHaveBeenCalledWith(file);
  });

  it('displays error message when provided', () => {
    const mockOnFileSelect = jest.fn();
    render(<FileUpload onFileSelect={mockOnFileSelect} error="Test error" />);
    
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnFileSelect = jest.fn();
    render(<FileUpload onFileSelect={mockOnFileSelect} disabled={true} />);
    
    const input = screen.getByLabelText(/загрузите фото комнаты/i);
    expect(input).toBeDisabled();
  });
});
