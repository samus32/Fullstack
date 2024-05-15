import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog title and author', () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'Test url',
    likes: 0,
    user: { name: 'Test user', username: 'Test user' }
  }

  window.localStorage.setItem('loggedBlogappUser', JSON.stringify(blog.user))

  render(<Blog blog={blog} />)

  expect(screen.getByText('Test title Test author')).toBeDefined()
})

test('clicking the view button shows also blog url, likes and user', async () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'Test url',
    likes: 0,
    user: { name: 'Test user', username: 'Test user' }
  }

  window.localStorage.setItem('loggedBlogappUser', JSON.stringify(blog.user))

  render(
    <Blog blog={blog} />
  )

  const user = userEvent.setup()
  await user.click(screen.getByText('view'))

  expect(screen.getByText('Test title Test author')).toBeDefined()
  expect(screen.getByText('URL: Test url')).toBeDefined()
  expect(screen.getByText('Likes: 0')).toBeDefined()
  expect(screen.getByText('User: Test user')).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'Test url',
    likes: 0,
    user: { name: 'Test user', username: 'Test user' }
  }

  window.localStorage.setItem('loggedBlogappUser', JSON.stringify(blog.user))

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} handleLike={mockHandler} />
  )

  const user = userEvent.setup()
  await user.click(screen.getByText('view'))
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})