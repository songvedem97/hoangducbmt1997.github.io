/*--Login--*/
const signUpBtnHeader = document.getElementById('signUpHeader');
const signInBtnHeader = document.getElementById('signInHeader');
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const overlay = document.getElementById('overlay');
const closePopLogin = document.getElementById('close_login_popup');
const container_login = document.getElementById('container_login');
const joinButon = document.getElementById('join-now');
/*--Carousel--*/
$('.carousel-suggesstion-song').owlCarousel({
    loop:true,
    margin:20,
    nav:true,
    navText: ['<span class="material-icons-outlined">arrow_back_ios</span>','<span class="material-icons-outlined">arrow_forward_ios</span>'],
    responsive:{
        0:{
            items:2
        },
        600:{
            items:3
        }
        ,
        740:{
            items:4
        },
        1024:{
            items:6
        }
    }
})

$('.carousel-favorite-artist').owlCarousel({
    loop:true,
    margin:20,
    nav:true,
    navText: ['<span class="material-icons-outlined">arrow_back_ios</span>','<span class="material-icons-outlined">arrow_forward_ios</span>'],
    responsive:{
        0:{
            items:2
        },
        600:{
            items:3
        },
        740:{
            items:4
        },
        1024:{
            items:6
        }
    }
})

$('.carousel-new-song').owlCarousel({
    loop:false,
    margin:20,
    nav:false,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1024:{
            items:3
        }
    }
})
$('.carousel-mv-song').owlCarousel({
    loop:true,
    margin:20,
    nav:true,
    navText: ['<span class="material-icons-outlined">arrow_back_ios</span>','<span class="material-icons-outlined">arrow_forward_ios</span>'],
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1024:{
            items:4
        }
    }
})
$('.carousel-asia-song').owlCarousel({
    loop:false,
    margin:20,
    nav:true,
    navText: ['<span class="material-icons-outlined">arrow_back_ios</span>','<span class="material-icons-outlined">arrow_forward_ios</span>'],
    responsive:{
        0:{
            items:2
        },
        600:{
            items:3
        },
        1024:{
            items:6
        }
    }
})
$('.carousel-play-list-user').owlCarousel({
    loop:false,
    margin:20,
    nav:true,
    navText: ['<span class="material-icons-outlined">arrow_back_ios</span>','<span class="material-icons-outlined">arrow_forward_ios</span>'],
    responsive:{
        0:{
            items:2
        },
        600:{
            items:4
        },
        1024:{
            items:6
        }
    }
})


/*--Show Popup Login--*/

signInBtnHeader.addEventListener('click', () => {
    document.getElementById('login-form').style.display="block";
    document.getElementById('overlay').style.visibility="visible";
    container_login.classList.remove("right-panel-active");

});
signUpBtnHeader.addEventListener('click', () => {
    document.getElementById('login-form').style.display="block";
    document.getElementById('overlay').style.visibility="visible";
    container_login.classList.add("right-panel-active");
});

joinButon.addEventListener('click', () => {
    document.getElementById('login-form').style.display="block";
    document.getElementById('overlay').style.visibility="visible";
});
/*--Swtich Popup Login--*/

signUpButton.addEventListener('click', () => {
	container_login.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container_login.classList.remove("right-panel-active");
});

/*--Close Popup Login--*/
closePopLogin.addEventListener('click', () => {
    document.getElementById('login-form').style.display="none";
    document.getElementById('overlay').style.visibility="hidden";
});
/*--Close Overlay--*/
overlay.addEventListener('click',()=>{
    document.getElementById('overlay').style.visibility="hidden";
    document.getElementById('login-form').style.display="none";
})

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 70 || document.documentElement.scrollTop > 70) {
      document.getElementById('header').style.backgroundColor='var(--blue-color)';
      document.getElementById('search').style.backgroundColor= 'var(--bg-color)';
      document.getElementById('input-search').style.color='var(--white-color)';
  }
  else{
    document.getElementById('header').style.backgroundColor='transparent';
    document.getElementById('search').style.backgroundColor= 'var(--bg-search)';
    document.getElementById('input-search').style.color='var(--blue-color)';
  }
}
