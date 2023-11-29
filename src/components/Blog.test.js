import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
	const blog = {
		title: 'Title of the blog that needs to be rendered',
		author: 'Unknown',
		url: 'some-url',
		likes: 5
	}

	render(<Blog blog={blog} />)

	const element = screen.getByText('Title of the blog that needs to be rendered Unknown')
	expect(element).toBeDefined()

	const urlEl = screen.queryByText('some-url')
  	expect(urlEl).toBeNull()

	const likesEl = screen.queryByText('likes 5')
  	expect(likesEl).toBeNull()
})

test('clicking the show button shows url and number of likes', async () => {
	const blog = {
		title: 'Title of the blog that needs to be rendered',
		author: 'Unknown',
		url: 'some-url',
		likes: 5,
		user: {
			name: 'Alejandro Martinez'
		}
	}

	render(<Blog blog={blog} />)

	const user = userEvent.setup()
	const button = screen.getByText('show')
	await user.click(button)

	const element = screen.getByText('Title of the blog that needs to be rendered Unknown')
	expect(element).toBeDefined()

	const urlEl = screen.queryByText('some-url')
  	expect(urlEl).toBeDefined()

	const likesEl = screen.queryByText('likes 5')
  	expect(likesEl).toBeDefined()
})

test('clicking the like button twice calls the method addLikes 2 times', async () => {
	const blog = {
		title: 'Title of the blog that needs to be rendered',
		author: 'Unknown',
		url: 'some-url',
		likes: 5,
		user: {
			name: 'Alejandro Martinez'
		}
	}

	const mockHandler = jest.fn()

	render(<Blog blog={blog} addLikes={mockHandler}/>)

	const user = userEvent.setup()
	const showButton = screen.getByText('show')
	await user.click(showButton)

	const likeButton = screen.getByText('like')
	await user.click(likeButton)
	await user.click(likeButton)

	expect(mockHandler.mock.calls).toHaveLength(2)
})
