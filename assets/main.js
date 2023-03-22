/**
 *                  1. Render songs
 *                  2. Scroll top
 *                  3. Play/pause/seek
 *                  4. CD rotate
 *                  5. Next/prev
 *                  6. Randoms
 *                  7. Next/repeat when ended
 *                  8. Active song
 *                  9. Scroll active song into view
 *                  10. Play song when click
 */




    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const progress = $('#progress');
    const player = $('.player');
    const playlist = $('.playlist');
    const playBtn = $('.btn-toggle-play');
    const heading = $('header h2');
    const cdThumb = $('.cd-thumb');
    const audio = $('#audio');
    const nextBtn = $('.btn-next');
    const prevBtn = $('.btn-prev');
    const randomBtn = $('.btn-random');
    const repeatBtn = $('.btn-repeat');

    const app = {
         isPlaying: false,
         currentIndex: 0,
         isRandom : false,
         isRepeat: false,

        songs:  [
        {
            name:'Anh đánh rơi người yêu này',
            singer:'Andiez ft. AMEE',
            path:'./assets/music/Anh đánh rơi người yêu này.mp3',
            image:'./assets/img/1.png',
        },
        {
            name:'Chạy khỏi thế giới này',
            singer:'Da LAB, Phương Ly',
            path:'./assets/music/Chạy khỏi thế giới này.mp3',
            image:'./assets/img/2.png'
        },
        {
            name:'Có đâu ai ngờ',
            singer:'Cầm', 
            path:'./assets/music/Có đâu ai ngờ.mp3',
            image:'./assets/img/3.png'
        },
        {
            name:'Em là nhất',
            singer:'kis, Hoàng KayLee, YAHY, Cukak',
            path:'./assets/music/Em là nhất.mp3',
            image:'./assets/img/4.png'
        },
        {
            name:'Em thích',
            singer:'Sean (Việt Nam), Lửa',
            path:'./assets/music/Em thích.mp3',
            image:'./assets/img/5.png'
        },
        {
            name:'Hình như ta thích nhau',
            singer:'Doãn Hiếu, BMZ',
            path:'./assets/music/Hình như ta thích nhau.mp3',
            image:'./assets/img/6.png'
        },
        {
            name:'Kìa bóng dáng ai',
            singer:'Pháo, Sterry',
            path:'./assets/music/Kìa bóng dáng ai.mp3',
            image:'./assets/img/7.png'
        },
        {
            name:'Mặt mộc',
            singer:'Phạm Nguyên Ngọc, V.Anh, Ân Nhi',
            path:'./assets/music/Mặt mộc.mp3',
            image:'./assets/img/8.png'
        },
        {
            name:'Như anh đã thấy em',
            singer:'PhucXP, Freak D',
            path:'./assets/music/Như anh đã thấy em.mp3',
            image:'./assets/img/8.png'
        },
        {
            name:'Tell Ur Mom',
            singer:'Winno, Heily, Cukak',
            path:'./assets/music/Tell Ur Mom.mp3',
            image:'./assets/img/10.png'
        },
        {
            name:'Thích em hơi nhiều',
            singer:'Wren Evans',
            path:'./assets/music/Thích em hơi nhiều.mp3',
            image:'./assets/img/11.png'
        },
        {
            name:'Tình ca tình ta',
            singer:'kis, Cukak',
            path:'./assets/music/Tình ca tình ta.mp3',
            image:'./assets/img/12.png'
        },
     
    ],


    render: function() {
            const htmls = this.songs.map((song,index) => {
                return `
                <div class="song ${index === app.currentIndex ? 'active' : '' }" data-index="${index}">

                    <div class="thumb"
                        style="background-image: url(${song.image});" >
                        
                    </div>

                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>

                    <div class="option">
                        <i class="fa-solid fa-ellipsis"></i>
                     </div>

            </div>
            `
            })
            playlist.innerHTML = htmls.join('');
    },


    defineProperties: function () {
        Object.defineProperty(this,'currentSong',{
            get: function() {
                return this.songs[this.currentIndex];
            } 
        })
    },

    
    handleEvents: function() {
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;

        // Xử lí CD quay / dừng

        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,  // 10 seconds
            iterations: Infinity // CHay vo han
        })

        cdThumbAnimate.pause()

        //              Xử lí phóng to, thu nhỏ  CD

        document.onscroll = function() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop;
        

        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
        cd.style.opacity = newCdWidth/cdWidth;
        },



        //          Xử lí nút Play
        playBtn.onclick = function() {
                if(app.isPlaying) {
                     audio.pause();
                }else {
                    audio.play()
                }
                
        }


        //      Khi song được play 
        audio.onplay = function() {
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }


        // Khi song pause

        audio.onpause = function() {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }


        // Khi tiến độ bài hát thay đổi
        //  Thay đổi thanh progress
        audio.ontimeupdate = function () {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
            progress.value = progressPercent;
            }
           
        }

        // Thay đổi thời gian hiện tại của bài hát
          progress.onchange = function(e) {
            const seekTime = (e.target.value / 100 * audio.duration);   
            audio.currentTime = seekTime;
          }



          // Bấm next , prev

          nextBtn.onclick = function() {
            if(app.isRandom) {
                app.randomSong();
            } else {
                app.nextSong();
            }
                audio.play();
                app.render();
                app.scrollToActiveSong();
          }

          prevBtn.onclick   = function() {
            if(app.isRandom) {
                app.randomSong();
            } else {
                app.prevSong();
            }
                audio.play();
                app.render();
                app.scrollToActiveSong();
          }



          // Random bài hát
          randomBtn.onclick = function(e) {
                app.isRandom = !app.isRandom;
                randomBtn.classList.toggle('active', app.isRandom);
                 
           }

           // Xử lí khi audio ended
           audio.onended = function() {
            if(app.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
                
           }


           // Xử lí phát lại  bài hát
           repeatBtn.onclick = function () {
             app.isRepeat =!app.isRepeat;
             repeatBtn.classList.toggle('active', app.isRepeat);
           }



           //   Lắng nghe hành vi click vào playlist
           playlist.onclick = function (e) {

                const node = e.target.closest('.song:not(.active)');
            // Xem có click vào song hoặc con của song hay không(trừ vị trí 3 dấu chấm và bài hiện tại)
                if(e.target.closest('.song:not(.active)') || e.target.closest('.option') ) {
                   
                    if(e.target.closest('.song:not(.active)')) {            // hoặc node.dataset.index
                        app.currentIndex = Number(node.getAttribute('data-index'));
                        app.loadCurrentSong();
                        app.render(); 
                        audio.play();
                        
                    }
                    
                } 
                
                
        
            }

    },



    loadCurrentSong: function() {
        

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },



    
    nextSong: function() {
        app.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
           }   
           this.loadCurrentSong();
    },



    prevSong: function() {
        this.currentIndex--; 
        if(this.currentIndex <= 0) {
            this.currentIndex = 0;
           }   
           this.loadCurrentSong();
    },


    randomSong: function() {
        let newIndex
        do {
             newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex == this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },


    scrollToActiveSong: function() {
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                     behavior: 'smooth',
                     block:'nearest',
                });
            } , 300
            )
    },

    start: function() {
        //                  Địng nghĩa các thuộc tính cho object 
        this.defineProperties();


        //                  Lắng nghe, xử lí các sự kiện
        this.handleEvents();

        //                  Tải thông tin bài hát đầu tiên khi chạy ứng dụng
        this.loadCurrentSong(); 

        //          Render playlist
        this.render() ;
    },

    

}

app.start();