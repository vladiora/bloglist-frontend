import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('the form calls the event handler it received as props with the right details when a new blog is created', async () => {

	const mockHandler = jest.fn()

	render(<BlogForm createBlog={mockHandler} />)

	const user = userEvent.setup()

	const inputs = screen.getAllByRole('textbox')

	const titleInput = inputs[0]
	const authorInput = inputs[1]
	const urlInput = inputs[2]

	const createButton = screen.getByText('create')

	await user.type(titleInput, 'Title of the blog')
	await user.type(authorInput, 'Unknown')
	await user.type(urlInput, 'some-url')
	await user.click(createButton)

	expect(mockHandler.mock.calls[0][0].title).toBe('Title of the blog')
	expect(mockHandler.mock.calls[0][0].author).toBe('Unknown')
	expect(mockHandler.mock.calls[0][0].url).toBe('some-url')
})
