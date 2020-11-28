const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
  query,
  getById,
  remove,
  update,
  add,
}

async function query(query) {
  const collection = await dbService.getCollection('house')
  try {
    const criteria = _buildCriteria(query)
    const houses = await collection.find(criteria).toArray()
    const housesSorted = _housesSorter(houses, query)
    const housesPaged = _housesPager(housesSorted, query)
    return { houses: housesPaged, housesLength: housesSorted.length }
  } catch (err) {
    console.log('ERROR: cannot find houses')
    throw err
  }
}

async function remove(houseId) {
  const collection = await dbService.getCollection('house')
  try {
    return await collection.deleteOne({ _id: ObjectId(houseId) })
  } catch (err) {
    console.log(`ERROR: cannot remove house ${houseId}`)
    throw err
  }
}

async function getById(houseId) {
  const collection = await dbService.getCollection('house')
  try {
    return await collection.findOne({ _id: ObjectId(houseId) })
  } catch (err) {
    console.log(`ERROR: cannot remove house ${houseId}`)
    throw err
  }
}

async function update(house) {
  const collection = await dbService.getCollection('house')
  house._id = ObjectId(house._id)
  try {
    await collection.findOneAndUpdate({ _id: house._id }, { $set: house })
    return house
  } catch (err) {
    console.log(`ERROR: cannot update house ${house._id}`)
    throw err
  }
}

async function add(house) {
  const collection = await dbService.getCollection('house')
  try {
    await collection.insertOne(house)
    return house
  } catch (err) {
    console.log(`ERROR: cannot insert house`)
    throw err
  }
}

function _buildCriteria(query) {
  const criteria = {}
  if (query.txt) {
    if (!criteria.$or) criteria.$or = []
    const regex = new RegExp(query.txt.split(/,|-| /).join('|'), 'i')
    criteria.$or.push({ 'location.city': regex }, { 'location.country': regex })
  }
  if (query.adults) {
    var total = +query.adults
    if (query.kids) total += +query.kids
    if (query.infants) total += +query.infants
    if (!criteria.$or) criteria.$or = []
    criteria.capacity = { $gte: total } 
  }
  return criteria
}

function _housesSorter(houses, { sortBy = 'name' }) {
  return houses.sort((a, b) => {
    return a[sortBy].toString() >= b[sortBy].toString() ? 1 : -1
  })
}

function _housesPager(houses, { page = 1, limit = 10 }) {
  return houses.filter(
    (house, idx) => idx >= page * limit - limit && idx <= page * limit - 1
  )
}
