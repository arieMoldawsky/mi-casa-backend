const dbService = require('../../services/db.service')
const { use } = require('../booking/booking.routes')
const ObjectId = require('mongodb').ObjectId

module.exports = {
  getById,
  getByEmail,
  remove,
  update,
  add,
  unreadBooking
}

async function getById(userId) {
  const collection = await dbService.getCollection('user')
  try {
    const user = await collection.findOne({ _id: ObjectId(userId) })
    delete user.password
    return user
  } catch (err) {
    console.log(`ERROR: while finding user ${userId}`)
    throw err
  }
}
async function getByEmail(email) {
  const collection = await dbService.getCollection('user')
  try {
    const user = await collection.findOne({ email })
    return user
  } catch (err) {
    console.log(`ERROR: while finding user ${email}`)
    throw err
  }
}

async function remove(userId) {
  const collection = await dbService.getCollection('user')
  try {
    await collection.deleteOne({ _id: ObjectId(userId) })
  } catch (err) {
    console.log(`ERROR: cannot remove user ${userId}`)
    throw err
  }
}

async function update(user) {
  const collection = await dbService.getCollection('user')
  user._id = ObjectId(user._id)
  try {
    await collection.replaceOne({ _id: user._id }, { $set: user })
    return user
  } catch (err) {
    console.log(`ERROR: cannot update user ${user._id}`)
    throw err
  }
}

async function unreadBooking(user) {
  const collection = await dbService.getCollection('user')
  // user.unreadBookings = user.unreadBookings + 1;
  user._id = ObjectId(user._id)
  try {
    const updatedUser = await collection.updateOne({ _id: user._id }, { $inc: {unreadBookings: 1} });
    return updatedUser
  } catch (err) {
    console.log(`ERROR: cannot update unread bookings ${user._id}`)
    throw err
  }
}

async function add(user) {
  const collection = await dbService.getCollection('user')
  user.unreadBookings = 0;
  try {
    await collection.insertOne(user)
    return user
  } catch (err) {
    console.log(`ERROR: cannot insert user`)
    throw err
  }
}