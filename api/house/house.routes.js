const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getHouse, addHouse, getHouses, deleteHouse, updateHouse} = require('./house.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getHouses)
router.get('/:_id', getHouse)
router.post('/', addHouse)
// router.put('/:id',  requireAuth, updateHouse)
router.put('/:_id', updateHouse)
// router.delete('/:id',  requireAuth, requireAdmin, deleteHouse)
router.delete('/:_id',  deleteHouse)

module.exports = router