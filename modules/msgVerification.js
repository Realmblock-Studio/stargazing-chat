
function verify(data,socket) {
  const grawlix = global.grawlix
  //socket.emit("messageRecieved", data);

  if (!data) return "Data packet was not found." // get outta here no data havin' ass [lol]

  var parsedData = JSON.parse(data)
  if (!parsedData) return "There was an error parsing data."

  if (!parsedData.author) return "Data packet was sent w/o author id."
  if (!parsedData.messagePacket) return "Data packet was sent w/o a message packet." // message packet should include: "message", "timestamp", and "serverId"

  if (!parsedData.messagePacket.message) return "Message packet was sent w/o a message."
  if(!parsedData.messagePacket.serverId) return "Message packet was sent w/o a server destination."

  var msg = grawlix(parsedData.messagePacket.message); // grawlix should filter out racial slurs.
  var server = parsedData.messagePacket.serverId
  var author = parsedData.author

  // gotta add something eventually to verify if sender is using someone else's userid

  var dataSendback = {

    'sender' : author,

    'messagePacket' : {
      'message' : msg,
      'timestamp' : Date.now(),
      'server' : server
    }

  }

  socket.emit("messageRecieved",JSON.stringify(dataSendback))

  return "There were not any errors with the request, sending message data to client."

}

module.exports = verify;