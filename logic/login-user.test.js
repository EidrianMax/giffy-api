import '../load-enviroment.js'
import { client, usersCollection } from '../mongo-connection'
import bcryp from 'bcrypt'
import loginUser from './login-user'
import { afterAll, describe, expect } from 'vitest'

const { BCRYPT_SALT_ROUNDS } = process.env

describe('loginUser', () => {
  let user, userId

  beforeEach(async () => {
    user = {
      username: 'pepe',
      password: '123456'
    }

    const result = await usersCollection.insertOne({
      ...user,
      password: bcryp.hashSync(user.password, Number(BCRYPT_SALT_ROUNDS))
    })

    const newUser = await usersCollection.findOne({ _id: result.insertedId })

    userId = newUser._id.toJSON()
  })

  afterEach(async () => {
    try {
      await usersCollection.drop()
    } catch (error) {
      // console.log(error)
    }
  })

  test('should login user successfully', async () => {
    const { username, password } = user

    const id = await loginUser({ username, password })

    expect(id).toBe(userId)
  })

  test('should fail when user is not registered', async () => {
    const { username, password } = user

    try {
      await loginUser({ username: username + 'wrong', password })
      throw new Error('should not reach at this point')
    } catch ({ message }) {
      expect(message).toBe('invalid credentials')
    }
  })

  test('should fail when user is registered, but password is incorrect', async () => {
    const { username, password } = user

    try {
      await loginUser({ username, password: password + 'wrong' })
      throw new Error('should not reach at this point')
    } catch ({ message }) {
      expect(message).toBe('invalid credentials')
    }
  })

  describe('when parametres are not valid', () => {
    describe('when username is not valid', () => {
      test('should fail when username is not a string', async () => {
        expect(() => loginUser({ username: 123, password: null })).rejects.toThrowError(TypeError)
        expect(() => loginUser({ username: 123, password: null })).rejects.toThrowError('username is not a string')
        expect(() => loginUser({ username: true, password: null })).rejects.toThrowError('username is not a string')
        expect(() => loginUser({ username: {}, password: null })).rejects.toThrowError('username is not a string')
        expect(() => loginUser({ username: [], password: null })).rejects.toThrowError('username is not a string')
        expect(() => loginUser({ username: () => {}, password: null })).rejects.toThrowError('username is not a string')
      })

      test('should fail when username is an empty string', async () => {
        expect(() => loginUser({ username: '', password: null })).rejects.toThrowError('username is empty')
      })

      test('should fail when username has empty spaces', async () => {
        expect(() => loginUser({ username: 'pe pe', password: null })).rejects.toThrowError('username mustn\'t have white spaces')
      })

      test('should fail when username has less than 4 chararcters', async () => {
        expect(() => loginUser({ username: 'pep', password: null })).rejects.toThrowError(Error)
        expect(() => loginUser({ username: 'pep', password: null })).rejects.toThrowError('username must be atleast 4 chars and under 30 chars')
      })

      test('should fail when username has more than 30 chararcters', async () => {
        const usernameMoreThan50Chars = 'anticonstitucionalidadinconstitucionalidad'

        expect(() => loginUser({ username: usernameMoreThan50Chars, password: null })).rejects.toThrowError(Error)
        expect(() => loginUser({ username: usernameMoreThan50Chars, password: null })).rejects.toThrowError('username must be atleast 4 chars and under 30 chars')
      })
    })
  })

  describe('when password is not valid', () => {
    test('should fail when password is not a string', async () => {
      expect(() => loginUser({ username: 'pepe', password: 123 })).rejects.toThrowError(TypeError)
      expect(() => loginUser({ username: 'pepe', password: true })).rejects.toThrowError('password is not a string')
      expect(() => loginUser({ username: 'pepe', password: {} })).rejects.toThrowError('password is not a string')
      expect(() => loginUser({ username: 'pepe', password: [] })).rejects.toThrowError('password is not a string')
      expect(() => loginUser({ username: 'pepe', password: () => {} })).rejects.toThrowError('password is not a string')
    })

    test('should fail when password is an empty string', async () => {
      expect(() => loginUser({ username: 'pepe', password: '' })).rejects.toThrowError(Error)
      expect(() => loginUser({ username: 'pepe', password: '' })).rejects.toThrowError('password is empty')
    })

    test('should fail when password has empty spaces', async () => {
      expect(() => loginUser({ username: 'pepe', password: '123 456' })).rejects.toThrowError(Error)
      expect(() => loginUser({ username: 'pepe', password: '123 456' })).rejects.toThrowError('password mustn\'t have white spaces')
    })

    test('should fail when password has less than 6 chararcters', async () => {
      expect(() => loginUser({ username: 'pepe', password: '12345' })).rejects.toThrowError(Error)
      expect(() => loginUser({ username: 'pepe', password: '12345' })).rejects.toThrowError('password must be atleast 6 chars and under 15 chars')
    })

    test('should fail when password has more than 15 chararcters', async () => {
      const passwordMoreThan15Chars = 'anticonstitucional'
      expect(() => loginUser({ username: 'pepe', password: passwordMoreThan15Chars })).rejects.toThrowError(Error)
      expect(() => loginUser({ username: 'pepe', password: passwordMoreThan15Chars })).rejects.toThrowError('password must be atleast 6 chars and under 15 chars')
    })
  })
})

afterAll(async () => {
  await client.close()
})
