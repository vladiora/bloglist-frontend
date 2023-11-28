import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [url, setUrl] = useState('')
	const [blogs, setBlogs] = useState([])
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)
	const [notification, setNotification] = useState({message: null, type: ''})

	useEffect(() => {

		blogService.getAll().then(returnedBlogs =>
			setBlogs( returnedBlogs )
		)
	}, [])

	useEffect(() => {

		const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')

		if (loggedUserJSON) {

			const loggedUser = JSON.parse(loggedUserJSON)

			setUser(loggedUser)
			blogService.setToken(loggedUser.token)
		}
	}, [])

	const handleLogin = async (event) => {

		event.preventDefault()

		try {

			const loggedUser = await loginService.login({
				username, password,
			})

			window.localStorage.setItem(
				'loggedBlogAppUser', JSON.stringify(loggedUser)
			)

			setUser(loggedUser)
			blogService.setToken(loggedUser.token)

			setUsername('')
			setPassword('')

		} catch (exception) {

			setNotification({
				message: 'wrong username or password',
				type: 'error'
			})

			setTimeout(() => {
				setNotification({
					message: null,
					type: ''
				})
			}, 5000)
		}
	}

	const onLogout = function () {

		window.localStorage.removeItem('loggedBlogAppUser')
		setUser(null)
	}

	const createBlog = (event) => {

		event.preventDefault()

		const newBlog = {
			title: title,
			author: author,
			url: url
		}

		blogService
			.create(newBlog)
			.then(returnedBlog => {

				setNotification({
					message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
					type: 'success'
				})

				setTimeout(() => {
					setNotification({
						message: null,
						type: ''
					})
				}, 5000)

				setBlogs(blogs.concat(returnedBlog))
				setTitle('')
				setAuthor('')
				setUrl('')
			})
			.catch(error => {

				setNotification({
					message: error.response.data.error,
					type: 'error'
				})

				setTimeout(() => {
					setNotification({
						message: null,
						type: ''
					})
				}, 5000)
			})
	}

	if (user === null)
		return (
			<div>
				<h2>Log in to application</h2>
				<Notification message={notification.message} type={notification.type} />
				<LoginForm username={username} password={password} handleLogin={handleLogin} setUsername={setUsername} setPassword={setPassword} />
			</div>
		)

	return (
		<div>
			<h2>blogs</h2>
			<Notification message={notification.message} type={notification.type} />
			<p>{user.name} logged in<button onClick={onLogout}>logout</button></p>
			<BlogForm title={title} author={author} url={url}  createBlog={createBlog} setAuthor={setAuthor} setTitle={setTitle} setUrl={setUrl} />
			{blogs.map(blog =>
				<Blog key={blog.id} blog={blog} />
			)}
		</div>
	)
}

export default App
