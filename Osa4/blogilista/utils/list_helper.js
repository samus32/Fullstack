var _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.map(blog => blog.likes).reduce((prev, next) => prev + next)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? null
    : blogs.reduce((a,b) => a.likes > b.likes ? a : b)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {return null}
  const mostFrequentAuthor = _.chain(blogs)
                              .countBy('author')
                              .toPairs()
                              .maxBy(_.last)
                              .value()
  const mostFrequentAuthorObj = {
    author: mostFrequentAuthor[0],
    blogs: mostFrequentAuthor[1]
  }
  return mostFrequentAuthorObj
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {return null}
  const mostLikedAuthor = _.chain(blogs)
                           .groupBy('author')
                           .mapValues(authorBlogs => _.sumBy(authorBlogs, 'likes'))
                           .toPairs()
                           .maxBy(_.last)
                           .value()
  const mostLikedAuthorObj = {
    author: mostLikedAuthor[0],
    likes: mostLikedAuthor[1]
  }
  return mostLikedAuthorObj
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}