module.exports = connectSockets

const chatMap = {}

function connectSockets(io) {
  io.on('connection', socket => {
    socket.on('onChatMsg', msg => {
      if (!chatMap[socket.houseId]) chatMap[socket.houseId] = []
      chatMap[socket.houseId].push(msg)
      io.to(socket.houseId).emit('chatMsg', msg)
    })

    socket.on('onIsTyping', name => {
      io.to(socket.houseId).emit('isTyping', name)
    })

    socket.on('onUserLogin', userId => {
      socket.join(userId)
      socket.userId = userId
    })
 
    socket.on('onBookingAdded', msg => {
      io.to(msg.hostId).emit('userMsg', {
        type: `success`,
        title: `Order Received!`,
        txt: `
        ${msg.booking.guestUser.fullName} has ordered ${msg.booking.house.name}
        <br>From: ${_formatDate(msg.booking.checkIn)}
        <br>To: ${_formatDate(msg.booking.checkOut)}
        `,
        // <br> <a href="#/">View Order</a>
      })
    })

    socket.on('onJoinHouseChat', houseId => {
      socket.leave(socket.houseId)
      socket.join(houseId)
      socket.houseId = houseId
      if (chatMap[houseId])
        io.to(houseId).emit('chatLoadHistory', chatMap[houseId])
    })

    socket.on('onLeaveHouseChat', () => {
      socket.leave(socket.houseId)
      delete socket.houseId
    })

    socket.on('disconnect', () => {})
  })
}

function _formatDate(date) {
  return new Date(date).toLocaleDateString('en-us', {
    timeZone: 'utc',
    month: 'short',
    day: 'numeric',
  })
}
