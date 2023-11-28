import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)
	const [notification, setNotification] = useState({message: null, type: ''})

	const blogFormRef = useRef()

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

	const createBlog = (newBlog) => {

		blogFormRef.current.toggleVisibility()

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

	const addLike = (updatedBlog) => {

		blogService
			.update(updatedBlog.id, updatedBlog)
			.then(returnedBlog => {

				setBlogs(blogs.map(b => b.id !== updatedBlog.id ? b : {...b, likes: returnedBlog.likes}))
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

				setBlogs(blogs.filter(b => b.id !== id))
			})
	}

	const removeBlog = (id) => {

		blogService
			.remove(id)
			.then(() => setBlogs(blogs.filter(b => b.id !== id)))
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

				setBlogs(blogs.filter(b => b.id !== id))
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

			<Togglable buttonLabel="create new blog" ref={blogFormRef}>
				<BlogForm createBlog={createBlog} />
			</Togglable>

			{blogs.toSorted((a, b) => b.likes - a.likes).map(blog =>
				<Blog key={blog.id} blog={blog} addLikes={addLike} removeBlog={removeBlog} />
			)}
		</div>
	)
}

export default App
