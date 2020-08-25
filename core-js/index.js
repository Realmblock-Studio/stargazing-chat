

// loading screen

var socket = io()

function hideLoading() {
  document.getElementById("loading-screen").style.opacity = 0;
	
  setTimeout(function(){
	  document.getElementById("loading-screen").style.display = "none";
	}, 500)
}

function showLoading() {
  document.getElementById("loading-screen").style.opacity = 0;
	document.getElementById("loading-screen").style.display = "";
	document.getElementById("loading-screen").style.opacity = 1;
}

socket.on("connect", ()=>{
	hideLoading()
})

socket.on("reconnect", ()=>{
	hideLoading()
})

socket.on("disconnect", ()=>{
  showLoading()
})

// mobile sidebar toggle

var sidebarButton = document.getElementById("sidebar-toggle");
var sidebar = document.getElementsByClassName("sidebar")[0];
var mainContent = document.getElementsByClassName("main-content")[0];
var sidebarEnabled = true

sidebarButton.onclick = function(){
	if (sidebarEnabled){
		sidebar.style.display = "none";
		mainContent.style.width = "100%";
	} else {
		sidebar.style.display = "";
		mainContent.style.width = "calc(100% - 325px)";
	}
	sidebarEnabled = !sidebarEnabled;
}

// local functions

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
// yoinked off quirksmode.org/js/cookies.html

// message reciever

socket.on("messageRecieved", (data) => {
  console.log(data)
})

// dark mode light mode

if (getCookie("theme") != null) { // check cookies for  the "theme" cookie.
  var cookie = getCookie("theme")
  console.log(cookie)

  if (cookie == "light"){
	  document.documentElement.setAttribute('data-theme', 'light');
    dark = false;
  } else if (cookie == "dark") {
    document.documentElement.setAttribute('data-theme', 'dark');
    dark = true;
  }
} else {
  dark = true;
}


var darkmodetransition = document.createElement('style');
document.head.appendChild(darkmodetransition);
var dark = true
var toggleButton = document.getElementById("theme-toggle");

toggleButton.onclick = function(){
	if (dark){
		darkmodetransition.innerText = `* {transition: .1s linear !important; }`;
		document.documentElement.setAttribute('data-theme', 'light');
    document.cookie = "theme=light; Path=/";
		setTimeout(function(){
			darkmodetransition.innerText = `* {}`
		}, 150)
	} else {
		darkmodetransition.innerText = `* {transition: .1s linear !important; }`;
		document.documentElement.setAttribute('data-theme', 'dark');
    document.cookie = "theme=dark; Path=/";
		setTimeout(function(){
			darkmodetransition.innerText = `* {}`
		}, 150)
	}
	dark = !dark;
}

// send message test v1

function sendMessage(directionId, message) { // directionId is either a userid or server id.
  if (!directionId) return "There was no specified directionId."
  if (!message) return "The sent message packet was nil."

  if (message.length > 2000) return `Message is over 2K characters. [${message.length}]`

  var token = getCookie("token")

  if (!token) return "User does not have a token cookie."

  var messagePacket = {
    author: token,

    messagePacket: {
      message: message,
      serverId: directionId
    }
  }

  console.log("a")

  socket.emit("messageRequest",JSON.stringify(messagePacket))

  console.log("b")

  return "pog it'll work"

}

// sign-up test v1

document.getElementById("signup-confirm").onclick = function(){
	var username = document.getElementById("signup-username").value;
	var tag = document.getElementById("signup-tag").value;
	var password = document.getElementById("signup-password").value;
	password = CryptoJS.AES.encrypt(password, tag+username).toString();
	axios.post("/signup", {username: username, tag: tag, password: password})
	.then(data=>{
		var data = data.data
		document.getElementById("res-id").innerText = data.result;
		document.getElementById("res-data").innerText = data.message;
	})
	.catch(err=>{
		console.log(err);
	})
}

// log-in test v1

document.getElementById("login-confirm").onclick = function(){
	var username = document.getElementById("login-username").value;
	var tag = document.getElementById("login-tag").value;
	var password = document.getElementById("login-password").value;
	password = CryptoJS.AES.encrypt(password, tag+username).toString();
	axios.post("/login", {username: username, tag: tag, password: password})
	.then(data=>{
		var data = data.data
		document.getElementById("res-id").innerText = data.result;
		document.getElementById("res-data").innerText = data.message;
    
    if (data.token) {
      document.cookie = `token=${data.token}; Path=/`
    }
	})
	.catch(err=>{
		console.log(err);
	})
}

// server list update



// server buttons instancing

var selectedServer = null

var serverButton = document.getElementsByClassName("sidebar-object")[0].cloneNode(true);
document.getElementsByClassName("sidebar-object")[0].parentNode.removeChild(document.getElementsByClassName("sidebar-object")[0])

function createServerButton(name,icon){
	var btn = serverButton.cloneNode(true);	
	btn.getElementsByClassName("object-label")[0].innerText = name;
	btn.getElementsByClassName("object-avatar")[0].src = icon;
	document.getElementById("sidebar-list").appendChild(btn);
	return btn;
}

function resetSidebarList(){
	document.getElementById("sidebar-list").innerHTML = "";
}

socket.on("updateServerList", function(data){
	data.forEach(info=>{
		var button = createServerButton(info.serverInfo.serverName, info.serverInfo.serverIcon)
		var serverId = info.directionId;
		console.log(button);
		button.id = "server-" + serverId.toString();
		button.onclick = function(){
			console.log("hi")
			if (selectedServer == button)
				return;
			button.setAttribute("aria-selected", "true");
			if (selectedServer)
				selectedServer.setAttribute("aria-selected", "false");
			
			selectedServer = button;
			// TODO: load everything when clicked lol
		}
	})
})

document.getElementById("servers-tab").onclick = function(){
	if(document.getElementById("servers-tab").getAttribute("aria-selected") === "false"){
		resetSidebarList();
	}
	document.getElementById("servers-tab").setAttribute("aria-selected", "true");
	document.getElementById("users-tab").setAttribute("aria-selected", "false");
	socket.emit("getServers", {token: getCookie("token")})
}

document.getElementById("users-tab").onclick = function(){
	if(document.getElementById("users-tab").getAttribute("aria-selected") === "false"){
		resetSidebarList();
	}
	document.getElementById("users-tab").setAttribute("aria-selected", "true");
	document.getElementById("servers-tab").setAttribute("aria-selected", "false");
	socket.emit("getUsers", {token: getCookie("token")})
}

socket.emit("getServers", {token: getCookie("token")})