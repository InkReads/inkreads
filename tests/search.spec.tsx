import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookSearch from '../src/modules/components/book-search/search';

describe('BookSearch Component', () => {
  test('should display search input', () => {
    render(<BookSearch />);
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  test('should display search results when a query is entered', async () => {
    render(<BookSearch />);
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    const searchResults = await screen.findAllByRole('list');
    expect(searchResults.length).toBeGreaterThan(0);
  });
});