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
    
    socket.on('chatTopic', topic => {
      if (socket.myTopic) socket.leave(socket.myTopic)
      socket.join(topic)
      socket.myTopic = topic
      if (chatMap[topic]) io.to(topic).emit('chatLoadHistory', chatMap[topic])
    })
    
    socket.on('disconnect', () => {})
  })
}
