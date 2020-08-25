
function verify(data) {
  const grawlix = global.grawlix

  if (!data) return "Data packet was not found." // get outta here no data havin' ass [lol]

  var parsedData = JSON.parse(data)
  if (!parsedData) return "There was an error parsing data."

  if (!parsedData.author) return "Data packet was sent w/o an author token."
  if (!parsedData.messagePacket) return "Data packet was sent w/o a message packet." // message packet should include: "message" and "serverId"

  if (!parsedData.messagePacket.message) return "Message packet was sent w/o a message."
  if(!parsedData.messagePacket.serverId) return "Message packet was sent w/o a server destination."

  var msg = grawlix(parsedData.messagePacket.message); // grawlix should filter out racial slurs / other filters that are applied.

  if (msg.length > 2000) return `Message is over 2K characters. [${msg.length}]`

  var directionId = parsedData.messagePacket.serverId
  var author

  // gotta add something eventually to verify if sender is using someone else's userid
  // probably a token verification-type thing discord uses
  require(global.rootDir + "/modules/getUserData.js")(parsedData.author, null, function(userData){

    if (userData.error) 
      return `UserData Module had an error. [${userData.error}]`;

  
    if (!userData.username) 
      return "There was an error. [USERNAME WAS RETURNED NULL]";

    if (!userData.uId)
      return "There was an error. [USERID WAS RETURNED NULL]";
		console.log(msg);
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

    global.io.emit("messageRecieved",JSON.stringify(dataSendback))

    require(`${global.rootDir}/modules/saveMessage.js`)(dataSendback);

		// this is probs gonna need a callback too but idk, just remove this return for now
    //return "There were not any errors with the request, sending message data to client."
	});
}

module.exports = verify;