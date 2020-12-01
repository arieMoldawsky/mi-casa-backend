const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    remove,
    add,
    check,
  }

async function query(query = {}) {
  try {
    const collection = await dbService.getCollection('booking')
    const criteria = _buildCriteria(query)
    const bookings = await collection.find(criteria).toArray()
    return bookings
  } catch (err) {
    console.log('ERROR: cannot find bookings')
    throw err
  }
}

async function remove(bookingId) {
  const collection = await dbService.getCollection('booking')
  try {
    await collection.deleteOne({ _id: ObjectId(bookingId) })
  } catch (err) {
    console.log(`ERROR: cannot remove booking ${bookingId}`)
    throw err
  }
}

async function add(booking) {
  const collection = await dbService.getCollection('booking')
  try {
    const houseBookings = await collection
      .find({ 'house._id': booking.house._id })
      .toArray()
    const takenBookings = houseBookings.find(aBooking => {
      return (
        (aBooking.checkIn <= booking.checkIn &&
          aBooking.checkIn <= booking.checkOut &&
          aBooking.checkOut >= booking.checkOut &&
          aBooking.checkOut >= booking.checkIn) ||
        (aBooking.checkIn > booking.checkIn &&
          aBooking.checkOut < booking.checkOut) ||
        (aBooking.checkIn > booking.checkIn &&
          aBooking.checkOut > booking.checkOut &&
          aBooking.checkIn < booking.checkOut) ||
        (aBooking.checkOut < booking.checkOut &&
          aBooking.checkIn < booking.checkIn &&
          aBooking.checkOut > booking.checkIn)
      )
    })

    if (!takenBookings) {
      await collection.insertOne(booking)
      return booking
    } else return Promise.reject('Dates are already taken.')
  } catch (err) {
    console.log(`ERROR: cannot insert booking`)
    throw err
  }
}

async function check(booking) {
  const collection = await dbService.getCollection('booking')
  try {
    const houseBookings = await collection
      .find({ 'house._id': booking.house._id })
      .toArray()
    const takenBookings = houseBookings.find(aBooking => {
      return (
        (aBooking.checkIn <= booking.checkIn &&
          aBooking.checkIn <= booking.checkOut &&
          aBooking.checkOut >= booking.checkOut &&
          aBooking.checkOut >= booking.checkIn) ||
        (aBooking.checkIn > booking.checkIn &&
          aBooking.checkOut < booking.checkOut) ||
        (aBooking.checkIn > booking.checkIn &&
          aBooking.checkOut > booking.checkOut &&
          aBooking.checkIn < booking.checkOut) ||
        (aBooking.checkOut < booking.checkOut &&
          aBooking.checkIn < booking.checkIn &&
          aBooking.checkOut > booking.checkIn)
      )
    })

    // console.log(takenBookings, booking)
    if (!takenBookings) {
      return true
    } else return Promise.reject('Dates are already taken.')
  } catch (err) {
    console.log(`ERROR: cannot check bookings`)
    throw err
  }
}

function _buildCriteria(query) {
  const criteria = {}
  //   if (query.txt) {
  //     if (!criteria.$or) criteria.$or = []
  //     const regex = new RegExp(query.txt.split(/,|-| /).join('|'), 'i')
  //     criteria.$or.push({ 'location.city': regex }, { 'location.country': regex })
  //   }
  //   if (query.adults) {
  //     var total = +query.adults
  //     if (query.kids) total += +query.kids
  //     if (query.infants) total += +query.infants
  //     criteria.capacity = { $gte: total }
  //   }
  if (query.houseId) {
    criteria['house._id'] = query.houseId
    console.log(query);
    console.log(criteria);
  }
  return criteria
}