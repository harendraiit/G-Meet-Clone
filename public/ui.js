// User Interface buttons
// enables button to the stream given in the function


function toggleBtn(btn) {
	btn.toggleClass("btn-danger");
}

function toggleScreenShareBtn() {
	$("#screen-share-btn").toggleClass("btn-danger");
}

function toggleVisibility(elementID, visible) {
	if (visible) {
		$(elementID).attr("style", "display:block");
	} else {
		$(elementID).attr("style", "display:none");
	}
}

function toggleMic(localStream) {
	toggleBtn($("#mic-btn")); // toggle button colors
	// toggle the mic icon
	var mic_button = document.getElementById("mic-icon");

	if (mic_button.innerHTML == "mic_off") {
		mic_button.innerHTML = "mic";
		localStream.unmuteAudio(); // enable the local mic
		toggleVisibility("#mute-overlay", false); // hide the muted mic icon
	} else {
		mic_button.innerHTML = "mic_off";
		localStream.muteAudio(); // mute the local mic
		toggleVisibility("#mute-overlay", true); // show the muted mic icon
	}
}

function toggleVideo(localStream) {
	toggleBtn($("#video-btn")); // toggle button colors
	var vid_button = document.getElementById("video-icon");
	if (vid_button.innerHTML == "videocam_off") {
		vid_button.innerHTML = "videocam";
		localStream.unmuteVideo(); // enable the local video
		toggleVisibility("#no-local-video", false); // hide the user icon when video is enabled
	} else {
		vid_button.innerHTML = "videocam_off";
		localStream.muteVideo(); // disable the local video
		toggleVisibility("#no-local-video", true); // show the user icon when video is disabled
	}
}