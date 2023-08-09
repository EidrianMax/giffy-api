import '../load-enviroment.js'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'
import { client, usersCollection } from '../mongo-connection.js'
import getAllFavs from './get-all-favs.js'
import { describe } from 'vitest'

const { BCRYPT_SALT_ROUNDS } = process.env

afterEach(async () => {
  try {
    await usersCollection.drop()
  } catch (error) {
    // console.log(error)
  }
})

describe('getAllFavs', () => {
  let user, userId
  const favs = [1, 2, 3, 4]
  const fakeUserId = new ObjectId().toJSON()

  beforeEach(async () => {
    user = {
      username: 'pepe',
      password: '123456',
      favs
    }

    const result = await usersCollection.insertOne({
      ...user,
      password: bcrypt.hashSync(user.password, Number(BCRYPT_SALT_ROUNDS))
    })

    const newUser = await usersCollection.findOne({ _id: result.insertedId })

    userId = newUser._id.toJSON()
  })

  test('should suceed when get all favs successfully', async () => {
    const userFavs = await getAllFavs({ userId })
    favs.forEach(fav => {
      expect(userFavs).toContain(fav)
    })

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) })
    favs.forEach(fav => {
      expect(user.favs).toContain(fav)
    })
  })

  test('should fail when user is not found', async () => {
    try {
      await getAllFavs({ userId: fakeUserId })
      throw new Error('should not reach at this point')
    } catch ({ message }) {
      expect(message).toBe(`user not found with id ${fakeUserId}`)
    }
  })

  describe('when parametres are not valid', () => {
    describe('when userId is not valid', () => {
      test('should fail when userId is not a string', () => {
        expect(() => getAllFavs({ userId: 123 })).rejects.toThrowError('userId is not a string')
        expect(() => getAllFavs({ userId: true })).rejects.toThrowError('userId is not a string')
        expect(() => getAllFavs({ userId: {} })).rejects.toThrowError('userId is not a string')
        expect(() => getAllFavs({ userId: [] })).rejects.toThrowError('userId is not a string')
        expect(() => getAllFavs({ userId: () => {} })).rejects.toThrowError('userId is not a string')
      })

      test('should fail when userId is a empty string', () => {
        expect(() => getAllFavs({ userId: '' })).rejects.toThrowError('userId is empty')
      })

      test('should fail when userId has empty spaces', () => {
        expect(() => getAllFavs({ userId: '64d375875ba a5aa87038 dc15' })).rejects.toThrowError('userId mustn\'t have white spaces')
      })

      test('should fail when userId is not a valid mongo id', () => {
        expect(() => getAllFavs({ userId: fakeUserId + '-wrong' })).rejects.toThrowError(`${fakeUserId}-wrong is not a valid mongo id`)
      })
    })
  })
})

afterAll(async () => {
  await client.close()
})
