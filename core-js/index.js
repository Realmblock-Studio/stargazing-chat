

// loading screen

var socket = io()

function hideLoading() { //"signup-content"
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

// detect if user has a token or not

function tokenCheck() {
  if (!getCookie("token")) {
    document.getElementById("signup-content").style.opacity = 1;
    document.getElementById("signup-content").style.display = "";
  } else {
    document.getElementById("signup-content").style.opacity = 0;
    document.getElementById("signup-content").style.display = "none";
  }
}
tokenCheck()

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

  socket.emit("messageRequest",JSON.stringify(messagePacket))
}

// sign-up test v1

document.getElementById("sign-up").onclick = function(){
	var username = document.getElementById("sign-username").value;
	var tag = document.getElementById("sign-tag").value;
	var password = document.getElementById("sign-password").value;
	password = CryptoJS.AES.encrypt(password, tag+username).toString();
	axios.post("/signup", {username: username, tag: tag, password: password})
	.then(data=>{
		var data = data.data

		// prompt
    if (data.token) {
      document.cookie = `token=${data.token}; Path=/`
    }
		if (data.result == 1){
			location.reload();
		}
	})
	.catch(err=>{
		console.log(err);
	})
}
document.getElementById("log-in").onclick = function(){
	var username = document.getElementById("sign-username").value;
	var tag = document.getElementById("sign-tag").value;
	var password = document.getElementById("sign-password").value;
	password = CryptoJS.AES.encrypt(password, tag+username).toString();
	axios.post("/login", {username: username, tag: tag, password: password})
	.then(data=>{
		var data = data.data

		// prompt
    if (data.token) {
      document.cookie = `token=${data.token}; Path=/`
    }
		if (data.result == 1){
			location.reload();
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
	resetSidebarList();
	data.forEach(info=>{
		var button = createServerButton(info.serverInfo.serverName, info.serverInfo.serverIcon)
		var serverId = info.directionId;
		button.id = "server-" + serverId.toString();
		console.log(info);
		button.onclick = function(){
			if (selectedServer == button)
				return;
			button.setAttribute("aria-selected", "true");
			if (selectedServer)
				selectedServer.setAttribute("aria-selected", "false");
			
			selectedServer = button;
			loadTopbar(info);
			// TODO: load everything when clicked lol
		}
	})
})

document.getElementById("servers-tab").onclick = function(){
	if(document.getElementById("servers-tab").getAttribute("aria-selected") === "true")
		return;

	resetSidebarList();
	loadTopbar();
	document.getElementById("servers-tab").setAttribute("aria-selected", "true");
	document.getElementById("users-tab").setAttribute("aria-selected", "false");
	socket.emit("getServers", {token: getCookie("token")})
}

document.getElementById("users-tab").onclick = function(){
	if(document.getElementById("users-tab").getAttribute("aria-selected") === "true")
		return;

	resetSidebarList();
	loadTopbar();
	document.getElementById("users-tab").setAttribute("aria-selected", "true");
	document.getElementById("servers-tab").setAttribute("aria-selected", "false");
	socket.emit("getUsers", {token: getCookie("token")})
}

socket.emit("getServers", {token: getCookie("token")})


// 	load channel data
// object-avatar title-members title-name

function loadTopbar(info){
	var avatar = document.getElementById("object-avatar")
	var members = document.getElementById("title-members")
	var name = document.getElementById("title-name")
	if (!info)
		info = {serverInfo: {serverName: "", serverIcon:""}, members:""};

	name.innerText = info.serverInfo.serverName
	avatar.src = info.serverInfo.serverIcon
	if (info.members === 1)
		members.innerText = info.members + " Member";
	else if (info.members === "")
		members.innerText = info.members + "";
	else
		members.innerText = info.members + " Members";

}
loadTopbar();