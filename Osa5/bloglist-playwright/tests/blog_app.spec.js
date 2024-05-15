const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Tester',
        username: 'tester',
        password: 'password'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'tester', 'password')
      await expect(page.getByText('Tester logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'tester', 'wrong')

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Tester logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'tester', 'password')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test title', 'Test author', 'Test url')
      await expect(page.getByText('Test title Test author')).toBeVisible()
    })
    
    describe('and when several blogs exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, '1 Test title', '1 Test author', '1 Test url')
        await createBlog(page, '2 Test title', '2 Test author', '2 Test url')
        await createBlog(page, '3 Test title', '3 Test author', '3 Test url')
      })

      test('a blog can be liked', async ({ page }) => {
        await page.pause()
        const blog = await page.getByText('2 Test title 2 Test author')
        const blogElement = await blog.locator('..')
      
        await blogElement.getByRole('button', { name: 'view' }).click()

        const likesElement = await blogElement.getByTestId('likes')
        const initialLikesText = await likesElement.innerText()
        const initialLikes = parseInt(initialLikesText.match(/\d+/)[0]) 

        await blogElement.getByRole('button', { name: 'like' }).click()
        await page.waitForTimeout(3000)

        const updatedLikesText = await likesElement.innerText()
        const updatedLikes = parseInt(updatedLikesText.match(/\d+/)[0]) 

        expect(updatedLikes).toBe(initialLikes + 1)
      })

      test('a blog can be removed by the user who added it', async ({ page }) => {
        await page.pause()
        const blog = await page.getByText('3 Test title 3 Test author')
        const blogElement = await blog.locator('..')
      
        await blogElement.getByRole('button', { name: 'view' }).click()

        page.on('dialog', async dialog => {
          console.log(dialog.message())
          await dialog.accept()
        })

        await blogElement.getByRole('button', { name: 'remove' }).click()
        
        await expect(page.getByText('3 Test title 3 Test author')).not.toBeVisible()
      })
    })
  })
})