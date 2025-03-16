import { render, screen } from '@testing-library/react';
import GenrePage from '../page';
import jest from 'next/jest';

// Mock the getBooks function
jest.mock('../getBooks', () => ({
  getBooks: jest.fn().mockResolvedValue([
    {
      id: '123',
      volumeInfo: {
        title: 'Test Book',
        authors: ['Test Author'],
        publishedDate: '2024',
        description: 'Test Description'
      }
    }
  ])
}));

describe('GenrePage', () => {
  it('should render the genre title and description', async () => {
    render(await GenrePage({ params: Promise.resolve({ genre: 'novels' }) }));

    expect(screen.getByText('Novels')).toBeInTheDocument();
    expect(screen.getByText('Discover traditional novels across all genres')).toBeInTheDocument();
  });

  it('should render books from the API', async () => {
    render(await GenrePage({ params: Promise.resolve({ genre: 'novels' }) }));

    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  it('should handle invalid genres', async () => {
    const notFound = jest.fn();
    jest.mock('next/navigation', () => ({
      notFound: notFound
    }));

    await GenrePage({ params: Promise.resolve({ genre: 'invalid' }) });
    expect(notFound).toHaveBeenCalled();
  });
}); 