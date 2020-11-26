const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {addBooking, getBookings, deleteBooking, checkAvailability} = require('./booking.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getBookings)
// router.post('/',  requireAuth, addBooking)
router.post('/check', checkAvailability)
router.post('/', addBooking)
router.delete('/:id',  requireAuth, deleteBooking)

module.exports = router