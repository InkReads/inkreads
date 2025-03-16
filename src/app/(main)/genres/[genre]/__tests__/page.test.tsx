import { describe, expect, it, beforeAll, afterAll, afterEach } from 'jest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Mock data
const mockBooks = {
  items: [
    {
      id: '123',
      volumeInfo: {
        title: 'Test Book',
        authors: ['Test Author'],
        publishedDate: '2024',
        description: 'Test Description'
      }
    }
  ]
};

// Setup MSW server
const server = setupServer(
  rest.get('https://www.googleapis.com/books/v1/volumes', (req, res, ctx) => {
    const query = req.url.searchParams.get('q');
    
    if (query === 'success') {
      return res(ctx.json(mockBooks));
    }

    if (query === 'empty') {
      return res(ctx.json({}));
    }

    if (query === 'error') {
      return res(ctx.status(500));
    }

    return res(ctx.json(mockBooks));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('getBooks', () => {
  it('should fetch books successfully', async () => {
    const books = await getBooks('success');
    expect(books).toEqual(mockBooks.items);
  });

  it('should return empty array when no books found', async () => {
    const books = await getBooks('empty');
    expect(books).toEqual([]);
  });

  it('should handle API errors gracefully', async () => {
    const books = await getBooks('error');
    expect(books).toEqual([]);
  });

  it('should encode query parameters correctly', async () => {
    const books = await getBooks('light novel');
    expect(books).toEqual(mockBooks.items);
  });
}); 