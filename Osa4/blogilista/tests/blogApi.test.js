const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('all blogs have an id field', async () => {
    const response = await api.get('/api/blogs')
    
    response.body.forEach(obj => {
      assert(obj.hasOwnProperty('id'))
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
      }

      const user = await User.findOne({})

      const token = jwt.sign({username: user.username, id:user.id}, process.env.SECRET)

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')

      const titles = response.body.map(b => b.title)

      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

      assert(titles.includes("Canonical string reduction"))
    })

    test('succeeds and sets likes as 0 when blog has no likes field', async () => {
      const newBlog = {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        __v: 0
      }

      const user = await User.findOne({})

      const token = jwt.sign({username: user.username, id:user.id}, process.env.SECRET)

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
      assert.strictEqual(response.body[response.body.length - 1].likes, 0)
    })

    test('fails with status code 400 when blog has no title', async () => {
      const newBlog = {
        _id: "5a422b891b54a676234d17fa",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 5,
        __v: 0
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('fails with status code 400 when blog has no url', async () => {
      const newBlog = {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        likes: 5,
        __v: 0
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const user = await User.findOne({})

      const token = jwt.sign({username: user.username, id:user.id}, process.env.SECRET)

      const newBlog = {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      
      const blogsAtStart = await helper.blogsInDb()

      await api
        .delete(`/api/blogs/${newBlog._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
      
      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(!titles.includes(newBlog.title))
    })
  })

  describe('editing a blog', () => {
    test('succeeds and updates the blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToEdit = blogsAtStart[0]
      blogToEdit.likes = 10

      await api
        .put(`/api/blogs/${blogToEdit.id}`)
        .send(blogToEdit)
      
      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

      assert.strictEqual(blogsAtEnd[0].likes, 10)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})