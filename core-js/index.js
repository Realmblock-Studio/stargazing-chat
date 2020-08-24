

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

// 1 second check to see if server is up [soon]

/*
function connectionCheck() {
  setTimeout(function() {
    console.log("monkey")
    fetchUrl("/connection", function(error,meta,body) {
      var bod = body.toString()
      console.log(bod)

      if (bod != "true") {
        showLoading()
      } else {
        hideLoading()
      }
    })

    connectionCheck();
  }, 1000)
}

connectionCheck();
*/

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

// sign-up test v1

document.getElementById("signup-confirm").onclick = function(){
	var username = document.getElementById("signup-username").value;
	var tag = document.getElementById("signup-tag").value;
	var password = document.getElementById("signup-password").value;
	password = CryptoJS.AES.encrypt(password, tag+username).toString();
	axios.post("/createAccount", {username: username, tag: tag, password: password})
	.then(data=>{
		var data = data.data
		document.getElementById("res-id").innerText = data.result;
		document.getElementById("res-data").innerText = data.message;
	})
	.catch(err=>{
		console.log(err);
	})
}