import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    })

    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  return (
    <div>
      <h2>Create new</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            data-testid='title'
            value={newBlogTitle}
            onChange={(event) => {
              setNewBlogTitle(event.target.value)
            }}
            placeholder='write blog title here'
          />
        </div>
        <div>
          author:
          <input
            data-testid='author'
            value={newBlogAuthor}
            onChange={(event) => {
              setNewBlogAuthor(event.target.value)
            }}
            placeholder='write blog author here'
          />
        </div>
        <div>
          url:
          <input
            data-testid='url'
            value={newBlogUrl}
            onChange={(event) => {
              setNewBlogUrl(event.target.value)
            }}
            placeholder='write blog url here'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm