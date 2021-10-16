window.onload = async () => {
  getSong();
}

const musicContent = document.querySelector(".container-app");
const listSong = document.querySelector('.list-music');
const timesong = document.querySelector(".duration-time");
const currentTimeDisplay = document.querySelector(".current-time");
var songIndex = 0;
const audioContext = new AudioContext(), analyser = new AnalyserNode(audioContext, { fftSize: 2048 })
const music = new Audio();
const audio = document.querySelector("#audio");
const progressBar = document.querySelector(".music-progress-bar");
const avatar = document.getElementById("section1");
const togglePlayPause = document.getElementById('toggle-play-pause');
const btnNext = document.querySelector(".btn-next");
const btnPrev = document.querySelector(".btn-prev");
const source = audioContext.createMediaElementSource(music);
var request = new XMLHttpRequest();
var arraySongs = [];
audio.volume = 0;

/* get song and push in array */
getSong = async () => {
  let songs = document.querySelectorAll(".list-music-item");
  for (let i = 0; i < songs.length; i++) {
    arraySongs.push(songs[i].getAttribute("data-music"));
  }
  loadSong();
}

loadSong = async () => {
  song = songIndex;
  audio.src = arraySongs[song];
  audio.addEventListener('loadedmetadata', () => {
    const time = formatTime(audio.duration);
    timesong.textContent = time;
  })
  /*get url and analyser*/
  request.open('GET', audio.src, true);
  request.responseType = 'blob';
  request.onload = function () {
    music.src = window.URL.createObjectURL(request.response);
    connectAudioToAnalyser(music, analyser, audioContext);
  }
  request.send();
  draw();
}


formatTime = (second) => {
  let hours = Math.floor(second / 3600);
  let minutes = Math.floor((second - hours * 3600) / 60);
  let seconds = Math.floor(second - hours * 3600 - minutes * 60);
  hours = hours < 10 ? (hours > 0 ? '0' + hours : 0) : hours;
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return (hours !== 0 ? hours + ':' : '') + minutes + ':' + seconds;
}

updateProgressTime = (e) => {
  const { currentTime, duration } = e.srcElement;
  currentTimeDisplay.textContent = formatTime(currentTime);
}
audio.addEventListener("timeupdate", updateProgressTime);




music.addEventListener('ended', () => {
  togglePlayPause.checked = false;
})

music.addEventListener('timeupdate', () => {
  progressBar.value = music.currentTime;
})

progressBar.addEventListener('change', event => {
  music.currentTime = event.target.value;
  music.play();
  togglePlayPause.checked = true;
})

togglePlayPause.addEventListener('change', event => {
  if (event.target.checked) {
    music.play();
    audio.play();
  }

  else {
    music.pause();
    audio.pause();
  }

})
btnNext.addEventListener("click", () => {

	nextSong();
	setTimeout(() => {
		playSong();
    music.play();
	}, 400)
})
btnPrev.addEventListener("click", () => {
	prevSong();
	setTimeout(() => {
		playSong();
    music.play();
	}, 400)
})


nextSong = () => {
	songIndex++;
	if (songIndex > arraySongs.length - 1) {
		songIndex = 0;
	}
	loadSong(songIndex);
}
prevSong = () => {
	songIndex--;
	if (songIndex < 0) {
		songIndex = arraySongs.length - 1;
	}
	loadSong(songIndex);
}

document.addEventListener('keypress', event => {
  if (event.key === ' ') {
    if (!togglePlayPause.checked) {
      music.play()
    } else {
      music.pause()
    }
    togglePlayPause.checked = !togglePlayPause.checked
  }
})

const connectAudioToAnalyser = (audioElement, analyserNode, context) => {
  const canplayHandler = () => {
    audioElement.pause()
    togglePlayPause.checked = false

    progressBar.setAttribute('max', audioElement.duration)
    progressBar.setAttribute('value', 0)

    source.connect(analyserNode)
    analyser.connect(context.destination)

    audioElement.removeEventListener('canplay', canplayHandler)
  }
  audioElement.addEventListener('canplay', canplayHandler)
}

function draw() {
  setTimeout(() => requestAnimationFrame(draw), 50)

  const dataArray = new Uint8Array(analyser.frequencyBinCount)
  analyser.getByteTimeDomainData(dataArray)

  const oneThirdLength = Math.floor(dataArray.length / 3),
    dataSections = [
      dataArray.slice(0, oneThirdLength),
      dataArray.slice(oneThirdLength, oneThirdLength * 2),
      dataArray.slice(oneThirdLength * 2)
    ],
    dataAverages = dataSections.map(
      section => section.reduce(
        (total, next) => total + next
      ) / section.length
    ),
    updateValue = (sectionElement, original, maxChange) =>
      sectionElement.style.transform =
      `scale(${(((dataAverages[0] / 128) - 1) * maxChange) + 1})`

  updateValue(section1, 20, 0.2)

}
