import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs([...blogs].sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotificationMessage('Login successful')
      setNotificationType('success')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 2000)
    } catch (exception) {
      setNotificationMessage('Wrong username or password')
      setNotificationType('error')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 2000)
    }
  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedBlogappUser')

    window.location.href = '/login'
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        returnedBlog = { ...returnedBlog, user: { username: user.username, name: user.name, id: returnedBlog.user } }
        console.log(returnedBlog)
        const newBlogs = blogs.concat(returnedBlog)
        const sortedBlogs = [...newBlogs].sort((a, b) => b.likes - a.likes)
        setBlogs(sortedBlogs)
        setNotificationMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setNotificationType('success')
        setTimeout(() => {
          setNotificationMessage(null)
          setNotificationType(null)
        }, 3000)
      })
      .catch (error => {
        setNotificationMessage('Error when adding a new blog: title, author or url missing')
        setNotificationType('error')
        setTimeout(() => {
          setNotificationMessage(null)
          setNotificationType(null)
        }, 3000)
      })
  }

  const handleLike = id => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url }
    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        returnedBlog = { ...returnedBlog, user: blog.user }
        console.log(returnedBlog)
        const updatedBlogs = blogs.map(blog => blog.id !== id ? blog : returnedBlog)
        const sortedBlogs = [...updatedBlogs].sort((a, b) => b.likes - a.likes)
        setBlogs(sortedBlogs)
      })
      .catch(error => {
        setNotificationMessage(`Blog '${blog.title}' was already removed from server`)
        setNotificationType('error')
        setTimeout(() => {
          setNotificationMessage(null)
          setNotificationType(null)
        }, 3000)
      })
  }

  const handleRemove = id => {
    const blog = blogs.find(b => b.id === id)

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
      blogService
        .remove(id)
        .then(() => {
          const updatedBlogs = blogs.filter(blog => blog.id !== id)
          const sortedBlogs = [...updatedBlogs].sort((a, b) => b.likes - a.likes)
          setBlogs(sortedBlogs)
          setNotificationMessage(`The blog ${blog.title} by ${blog.author} removed successfully`)
          setNotificationType('success')
          setTimeout(() => {
            setNotificationMessage(null)
            setNotificationType(null)
          }, 3000)
        })
        .catch(error => {
          setNotificationMessage(`Blog '${blog.title}' was already removed from server`)
          setNotificationType('error')
          setTimeout(() => {
            setNotificationMessage(null)
            setNotificationType(null)
          }, 3000)
        })
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notificationMessage} notificationType={notificationType}/>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              data-testid='username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              data-testid='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} notificationType={notificationType}/>
      <p>{user.name} logged in <button type="submit" onClick={handleLogout}>log out</button></p>
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <BlogForm
          createBlog={addBlog}
        />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id}
          blog={blog}
          handleLike={() => handleLike(blog.id)}
          handleRemove={() => handleRemove(blog.id)} />
      )}
    </div>
  )
}

export default App