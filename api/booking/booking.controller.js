const logger = require('../../services/logger.service')
const bookingService = require('./booking.service')


async function getBookings(req, res) {
    try {
        const bookings = await bookingService.query(req.query)
        res.send(bookings)
    } catch (err) {
        logger.error('Cannot get bookings', err);
        res.status(500).send({ error: 'cannot get bookings' })
    }
}

async function deleteBooking(req, res) {
    try {
        await bookingService.remove(req.params.id)
        res.end()
    } catch (err) {
        logger.error('Cannot delete booking', err);
        res.status(500).send({ error: 'cannot delete booking' })
    }
}

async function addBooking(req, res) {
    var booking = req.body;
    // booking.byUserId = req.session.user._id;
        booking.guestUser = {
            _id: req.session.user._id,
            fullName: req.session.user.fullName,
            imgUrl: req.session.user.imgUrl
        };
    booking = await bookingService.add(booking)
    res.send(booking)
}

module.exports = {
    getBookings,
    deleteBooking,
    addBooking
}