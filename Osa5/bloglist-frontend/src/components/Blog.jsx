import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLike, handleRemove }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const loggedUser = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
  const showRemoveButton = blog.user.username === loggedUser.username

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleDetails}>{showDetails ? 'hide' : 'view'}</button>
      </div>
      {showDetails && (
        <div>
          <p>URL: {blog.url}</p>
          <p data-testid='likes'>Likes: {blog.likes} <button onClick={handleLike}>like</button></p>
          <p>User: {blog.user.name}</p>
          {showRemoveButton && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
      )}
    </div>
  )}

Blog.propTypes = {
  blog: PropTypes.object.isRequired
}

export default Blog