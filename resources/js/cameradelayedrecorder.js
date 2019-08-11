var recorder, videoElem;
var continueRecording = false;
var displayCountDown = true;

function startRecording() {
	continueRecording = true;
	if (displayCountDown) {
		startCountDown();
	}
	recorder.start();
	window.setTimeout(function() {
		recorder.stop();
		if (continueRecording) {
			startRecording();
		}
	}, getDelay() * 1000);
}

var countDown;
function startCountDown() {
	displayCountDown = false;
	var seconds = getDelay();
	document.getElementById("count-down-container").classList.remove("hidden");
	showCountDown(seconds)
	countDown = window.setInterval(function() {
		seconds--;
		if (seconds <= 0) {
			document.getElementById("count-down-container").classList
					.add("hidden");
			window.clearInterval(countDown);
		} else {
			showCountDown(seconds)
		}
	}, 1000);
}

function showCountDown(seconds) {
	document.getElementById("count-down-container").innerHTML = seconds;
}

function stopRecording() {
	document.getElementById("count-down-container").classList.add("hidden");
	window.clearInterval(countDown);
	displayCountDown = true;
	continueRecording = false;
	videoElem.pause();
	videoElem.src = "";
}

function increaseDelay() {
	var currentDelay = getDelay();
	setDelay(currentDelay + 1);
}

function decreaseDelay() {
	var currentDelay = getDelay();
	if (currentDelay > 0) {
		setDelay(currentDelay - 1);
	}
}

function getDelay() {
	return parseInt(document.getElementById("delay-value").textContent);
}

function setDelay(delay) {
	document.getElementById("delay-value").textContent = delay;
}

document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("start-btn").addEventListener('click',
			startRecording);
	document.getElementById("stop-btn")
			.addEventListener('click', stopRecording);
	document.getElementById("increase-btn").addEventListener('click',
			increaseDelay);
	document.getElementById("decrease-btn").addEventListener('click',
			decreaseDelay);
	videoElem = document.querySelector('video');
	var constraints = {
			audio : false,
			video : true
	};
	navigator.mediaDevices.getUserMedia(constraints).then(function(liveStream) {
		recorder = new MediaRecorder(liveStream);
		document.getElementById("start-btn").classList.remove("hidden");
		document.getElementById("stop-btn").classList.remove("hidden");
		recorder.ondataavailable = function(event) {
			if (continueRecording) {
				videoElem.src = URL.createObjectURL(event.data);
				videoElem.play();
			}
		};
	});
});
