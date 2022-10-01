const socket = io('/')
const videoGrid = document.getElementById('video-grid')
//const chat = document.getElementById('chat-box')
const messages=document.getElementById('main__chat__window')
let mystream;
const myPeer = new Peer()
const myVideo = document.createElement('video') 
myVideo.muted = true
myVideo.classList.add("user-video");
const peers = {}

myPeer.on('open', id => {
  console.log(id)
  socket.emit('join-room', ROOM_ID, id)
  getmedia()  
})

const onactive = () => {
  socket.emit('gotpermission')
}
const getmedia = function () {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  
  }).then(stream => {

    onactive()
    addVideoStreammine(myVideo, stream)
    mystream = stream
    myPeer.on('call', call => {
      console.log("request id: ", myPeer.id)
      call.answer(stream)
      const video = document.createElement('video')
      video.classList.add("user-video");
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
      call.on('close', () => {
        video.remove()
      })
      
    
    })
   socket.on('user-connected', userId => {
      console.log("User Connected " + userId)
      connectToNewUser(userId, stream)
    })
    socket.on('message', (mes) => {
      shower(mes)
    })
    socket.on('share-screen', (screenid, userId) => {
      const cal = myPeer.call(screenid, stream)
      v = document.createElement('video')
      v.classList.add("user-video");
      cal.on('stream', (s) => {
        addVideoStream(v, s)
      })
      cal.on('close', () => {
        v.remove()
      })
    })

  })
}


socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})




function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  video.classList.add("user-video");
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
  ResizeGrid();
}
function addVideoStreammine(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
  ResizeGrid();
}
// function copier()
// { navigator.clipboard.writeText(window.location.href);
//   document.getElementById("button").innerHTML = "Link Copied!";
//   setTimeout( function() {
//       document.getElementById("button").innerHTML = "Link";
//                          }, 1500);}
// function timer()
// {
//   const timevar = document.getElementById('timer');
//   let time = 0;
//        setInterval(()=>{
//        timevar.innerText="Active Time: " + String(time) + " Seconds"
//        time++
//      },1000)}
 
const playstop = () => {
  if (mystream.getVideoTracks().length > 0) {
  
    let enabled = mystream.getVideoTracks()[0].enabled;
    if (enabled) {
      mystream.getVideoTracks()[0].enabled = false;
      document.getElementById("video-icon").innerHTML = "videocam_off";
      
    } else {
      mystream.getVideoTracks()[0].enabled = true;
      document.getElementById("video-icon").innerHTML = "videocam";
    }
  } else {
    // document.getElementById("svideo").innerHTML = "No Video source";
  }
    };
    
const muteunmute = () => {
  if (mystream.getAudioTracks().length > 0) {
    
    const enabled = mystream.getAudioTracks()[0].enabled;
    if (enabled) {
        
      mystream.getAudioTracks()[0].enabled = false;
      document.getElementById("mic-icon").innerHTML = "mic_off";

    } else {
        
      mystream.getAudioTracks()[0].enabled = true;
      document.getElementById("mic-icon").innerHTML = "mic";
       
    }
  } else {
     //document.getElementById("mute").innerHTML = "No audio source";
  }
    };


const message = () => {
  var html = $("#text").froalaEditor("html.get");
  div=document.createElement('div')
  div.innerHTML =  $("#text").froalaEditor("html.get");
  div.className = "message"
  div.setAttribute('align', 'right')
  messages.appendChild(div)
 socket.emit('message', $("#text").froalaEditor("html.get"))
}
const shower = (mes) => {
  div=document.createElement('div')
  div.innerHTML = mes;
  div.className = "message"
  div.setAttribute('align','left')
  messages.appendChild(div)

}
var display_remove = 0;
let nPeer;
let screenshare

const displayscreen = () => {
  if (display_remove == 0) {
    display_remove = 1
    nPeer = new Peer()
    
    navigator.mediaDevices.getDisplayMedia(
      {
        video: true,
        audio: true
      }
    ).then((stream) => {
      screenshare=stream
      socket.emit('share-screen', nPeer.id)
      nPeer.on('call', (call) => {
        
        call.answer(stream)
      })

      document.getElementById("screen-share-icon").innerHTML = "stop_screen_share"
      stream.oninactive = function () {

        console.log('ended')
        document.getElementById("screen-share-icon").innerHTML = "screen_share"
        nPeer.destroy()
        display_remove=0
  };


    })
  } else {
  
    display_remove = 0
    document.getElementById("screen-share-icon").innerHTML = "screen_share"
    let all_tracks=screenshare.getTracks()
    all_tracks.forEach(track => track.stop());
 
   
  }

}
function setup() {

	// Froala Editor Settings for different type of screen sizes

	$("#text").froalaEditor({
		toolbarButtons: [
			"insertImage",
			"insertVideo",
			"insertFile",
			"insertLink",
			"|",
			"color",
			"|",
            "specialCharacters",
		],
		toolbarButtonsMD: [
			"insertLink",
			"insertImage",
			"insertVideo",
			"insertFile",
			"|",
			"specialCharacters",
			"|",
			"color",
		],
		toolbarButtonsSM: [
			"insertLink",
			"insertImage",
			"insertVideo",
			"insertFile",
			"|",
			"color",
			"|",
			"specialCharacters",
		],
		toolbarButtonsXS: [
			"insertImage",
			"insertVideo",
			"insertLink",
			"insertFile",
			"|",
			"specialCharacters",
			"|",
			"color",
		],

		theme: "gray",
		heightMin: 80,
		heightMax: 80,
		width: "100%",
		imageDefaultWidth: 50,
		requestWithCORS: true,
		imageResizeWithPercent: true,
		charCounterCount: true,
		toolbarBottom: true,
		tabSpaces: 4,
	});
	// remove agora unlicensed product div after the page loads
	var unlicensed_box = document.getElementsByClassName("fr-box")[0];
	if (
		unlicensed_box &&
		unlicensed_box.childNodes.length >= 2 &&
		unlicensed_box.childNodes[1].tagName == "DIV" &&
		unlicensed_box.childNodes[1].style.position == "absolute"
	) {
		unlicensed_box.childNodes[1].remove();
	}
}
setup();