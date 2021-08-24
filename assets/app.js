window.onload = async ()=>{
	$body = $("body");
	$body.addClass("loading");
	getSong();
	await getData();
	$body.removeClass("loading");
}
const musicContent = document.querySelector(".row");
const avatar = document.querySelector(".avatar img");
const name = document.querySelector(".music-play .name");
const creator = document.querySelector(".music-play .creator");
const btnPlay = document.querySelector(".fa-play-circle");
const btnLoop = document.querySelector(".btn-loop");
const btnNext = document.querySelector(".btn-next");
const btnPrev = document.querySelector(".btn-prev");
const btnRandom = document.querySelector(".btn-random");
const audio = document.querySelector("#audio");
const progress = document.querySelector(".progress");
const timesong = document.querySelector(".duration-time");
const progressBar = document.querySelector(".progress-bar");
const currentTimeDisplay = document.querySelector(".current-time");
const list = document.querySelector(".list-music");
const songlist = list.getElementsByTagName("li");
let songIndex = 83;//Để Mị Nói Cho Mà Nghe :))
let isRandom = false;
let isLoop = false;
let arraySongs = [];
let base_api = "https://api.apify.com/v2/key-value-stores/EJ3Ppyr2t73Ifit64/records/LATEST/";
fectRequest = async (url) =>{
	const response = await fetch(url);
	return response.json();
}
const getData = async () => {
	const response = await fetch(`${base_api}`);
	if (response.ok) {
		return await response.json();
	} else {
		return Promise.reject(response.status);
	}
	
};
getSong = async()=>{
	
	const result = getData();
	list.innerHTML = "";
	result.then(data=>{
		let all = data.songs.top100_VN;
		let nt = all[0].songs;
		for(let i = 0; i < nt.length; i++){
			const name = nt[i].title;
			const creator = nt[i].creator;
			const music = nt[i].music;
			const avatar = nt[i].avatar;
			const bgImage = nt[i].bgImage;
			list.innerHTML +=
			`<li class="list-music-item" data-name='${name}' data-creator='${creator}' data-music='${music}'
			data-avatar='${avatar}' data-index='${i}'>
			<div class="list-music-item-info">
			<span class="name">${name}</span>
			<span class="creator">${creator}</span>
			</div>
			<a href="${music}">
			<i class='bx bxs-download'></i>
			</a>
			</li>`
		}
		let songs = document.querySelectorAll(".list-music-item")
		for(let i = 0; i < songs.length; i++){
			arraySongs.push(songs[i].getAttribute("data-music"));
		}
		loadSong();	
		
	})
	
}
formatTime = (second)=>{
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
loadSong = async(song)=>{
	song = songIndex;
	audio.src = arraySongs[song];
	audio.addEventListener('loadedmetadata', ()=>{
		const time = formatTime(audio.duration);
		timesong.textContent = time;
	})
	let detailSong = document.querySelectorAll(".list-music-item");
	name.textContent = detailSong[song].getAttribute("data-name");
	creator.textContent = detailSong[song].getAttribute("data-creator");
	avatar.src = detailSong[song].getAttribute("data-avatar");
	for(let i = 0; i < songlist.length; i++){
		songlist[i].classList.remove("active");
	}
	songlist[song].classList.add("active");
	songlist[song].scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
}
function loader(){
	var loader = document.getElementById("wrap-pre-loader");
	window.addEventListener("load",function(){
	loader.style.display = "none";
	})
}
addLoopSong = () =>{
	btnLoop.classList.remove('bx-remove-loop');
	btnLoop.classList.add('bx-add-loop');
	if(songIndex > arraySongs.length - 1){
		songIndex = 0;
	}
}
removeLoopSong = () =>{
	btnLoop.classList.add('bx-remove-loop');
	btnLoop.classList.remove('bx-add-loop');
	if(songIndex > arraySongs.length - 1){
		songIndex = 0;
	}
}
playSong = ()=>{
	musicContent.classList.add("playing");
	avatar.style.animationPlayState = 'running';
	btnPlay.classList.remove('fa-play-circle');
	btnPlay.classList.add('fa-pause-circle');
	audio.play();
}
pauseSong = ()=>{
	musicContent.classList.remove("playing");
	avatar.style.animationPlayState = 'paused';
	btnPlay.classList.add('fa-play-circle');
	btnPlay.classList.remove('fa-pause-circle');
	audio.pause();
}
addRandomSong = () =>{
	songIndex = Math.floor(Math.random() * 101);
	btnRandom.classList.remove('bx-remove-random');
	btnRandom.classList.add('bx-add-random');
	if(songIndex > arraySongs.length - 1){
		songIndex = 0;
	}
}
removeRandomSong = () =>{
	btnRandom.classList.add('bx-remove-random');
	btnRandom.classList.remove('bx-add-random');
	if(songIndex > arraySongs.length - 1){
		songIndex = 0;
	}
}
nextSong = ()=>{
	songIndex++;
	if(songIndex > arraySongs.length - 1){
		songIndex = 0;
	}
	loadSong(songIndex);
}
prevSong = ()=>{
	songIndex--;
	if(songIndex < 0){
		songIndex = arraySongs.length -1;
	}
	loadSong(songIndex);
}
updateProgress = (e)=>{
	const { currentTime, duration } = e.srcElement;
	const progressPercent = (currentTime / duration) * 100;
	progressBar.style.width = `${progressPercent}%`;
	currentTimeDisplay.textContent = formatTime(currentTime);
}
setProgress = (e)=>{
	const width = e.offsetX;
	const progress = e.currentTarget;
	const progressBarWidth = (width / progress.clientWidth) * 100;
	progressBar.style.width = `${progressBarWidth}%`;
	let { duration } = audio;
	audio.currentTime = (width * duration) / progress.clientWidth;
}
audio.addEventListener("timeupdate", updateProgress);
progress.addEventListener("click", setProgress);
audio.addEventListener("ended", ()=>{
	if(isLoop == true)
	{
		playSong();
	}
	else if(isLoop == false)
	{
		nextSong();
		playSong();
	}
	
})
btnPlay.addEventListener("click", ()=>{
	if(musicContent.classList.contains("playing")){
		pauseSong();
	}else {
		playSong();
	}
})
btnNext.addEventListener("click", ()=>{
	nextSong();
	setTimeout(()=>{
		playSong();
	}, 400)
})
btnPrev.addEventListener("click", ()=>{
	prevSong();
	setTimeout(()=>{
		playSong();
	}, 400)
})
btnRandom.addEventListener("click",()=>{
	if(isRandom == false ){
		isRandom = true;
		addRandomSong();
	}
	else if(isRandom == true ){
		isRandom = false;
		removeRandomSong();
	}
	setTimeout(()=>{
		playSong();
	},400)
})
btnLoop.addEventListener("click",()=>{
	if(isLoop == false ){
		isLoop = true;
		addLoopSong();
	}
	else if(isLoop == true ){
		isLoop = false;
		removeLoopSong();
	}
	setTimeout(()=>{
		playSong();
	},400)
})
list.addEventListener("click", (e)=>{
	songIndex = e.target.closest("li").getAttribute("data-index");
	loadSong(songIndex);
	playSong();
})
console.log(isLoader);


