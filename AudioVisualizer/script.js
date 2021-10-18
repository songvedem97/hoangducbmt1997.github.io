
const play = document.querySelector('body');
const avatar = document.querySelector("#bar10");
var isPlay = false;
var offsetHeight = document.getElementById('bar10').offsetHeight;
avatar.style.animationPlayState = 'paused';
var listSongs = new Array('./naruto-1.mp3','./naruto-2.mp3','./naruto-3.mp3');
var i = 0;
var audio = new Audio();


play.addEventListener('click', () => {
	if (isPlay == false) {
		start();
		avatar.style.animationPlayState = 'running';
		isPlay = true;
	}
})


function start() {
	window.onclick = () => { };

	// make a Web Audio Context
	const context = new AudioContext();
	const analyser = context.createAnalyser();
	// Make a buffer to receive the audio data
	const numPoints = analyser.frequencyBinCount;
	const audioDataArray = new Uint8Array(numPoints);
	function render() {
		// get the current audio data
		analyser.getByteFrequencyData(audioDataArray);
		// draw a point every size pixels
		for (let x = 1; x <= 16; x++) {
			// compute the audio data for this point
			const ndx = ((x * numPoints) / 16) | 0;
			// get the audio data and make it go from 0 to 1
			const audioValue = audioDataArray[ndx] / 255;
			// draw a rect size by size big
			const y = audioValue * 40;

			if (x != 1) {
				document.getElementById("bar" + x).style.height = y + offsetHeight / 6 + "vh";
				document.getElementById("bar" + x).style.width = y + offsetHeight / 6 + "vh";

			}
			else {
				const opacity = 0.4 + (y / 50);
				document.getElementById("bar" + x).style.opacity = opacity;

			}

			/*
			document.getElementById("bar" + x).style.animationDuration = 20 - y / 7 + "s";*/
		}


		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
	// Make a audio node

	audio.autoplay = true;
	// this line is only needed if the music you are trying to play is on a
	// different server than the page trying to play it.
	// It asks the server for permission to use the music. If the server says "no"
	// then you will not be able to play the music
	// Note if you are using music from the same domain
	// **YOU MUST REMOVE THIS LINE** or your server must give permission.
	audio.crossOrigin = "anonymous";
	// call `handleCanplay` when it music can be played
	audio.addEventListener("canplay", handleCanplay);
	audio.addEventListener('ended', () => {
		i = ++i < listSongs.length ? i : 0;
		audio.src = listSongs[i];
		audio.play();
	})
	audio.src = listSongs[0];

	function handleCanplay() {
		// connect the audio element to the analyser node and the analyser node
		// to the main Web Audio context
		const source = context.createMediaElementSource(audio);
		source.connect(analyser);
		analyser.connect(context.destination);
	}


}
