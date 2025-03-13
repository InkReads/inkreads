import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchInput from '../search-input'
import '@testing-library/jest-dom'

describe('SearchInput Component', () => {
  test('renders search input with placeholder', () => {
    render(<SearchInput />)
    
    // Check if input exists with correct placeholder
    const searchInput = screen.getByPlaceholderText('Search...')
    expect(searchInput).toBeInTheDocument()
  })

  test('renders search icon', () => {
    render(<SearchInput />)
    
    // Check if search icon exists
    const searchIcon = screen.getByTestId('search-icon')
    expect(searchIcon).toBeInTheDocument()
  })

  test('input is clickable and focusable', async () => {
    render(<SearchInput />)
    const searchInput = screen.getByPlaceholderText('Search...')
    
    // Click the input
    await userEvent.click(searchInput)
    expect(searchInput).toHaveFocus()
  })

  test('has correct styling classes', () => {
    render(<SearchInput />)
    const searchInput = screen.getByPlaceholderText('Search...')
    
    // Check for responsive width classes
    expect(searchInput).toHaveClass('sm:w-[16rem]')
    expect(searchInput).toHaveClass('lg:w-[20rem]')
    expect(searchInput).toHaveClass('pl-10')
  })
}) 