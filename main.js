(function(){

  //GET al XML
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
    //Mando llamar la función y le paso el parámetro
    putsrcPodcast(xhttp);
    }
  };

  xhttp.open("GET", "http://i2.esmas.com/deportes30/mxm/podcast/info.xml", true);
  xhttp.send();

  function putsrcPodcast(xml) {
    //console.log(xml);
    var i;
    var xmlDoc = xml.responseXML;
    var x = xmlDoc.getElementsByTagName("item");
    //recorre el XMl
    for (i = 0; i <x.length; i++) {
      //obtengo el atributo url
      var urlPodcast = x[i].getElementsByTagName("enclosure")[0].getAttribute("url"),
          //le asigno la url del mp3 al tag
          audio = document.getElementById('podcast-src');
          audio.setAttribute('src', urlPodcast);
      //console.log(urlPodcast);
    }
  }

  var podcastPlayers = document.querySelectorAll('.podcast-player');
  var speeds = [ 1, 1.5, 2, 2.5, 3 ]

  //recorro el div para obtener las clases de las acciones que se van a realizar
  for(i=0;i<podcastPlayers.length;i++) {
    var player = podcastPlayers[i];
    var audio = player.querySelector('audio');
    var play = player.querySelector('.podcast-play');
    var pause = player.querySelector('.podcast-pause');
    var rewind = player.querySelector('.podcast-rewind');
    var progress = player.querySelector('.podcast-progress');
    var speed = player.querySelector('.podcast-speed');
    var mute = player.querySelector('.podcast-mute');
    var currentTime = player.querySelector('.podcast-currenttime');
    var duration = player.querySelector('.podcast-duration');

    var currentSpeedIdx = 0;

    pause.style.display = 'none';

    var toHHMMSS = function ( totalsecs ) {
        var sec_num = parseInt(totalsecs, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours; }
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}

        var time = hours+':'+minutes+':'+seconds;
        return time;
    }

    audio.addEventListener('loadedmetadata', function(){
      progress.setAttribute('max', Math.floor(audio.duration));
      duration.textContent  = toHHMMSS(audio.duration);
    });

    audio.addEventListener('timeupdate', function(){
      progress.setAttribute('value', audio.currentTime);
      currentTime.textContent  = toHHMMSS(audio.currentTime);
    });

    //click en el botón play
    play.addEventListener('click', function(){
      this.style.display = 'none';
      pause.style.display = 'inline-block';
      pause.focus();
      audio.play();
    }, false);

    //click en el botón pausa
    pause.addEventListener('click', function(){
      this.style.display = 'none';
      play.style.display = 'inline-block';
      play.focus();
      audio.pause();
    }, false);

    //click en el botón rewind
    rewind.addEventListener('click', function(){
      audio.currentTime -= 30;
    }, false);

    //barra de progreso
    progress.addEventListener('click', function(e){
      audio.currentTime = Math.floor(audio.duration) * (e.offsetX / e.target.offsetWidth);
    }, false);

    //click en el botón de la velocidad (1x)
    speed.addEventListener('click', function(){
      currentSpeedIdx = currentSpeedIdx + 1 < speeds.length ? currentSpeedIdx + 1 : 0;
      audio.playbackRate = speeds[currentSpeedIdx];
      this.textContent  = speeds[currentSpeedIdx] + 'x';
      return true;
    }, false);

    //clicl en el boton Silenciar
    mute.addEventListener('click', function() {
      if(audio.muted) {
        audio.muted = false;
      } else {
        audio.muted = true;
      }
    }, false);
  }
})(this);
