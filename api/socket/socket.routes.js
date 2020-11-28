module.exports = connectSockets

const chatMap = {}

function connectSockets(io) {
  io.on('connection', socket => {
    socket.on('chatAddMsg', msg => {
      if (!chatMap[socket.myTopic]) chatMap[socket.myTopic] = []
      chatMap[socket.myTopic].push(msg)
      io.to(socket.myTopic).emit('chatAddMsg', msg)
    })

    socket.on('isTyping', name => {
      io.to(socket.myTopic).emit('isTyping', name)
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
        <br> <a href="#/">View Order</a>
        `,
      })
    })

    socket.on('chatTopic', topic => {
      if (socket.myTopic) socket.leave(socket.myTopic)
      if (topic) {
        socket.join(topic)
        socket.myTopic = topic
      } else delete socket.myTopic
      if (chatMap[topic]) io.to(topic).emit('chatLoadHistory', chatMap[topic])
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
