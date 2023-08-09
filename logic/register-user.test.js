import '../load-enviroment.js'
import bcrypt from 'bcrypt'
import { client, usersCollection } from '../mongo-connection.js'
import registerUser from './register-user'

afterEach(async () => {
  try {
    await usersCollection.drop()
  } catch (error) {
    // console.log(error)
  }
})

describe('registerUser', () => {
  test('should register user successfully and return new user', async () => {
    const user = {
      username: 'pepe',
      password: '123456'
    }

    const newUser = await registerUser(user)

    expect(newUser).toBeDefined()
    expect(newUser.id).toBeDefined()
    expect(newUser.username).toBe(user.username)

    const userInDatabase = await usersCollection.findOne({ username: user.username })
    expect(userInDatabase).toBeDefined()
    expect(userInDatabase._id).toBeDefined()
    expect(userInDatabase.username).toBeDefined()
    expect(userInDatabase.password).toBeDefined()
    expect(userInDatabase.username).toBe(user.username)
    expect(userInDatabase.favs).toStrictEqual([])

    const isPasswordRight = await bcrypt.compare(user.password, userInDatabase.password)
    expect(isPasswordRight).toBeTruthy()
  })

  describe('when user already exist', () => {
    const user = {
      username: 'pepe',
      password: '123456'
    }

    beforeEach(async () => {
      await registerUser(user)
    })

    test('should fail when user already exist', async () => {
      try {
        await registerUser(user)
        throw new Error('should not reach here')
      } catch ({ message }) {
        expect(message).toBe(`user with username ${user.username} already exists`)
      }

      const users = await usersCollection.find({}).toArray()
      expect(users.length).toBe(1)
    })
  })

  describe('when parametres are not valid', () => {
    describe('when username is not valid', () => {
      test('should fail when username is not a string', async () => {
        expect(() => registerUser({ username: 123, password: null })).rejects.toThrowError(TypeError)
        expect(() => registerUser({ username: true, password: null })).rejects.toThrowError('username is not a string')
        expect(() => registerUser({ username: {}, password: null })).rejects.toThrowError('username is not a string')
        expect(() => registerUser({ username: [], password: null })).rejects.toThrowError('username is not a string')
        expect(() => registerUser({ username: () => {}, password: null })).rejects.toThrowError('username is not a string')
      })

      test('should fail when username is an empty string', async () => {
        expect(() => registerUser({ username: '', password: null })).rejects.toThrowError(Error)
        expect(() => registerUser({ username: '', password: null })).rejects.toThrowError('username is empty')
      })

      test('should fail when username has empty spaces', async () => {
        expect(() => registerUser({ username: 'pe pe', password: null })).rejects.toThrowError(Error)
        expect(() => registerUser({ username: 'pe pe', password: null })).rejects.toThrowError('username mustn\'t have white spaces')
      })

      test('should fail when username has less than 4 chararcters', async () => {
        expect(() => registerUser({ username: 'pep', password: null })).rejects.toThrowError(Error)
        expect(() => registerUser({ username: 'pep', password: null })).rejects.toThrowError('username must be atleast 4 chars and under 30 chars')
      })

      test('should fail when username has more than 30 chararcters', async () => {
        const usernameMoreThan50Chars = 'anticonstitucionalidadinconstitucionalidad'

        expect(() => registerUser({ username: usernameMoreThan50Chars, password: null })).rejects.toThrowError(Error)
        expect(() => registerUser({ username: usernameMoreThan50Chars, password: null })).rejects.toThrowError('username must be atleast 4 chars and under 30 chars')
      })
    })

    describe('when password is not valid', () => {
      test('should fail when password is not a string', async () => {
        expect(() => registerUser({ username: 'pepe', password: 123 })).rejects.toThrowError(TypeError)
        expect(() => registerUser({ username: 'pepe', password: true })).rejects.toThrowError('password is not a string')
        expect(() => registerUser({ username: 'pepe', password: {} })).rejects.toThrowError('password is not a string')
        expect(() => registerUser({ username: 'pepe', password: [] })).rejects.toThrowError('password is not a string')
        expect(() => registerUser({ username: 'pepe', password: () => {} })).rejects.toThrowError('password is not a string')
      })

      test('should fail when password is an empty string', async () => {
        expect(() => registerUser({ username: 'pepe', password: '' })).rejects.toThrowError(Error)
        expect(() => registerUser({ username: 'pepe', password: '' })).rejects.toThrowError('password is empty')
      })

      test('should fail when password has empty spaces', async () => {
        expect(() => registerUser({ username: 'pepe', password: '123 456' })).rejects.toThrowError(Error)
        expect(() => registerUser({ username: 'pepe', password: '123 456' })).rejects.toThrowError('password mustn\'t have white spaces')
      })

      test('should fail when password has less than 6 chararcters', async () => {
        expect(() => registerUser({ username: 'pepe', password: '12345' })).rejects.toThrowError(Error)
        expect(() => registerUser({ username: 'pepe', password: '12345' })).rejects.toThrowError('password must be atleast 6 chars and under 15 chars')
      })

      test('should fail when password has more than 15 chararcters', async () => {
        const passwordMoreThan15Chars = 'anticonstitucional'
        expect(() => registerUser({ username: 'pepe', password: passwordMoreThan15Chars })).rejects.toThrowError(Error)
        expect(() => registerUser({ username: 'pepe', password: passwordMoreThan15Chars })).rejects.toThrowError('password must be atleast 6 chars and under 15 chars')
      })
    })
  })
})

afterAll(async () => {
  await client.close()
})
