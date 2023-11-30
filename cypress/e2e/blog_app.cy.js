describe('Blog App', () => {
	beforeEach(function() {
		cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)

		const user = {
			name: 'Arto Hellas',
			username: 'hellas',
			password: 'newPass123'
		}
		cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
		cy.visit('')
	})

	it('Login form is shown', function() {
		cy.contains('Log in to application')
	})

	describe('Login',function() {

		it('succeeds with correct credentials', function() {

			cy.get('#username').type('hellas')
			cy.get('#password').type('newPass123')
			cy.get('#login-button').click()

			cy.contains('Arto Hellas logged in')
		})

		it('fails with wrong credentials', function() {

			cy.get('#username').type('hellas')
			cy.get('#password').type('wrongPass')
			cy.get('#login-button').click()

			cy.get('.error')
				.should('contain', 'wrong username or password')
				.and('have.css', 'color', 'rgb(255, 0, 0)')
		})
	})

	describe('When logged in', function() {

		beforeEach(function() {
			cy.login({ username: 'hellas', password: 'newPass123' })
		})

		it('A blog can be created', function() {

			cy.contains('create new blog').click()

			cy.get('#title').type('New Blog')
			cy.get('#author').type('Unknown')
			cy.get('#url').type('some-url')

			cy.get('#create-button').click()

			cy.contains('New Blog Unknown')
		})

		describe('and a blog exists', function () {

			beforeEach(function () {
			  cy.createBlog({
				title: 'New Blog 2',
				author: 'Unknown',
				url: 'some-url'
			  })
			})

			it('A blog can be liked', function () {

				cy.contains('New Blog 2 Unknown').contains('show').click()
				cy.contains('like').click()

				cy.contains('likes 1')
			})

			it('Another user cannot see remove button', function() {

				// logout current user that added blogs
				cy.contains('logout').click()

				// add new user
				const user = {
					name: 'Michael Porto',
					username: 'testuser',
					password: 'newTestPass'
				}
				cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

				// login new user
				cy.login({ username: 'testuser', password: 'newTestPass' })

				// new user should not have remove button since he did not add the blog
				cy.contains('New Blog 2 Unknown').contains('show').click()
				cy.contains('remove').should('not.exist')
			})
		})

		it('A blog can be deleted by the user who added it', function () {

			cy.createBlog({
				title: 'New Blog 3',
				author: 'Unknown',
				url: 'some-url'
			})

			cy.contains('New Blog 3 Unknown').contains('show').click()
			cy.contains('remove').click()

			cy.contains('New Blog 3 Unknown').should('not.exist')
		})

		describe('more blogs exist', function() {

			beforeEach(function() {
				cy.createBlog({
					title: 'With Most likes',
					author: 'Unknown',
					url: 'some-url'
				})
				cy.createBlog({
					title: 'With second most likes',
					author: 'Unknown',
					url: 'some-url'
				})
				cy.createBlog({
					title: 'With third most likes',
					author: 'Unknown',
					url: 'some-url'
				})
			})

			it('the blogs are ordered according to likes', function() {

				// like the one with the most likes 4 times
				cy.contains('With Most likes').contains('show').click()

				cy.contains('With Most likes').contains('likes 0').contains('like').click()
				cy.contains('With Most likes').contains('likes 1').contains('like').click()
				cy.contains('With Most likes').contains('likes 2').contains('like').click()
				cy.contains('With Most likes').contains('likes 3').contains('like').click()

				cy.contains('With Most likes').contains('likes 4')

				// like the one with the second most likes 3 times
				cy.contains('With second most likes').contains('show').click()

				cy.contains('With second most likes').contains('likes 0').contains('like').click()
				cy.contains('With second most likes').contains('likes 1').contains('like').click()
				cy.contains('With second most likes').contains('likes 2').contains('like').click()

				cy.contains('With second most likes').contains('likes 3')

				// like the one with the third most likes 2 times
				cy.contains('With third most likes').contains('show').click()

				cy.contains('With third most likes').contains('likes 0').contains('like').click()
				cy.contains('With third most likes').contains('likes 1').contains('like').click()

				cy.contains('With third most likes').contains('likes 2')

				cy.get('.blog').eq(0).should('contain', 'With Most likes')
				cy.get('.blog').eq(1).should('contain', 'With second most likes')
				cy.get('.blog').eq(2).should('contain', 'With third most likes')
			})
		})

	})
})
