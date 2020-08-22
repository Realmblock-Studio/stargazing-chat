
function getUser(userId, socket) {
  var userData = {
  
    'id' : '2371',
    'avatar' : null,
    'username' : 'Akkoza'
  
  }

  if (!userData.username) return "Requested ID does not have a username."
  
  return userData

}

module.exports = getUser;