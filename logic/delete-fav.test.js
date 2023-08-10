import '../load-enviroment.js'
import { ObjectId } from 'mongodb'
import { usersCollection } from '../mongo-connection.js'
import bcrypt from 'bcrypt'
import deleteFav from './delete-fav.js'

const { BCRYPT_SALT_ROUNDS } = process.env

afterEach(async () => {
  try {
    await usersCollection.drop()
  } catch (error) {
    // console.log(error)
  }
})

describe('deleteFav', () => {
  let user, userId
  const favs = ['1', '2', '3', '4']
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

    const newUser = await usersCollection.findOne({ _id: new ObjectId(result.insertedId) })

    userId = newUser._id.toJSON()
  })

  test('should suceed when delete one favorite of the user', async () => {
    const newFavs = await deleteFav({ userId, favId: favs[0] })

    expect(newFavs).not.toContain(favs[0])
    expect(newFavs).toHaveLength(favs.length - 1)

    const userInDb = await usersCollection.findOne({ _id: new ObjectId(userId) })

    expect(userInDb.favs).not.toContain(favs[0])
    expect(userInDb.favs).toHaveLength(favs.length - 1)
  })

  test('should fail when can\t delete a fav', async () => {
    try {
      await deleteFav({ userId: fakeUserId, favId: favs[0] })
      throw new Error('should not reach at this point')
    } catch ({ message }) {
      expect(message).toBe(`user not found with id ${fakeUserId}`)
    }
  })

  describe('when parametres are not valid', () => {
    describe('when userId is not valid', () => {
      test('should fail when userId is not a string', () => {
        expect(() => deleteFav({ userId: 123, favId: null })).rejects.toThrowError('userId is not a string')
        expect(() => deleteFav({ userId: true, favId: null })).rejects.toThrowError('userId is not a string')
        expect(() => deleteFav({ userId: {}, favId: null })).rejects.toThrowError('userId is not a string')
        expect(() => deleteFav({ userId: [], favId: null })).rejects.toThrowError('userId is not a string')
        expect(() => deleteFav({ userId: () => {}, favId: null })).rejects.toThrowError('userId is not a string')
      })

      test('should fail when userId is a empty string', () => {
        expect(() => deleteFav({ userId: '', favId: null })).rejects.toThrowError('userId is empty')
      })

      test('should fail when userId has empty spaces', () => {
        expect(() => deleteFav({ userId: '64d375875ba a5aa87038 dc15', favId: null })).rejects.toThrowError('userId mustn\'t have white spaces')
      })

      test('should fail when userId is not a valid mongo id', () => {
        expect(() => deleteFav({ userId: fakeUserId + '-wrong', favId: null })).rejects.toThrowError(`${fakeUserId}-wrong is not a valid mongo id`)
      })
    })

    describe('when favId is not valid', () => {
      test('should fail when favId is not a string', async () => {
        await expect(() => deleteFav({ userId, favId: 123 })).rejects.toThrowError('favId is not a string')
        await expect(() => deleteFav({ userId, favId: true })).rejects.toThrowError('favId is not a string')
        await expect(() => deleteFav({ userId, favId: {} })).rejects.toThrowError('favId is not a string')
        await expect(() => deleteFav({ userId, favId: [] })).rejects.toThrowError('favId is not a string')
        await expect(() => deleteFav({ userId, favId: () => {} })).rejects.toThrowError('favId is not a string')
      })

      test('should fail when favId is a empty string', async () => {
        await expect(() => deleteFav({ userId, favId: '' })).rejects.toThrowError('favId is empty')
      })

      test('should fail when favId has empty spaces', async () => {
        await expect(() => deleteFav({ userId, favId: '23f 112' })).rejects.toThrowError('favId mustn\'t have white spaces')
      })
    })
  })
})
