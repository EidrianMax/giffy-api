import '../load-enviroment.js'
import { client, usersCollection } from '../mongo-connection.js'
import bcrypt from 'bcrypt'
import addFav from './add-fav.js'
import { ObjectId } from 'mongodb'

const { BCRYPT_SALT_ROUNDS } = process.env

afterEach(async () => {
  try {
    await usersCollection.drop()
  } catch (error) {
    // console.log(error)
  }
})

describe('addFav', () => {
  let user, userId
  const favId = '1371nd'
  const mongoId = new ObjectId().toJSON()

  beforeEach(async () => {
    user = {
      username: 'pepe',
      password: '123456'
    }

    const result = await usersCollection.insertOne({
      ...user,
      password: bcrypt.hashSync(user.password, Number(BCRYPT_SALT_ROUNDS))
    })

    const newUser = await usersCollection.findOne({ _id: result.insertedId })

    userId = newUser._id.toJSON()
  })

  test('should success when add fav to user successfully', async () => {
    const favs = await addFav({ userId, favId })
    expect(favs).toContain(favId)

    const userInDb = await usersCollection.findOne({ _id: new ObjectId(userId) })
    expect(userInDb.favs).toContain(favId)
  })

  test('should fail when can\t add fav to user', async () => {
    try {
      await addFav({ userId: mongoId, favId: '1231db' })
      throw new Error('should not reach at this point')
    } catch ({ message }) {
      expect(message).toBe(`user not found with id ${mongoId}`)
    }
  })

  describe('when parametres are not valid', () => {
    describe('when userId is not valid', () => {
      test('should fail when userId is not a string', () => {
        expect(() => addFav({ userId: 123, favId: null })).rejects.toThrowError('userId is not a string')
        expect(() => addFav({ userId: true, favId: null })).rejects.toThrowError('userId is not a string')
        expect(() => addFav({ userId: {}, favId: null })).rejects.toThrowError('userId is not a string')
        expect(() => addFav({ userId: [], favId: null })).rejects.toThrowError('userId is not a string')
        expect(() => addFav({ userId: () => {}, favId: null })).rejects.toThrowError('userId is not a string')
      })

      test('should fail when userId is a empty string', () => {
        expect(() => addFav({ userId: '', favId: null })).rejects.toThrowError('userId is empty')
      })

      test('should fail when userId has empty spaces', () => {
        expect(() => addFav({ userId: '64d375875ba a5aa87038 dc15', favId: null })).rejects.toThrowError('userId mustn\'t have white spaces')
      })

      test('should fail when userId is not a valid mongo id', () => {
        expect(() => addFav({ userId: mongoId + '-wrong', favId: null })).rejects.toThrowError(`${mongoId}-wrong is not a valid mongo id`)
      })
    })

    describe('when favId is not valid', () => {
      test('should fail when favId is not a string', async () => {
        await expect(() => addFav({ userId, favId: 123 })).rejects.toThrowError('favId is not a string')
        await expect(() => addFav({ userId, favId: true })).rejects.toThrowError('favId is not a string')
        await expect(() => addFav({ userId, favId: {} })).rejects.toThrowError('favId is not a string')
        await expect(() => addFav({ userId, favId: [] })).rejects.toThrowError('favId is not a string')
        await expect(() => addFav({ userId, favId: () => {} })).rejects.toThrowError('favId is not a string')
      })

      test('should fail when favId is a empty string', async () => {
        await expect(() => addFav({ userId, favId: '' })).rejects.toThrowError('favId is empty')
      })

      test('should fail when favId has empty spaces', async () => {
        await expect(() => addFav({ userId, favId: '23f 112' })).rejects.toThrowError('favId mustn\'t have white spaces')
      })
    })
  })

  describe('when item exist in array', () => {
    let user, userId
    const favs = ['1']

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

    test('should not add a fav if the item exist in array', async () => {
      const sameFavToAdd = favs[0]

      const newFavs = await addFav({ userId, favId: sameFavToAdd })
      expect(newFavs).toHaveLength(favs)
      expect(newFavs).toEqual(favs)
    })
  })
})

afterAll(async () => {
  await client.close()
})
