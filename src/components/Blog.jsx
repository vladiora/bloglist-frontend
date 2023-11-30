import { useState } from 'react'

const Blog = ({ blog, addLikes, removeBlog }) => {
	const [visible, setVisible] = useState(false)

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5
	}

	const toggleVisibility = () => {
		setVisible(!visible)
	}

	const addLike = () => {

		const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
		addLikes(updatedBlog)
	}

	const remove = () => {

		if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`))
			removeBlog(blog.id)
	}

	const canRemove = JSON.parse(window.localStorage.getItem('loggedBlogAppUser')).name === blog.user.name

	const removeBtn = () => (
		<div>
			<button className='red-button' onClick={remove}>remove</button>
		</div>
	)

	const additionalInfo = () => (
		<div>
			<p>{blog.url}</p>
			<p>likes {blog.likes} <button className='like-button' onClick={addLike}>like</button> </p>
			<p>{blog.user.name}</p>
			{canRemove && removeBtn()}
		</div>
	)

	return (
		<div className='blog' style={blogStyle}>
			{blog.title} {blog.author}
			<button onClick={toggleVisibility}>{visible ? 'hide' : 'show'}</button>
			{visible && additionalInfo()}
		</div>
	)
}

export default Blog
