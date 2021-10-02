window.onload = async () => {
	getSong();
}
/*--Variable--*/

const resetLyrics = document.querySelector('.lyricwrap');
const btnPlay = document.querySelector('.btn-play');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');

const musicContent = document.querySelector('.ms-play-control-container');
const timesong = document.querySelector(".duration-time");
const currentTimeDisplay = document.querySelector(".current-time");
const progressBar = document.querySelector(".progress-bar");
const rangeVolume = document.querySelector(".volume");
const btnLoop = document.querySelector('.btn-loop');

const avatarControl = document.querySelector('.play-control-img-song');
const imgBlurSong = document.querySelector('.img-blur');
const avatar = document.querySelector(".wrapper-img-action img");
const nameSong = document.querySelector(".ms-control-info-song .name-song");
const creator = document.querySelector(".ms-control-info-song .creator");

var arraySongs = [];

const btnVolume = document.querySelector('.btn-volume');
const listSong = document.querySelector('.list-music');
/*--INIT--*/
var songIndex = 0;
var valueVolume = 0.5;

avatar.style.animationPlayState = 'paused';
audio.volume = valueVolume;

getSong = async () => {
	let songs = document.querySelectorAll(".list-music-item")
	for (let i = 0; i < songs.length; i++) {
		arraySongs.push(songs[i].getAttribute("data-music"));
	}
	loadSong();
}

getLrc = function (url) {
	$.ajax({
		type: "get",
		url: url,
		dataType: "text",
	})
		.done(function (data) {
			var text = data;
			text = text.replace(/\n/g, '#').replace(/\r/g, '').replace(/######/g, '#').replace(/######/g, '#').replace(/####/g, '#').replace(/###/g, '#').replace(/##/g, '#');
			lyric = parseLyric(text);
			appendLyric(lyric);

		})
		.fail(function () {
			alert("Cannot load lyric");
		});

},
	appendLyric = function (lyric) {
		lyric.forEach(function (v, i, a) {
			$("<p id='line-" + i + "'>").html(v[1]).appendTo(".lyric");
		});
	},
	scrollbar = function () {
		var line = $(".current-line"),
			scrolltop = $(".lyric").scrollTop(),
			anchor = line.offset().top;
		$(".lyricwrap").animate({
			scrollTop: anchor
		}, 1000, 'swing');
		if (anchor - 110 != scrolltop) {
			if (line.length && anchor >= 110) {
				$(".lyricwrap").animate({
					scrollTop: anchor - 110
				}, 1000, "swing");
			}
		}
	};
loadSong = async () => {
	song = songIndex;
	audio.src = arraySongs[song];
	audio.addEventListener('loadedmetadata', () => {
		const time = formatTime(audio.duration);
		timesong.textContent = time;
	})
	let detailSong = document.querySelectorAll(".list-music-item");
	nameSong.textContent = detailSong[song].getAttribute("data-name");
	creator.textContent = detailSong[song].getAttribute("data-creator");
	avatar.src = detailSong[song].getAttribute("data-avatar");
	avatarControl.src=detailSong[song].getAttribute("data-avatar");
	imgBlurSong.src=detailSong[song].getAttribute("data-img");
	getLrc(detailSong[song].getAttribute('data-lrc'));
	document.title = detailSong[song].getAttribute("data-name")+", "+detailSong[song].getAttribute("data-creator");;
	
}


playSong = () => {
	musicContent.classList.add("playing");
	avatar.style.animationPlayState = 'running';
	btnPlay.classList.remove('fa-play');
	btnPlay.classList.add('fa-pause');
	audio.play();
}
pauseSong = () => {
	musicContent.classList.remove("playing");
	avatar.style.animationPlayState = 'paused';
	btnPlay.classList.add('fa-play');
	btnPlay.classList.remove('fa-pause');
	audio.pause();
}

nextSong = () => {
	songIndex++;
	resetLyrics.innerHTML=`<div class="lyric"></div>`;
	if (songIndex > arraySongs.length - 1) {
		songIndex = 0;
	}
	loadSong(songIndex);
}
prevSong = () => {
	songIndex--;
	resetLyrics.innerHTML=`<div class="lyric"></div>`;
	if (songIndex < 0) {
		songIndex = arraySongs.length - 1;
	}
	loadSong(songIndex);
}

addLoopSong = () => {
	btnLoop.classList.add('add-color-btn');
	musicContent.classList.add("looping");
	audio.loop = true;
}
removeLoopSong = () => {
	btnLoop.classList.remove('add-color-btn');
	musicContent.classList.remove("looping");
	audio.loop = false;
}
addVolume = () => {
	musicContent.classList.add("volume");
	btnVolume.classList.add('fa-volume-up');
	btnVolume.classList.remove('fa-volume-mute');
	btnVolume.classList.remove('add-color-btn');
	audio.volume = valueVolume;
}

muteVolume = () => {
	musicContent.classList.remove("volume");
	btnVolume.classList.remove('fa-volume-up');
	btnVolume.classList.add('fa-volume-mute');
	btnVolume.classList.add('add-color-btn');
	valueVolume = audio.volume;
	audio.volume = 0;
}

function parseLyric(text) {
	//Split text into line and push in array
	var lines = text.split('#'),
		pattern = /\[\d{2}:\d{2}.\d{2,3}\]/g,
		result = [];
	while (!pattern.test(lines[0])) {
		lines = lines.slice(1);
	};
	lines[lines.length - 1].length === 0 && lines.pop();
	lines.forEach(function (v /*value array*/, i /*index*/, a /*array*/) {
		var time = v.match(pattern),
			value = v.replace(pattern, '');
		time.forEach(function (v1, i1, a1) {
			var t = v1.slice(1, -1).split(':');
			result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
		});
	});
	//SORT SIZE BY TIME
	result.sort(function (a, b) {
		return a[0] - b[0];
	});
	return result;
}

btnPlay.addEventListener("click", () => {

	if (musicContent.classList.contains("playing")) {
		pauseSong();
	}
	else
		playSong();
})
btnNext.addEventListener("click", () => {
	nextSong();
	setTimeout(() => {
		playSong();
	}, 100)
})
btnPrev.addEventListener("click", () => {
	prevSong();
	setTimeout(() => {
		playSong();
	}, 100)
})
btnLoop.addEventListener("click", () => {
	if (musicContent.classList.contains("looping")) {
		removeLoopSong();
	}
	else
		addLoopSong();
})

btnVolume.addEventListener("click", () => {
	if (musicContent.classList.contains('volume')) {
		muteVolume();
	}
	else {
		addVolume();
	}
})

listSong.addEventListener("click", (e) => {
	songIndex = e.target.closest("li").getAttribute("data-index");
	resetLyrics.innerHTML=`<div class="lyric"></div>`;
	loadSong(songIndex);
	playSong();
})

audio.addEventListener('loadedmetadata', () => {
	const time = formatTime(audio.duration);
	timesong.textContent = time;
})

updateProgressTime = (e) => {
	const { currentTime, duration } = e.srcElement;
	currentTimeDisplay.textContent = formatTime(currentTime);
}
audio.addEventListener("timeupdate", updateProgressTime);

audio.addEventListener("ended", () => {
	avatar.style.animationPlayState = 'paused';
	nextSong();
	playSong();
})
audio.ontimeupdate = function () {
	if (audio.duration) {
		const progressPercent = (audio.currentTime / audio.duration) * 100;
		progressBar.value = progressPercent;
	}
};
progressBar.onchange = function (e) {
	const seekTime = (audio.duration / 100) * e.target.value;
	audio.currentTime = seekTime;
};
rangeVolume.onchange = function (e) {
	valueVolume = e.target.value / 100;
	audio.volume = valueVolume;
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

audio.addEventListener('timeupdate', function (e) {
	for (var i = 0, l = lyric.length; i < l; i++) {
		if (this.currentTime > lyric[i][0]) {
			var prevLine = $("#line-" + (i > 0 ? i - 1 : i) + ""),
				line = $("#line-" + i + ""),
				lineClass = $(".current-line").attr("id"),
				anchor = line.position().top;
			$(".current-line").attr("class", "");
			line.attr("class", "current-line");
			$(".lyric").css("top", "" + (110 - line.position().top) + "px");
		}
	}

});




