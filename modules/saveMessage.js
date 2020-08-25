
/*

    var dataSendback = {

      'senderPacket' : {
        'avatar' : null,
        'username' : userData.username,
        'uId' : userData.uId,
      },

      'messagePacket' : {
        'message' : msg,
        'timestamp' : Date.now(),
        'directionId' : directionId
      }

    }

*/

function saveMessage(messagePacket) {
  // message packet should include the author, directionid, etc...

  if (!messagePacket) return "messagePacket was null."

  if (!messagePacket.messagePacket) return "messagePacket was sent without the actual messagePacket." 
  if (!messagePacket.messagePacket.message) return "Message was not found."
  if (!messagePacket.messagePacket.timestamp) return "Message was sent without a timestamp."
  if (!messagePacket.messagePacket.directionId) return "Message was sent without a direction id."

  if (!messagePacket.senderPacket) return "messagePacket was sent without a senderPacket."
  if (!messagePacket.senderPacket.username) return "senderPacket was sent without a username."
  if (!messagePacket.senderPacket.uId) return "senderPacket was sent without a userid."

  var directionId = messagePacket.messagePacket.directionId
  var user = messagePacket.senderPacket.uId
  var msg = messagePacket.messagePacket.message

  global.client.db("chat").collection("servers").findOne({directionId: directionId},(err, result)=>{

    if (result) {
      console.log(result)
      var searchFilter = result
      // u can finish this have fun
      var existingMessages = result.messages
      existingMessages.push({sender:user,message:msg,timestamp:messagePacket.messagePacket.timestamp})

      var replacement = result
      replacement.messages = existingMessages

      console.log(replacement)

      global.client.db("chat").collection("servers").updateOne({directionId: directionId}, {$set: {messages: existingMessages}}, function(err,res) {
        if (err) throw err; 
        console.log("added a message to " + directionId)
      })

    } else {
      return "DirectionId was invalid."
    }
  })

}

module.exports = saveMessage;