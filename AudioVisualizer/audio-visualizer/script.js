const audioContext = new AudioContext(),
  analyser = new AnalyserNode(audioContext, {
    fftSize: 2048
  })
const music = new Audio(),
  scrubRuler = document.getElementById('scrub-ruler'),
  togglePlayPause = document.getElementById('toggle-play-pause'),
  source = audioContext.createMediaElementSource(music)


music.crossOrigin = 'anonymous'
music.addEventListener('ended', () => {
  togglePlayPause.checked = false
})

music.addEventListener('timeupdate', () => {
  scrubRuler.value = music.currentTime
})

scrubRuler.addEventListener('change', event => {
  music.currentTime = event.target.value
  music.play()
  togglePlayPause.checked = true
})

togglePlayPause.addEventListener('change', event => {
  if (event.target.checked)
    music.play()
  else
    music.pause()
})

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

    scrubRuler.setAttribute('max', audioElement.duration)
    scrubRuler.setAttribute('value', 0)

    source.connect(analyserNode)
    analyser.connect(context.destination)

    audioElement.removeEventListener('canplay', canplayHandler)
  }
  audioElement.addEventListener('canplay', canplayHandler)
}
var request = new XMLHttpRequest();

request.open('GET', './alone.mp3', true);
request.responseType = 'blob';

request.onload = function () {
  music.src = window.URL.createObjectURL(request.response);
  connectAudioToAnalyser(music, analyser, audioContext);
}
request.send();

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

draw();