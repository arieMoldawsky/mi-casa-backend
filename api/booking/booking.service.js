
const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId


async function query(filterBy = {}) {
    try {
        const collection = await dbService.getCollection('booking')
        // const bookings = await collection.find(criteria).toArray();
        // bookings = bookings.map(booking => {
        //     booking.byUser = { _id: booking.byUser._id, username: booking.byUser.username }
        //     booking.aboutUser = { _id: booking.aboutUser._id, username: booking.aboutUser.username }
        //     delete booking.byUserId;
        //     delete booking.aboutUserId;
        //     return booking;
        // })

        // return bookings
        return collection
    } catch (err) {
        console.log('ERROR: cannot find bookings')
        throw err;
    }

}

async function remove(bookingId) {
    const collection = await dbService.getCollection('booking')
    try {
        await collection.deleteOne({ "_id": ObjectId(bookingId) })
    } catch (err) {
        console.log(`ERROR: cannot remove booking ${bookingId}`)
        throw err;
    }
}


async function add(booking) {
    const collection = await dbService.getCollection('booking');
    try {
        const houseBookings = await collection.find({houseId: booking.houseId}).toArray();
        const takenBookings = houseBookings.find(aBooking => aBooking.checkIn >= booking.checkIn && aBooking.checkOut <= booking.checkOut)
        
        if (!takenBookings) {
            await collection.insertOne(booking);
            return booking;
        } else return Promise.reject('Dates are already taken.')
    } catch (err) {
        console.log(`ERROR: cannot insert booking`)
        throw err;
    }
}

async function check(booking) {
    const collection = await dbService.getCollection('booking');
    try {
        const houseBookings = await collection.find({houseId: booking.houseId}).toArray();
        const takenBookings = houseBookings.find(aBooking = aBooking.checkIn >= booking.checkIn && aBooking.checkOut <= booking.checkOut)
        
        console.log(takenBookings, booking);
        if (!takenBookings) {
            return true;
        } else return Promise.reject('Dates are already taken.')
    } catch (err) {
        console.log(`ERROR: cannot check bookings`)
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const criteria = {};
    return criteria;
}

module.exports = {
    query,
    remove,
    add,
    check
}


