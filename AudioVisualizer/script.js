window.onload = () => {
	window.onclick = start;
	function start() {
		window.onclick = () => {};
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
				const y = audioValue * 80;
				document.getElementById("bar" + x).style.height = y + 4 + "vh";
				document.getElementById("bar" + x).style.top = 50 - y / 2 - 2 + "vh";
			}
			requestAnimationFrame(render);
		}
		requestAnimationFrame(render);
		// Make a audio node
		const audio = new Audio();
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
		audio.src = "./alone.mp3";
		audio.load();
		function handleCanplay() {
			// connect the audio element to the analyser node and the analyser node
			// to the main Web Audio context
			const source = context.createMediaElementSource(audio);
			source.connect(analyser);
			analyser.connect(context.destination);
		}
	}
};