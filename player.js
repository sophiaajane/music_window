window.addEventListener('load', async function() {
  // (A) PLAYER INIT
  // (A1) PLAYLIST - CHANGE TO YOUR OWN!
  const weather = await NWS.getForecast()
  console.log(weather)
  if(weather.temperature > 60 && weather.shortForecast==='Partly Sunny'){
    var playlist = [
      {name: "CouldMeetYou!!!", src: "couldmeetyou.mp3"}
    ];
  } else if(weather.temperature < 60){
    var playlist = [
      {name: "CouldMeetYou!!! - 9th Wonder", src: "couldmeetyou.mp3"},
      {name: "Tell Him - Ms. Lauryn Hill", src: "tellhim.mp3"},
      {name: "Luv (sic) pt2 - Nujabes, Shing02", src: "luvsicpt2.mp3"},
      {name: "BURDENSOUL!!! - 9th Wonder", src: "burdensoul.mp3"},
      {name: "Lady Brown - Nujabes, Cise Starr", src: "ladybrown.mp3"},
      {name: "You Got Me - The Roots, Tariq Trotter, Erykah Badu, Eve", src: "yougotme.mp3"},
      {name: "Datura Stramonium - MF Doom", src: "daturastramonium.mp3"}
    ];
  } else {
    var playlist = [
      {name: "U Gotta Love It - Nas", src: "ugottaloveit.mp3"},
      {name: "Pacifics - Digable Planets", src:"pacifics.mp3"},
      {name: "Peachfuzz - KMD", src: "peachfuzz.mp3"},
      {name: "Hey Ma - Cam'Ron", src: "heyma.mp3"},
      {name: "What's Going On - T. Honda", src: "whatsgoingon.mp3"}
    ];
  }

  // (A2) AUDIO PLAYER & GET HTML CONTROLS
  const audio = new Audio(),
        aPlay = document.getElementById("aPlay"),
        aPlayIco = document.getElementById("aPlayIco"),
        aNow = document.getElementById("aNow"),
        aTime = document.getElementById("aTime"),
        aSeek = document.getElementById("aSeek"),
        aVolume = document.getElementById("aVolume"),
        aVolIco = document.getElementById("aVolIco"),
        aList = document.getElementById("aList");

  // (A3) BUILD PLAYLIST
  for (let i in playlist) {
    let row = document.createElement("div");
    row.className = "aRow";
    row.innerHTML = playlist[i]["name"];
    row.addEventListener("click", () => { audPlay(i); });
    playlist[i]["row"] = row;
    aList.appendChild(row);
  }

  // (B) PLAY MECHANISM
  // (B1) FLAGS
  var audNow = 0, // current song
      audStart = false, // auto start next song

  // (B2) PLAY SELECTED SONG
  audPlay = (idx, nostart) => {
    audNow = idx;
    audStart = nostart ? false : true;
    audio.src = playlist[idx]["src"];
    for (let i in playlist) {
      if (i == idx) { playlist[i]["row"].classList.add("now"); }
      else { playlist[i]["row"].classList.remove("now"); }
    }
  };

  // (B3) AUTO START WHEN SUFFICIENTLY BUFFERED
  audio.addEventListener("canplay", () => { if (audStart) {
    audio.play();
    audStart = false;
  }});

  // (B4) AUTOPLAY NEXT SONG IN THE PLAYLIST
  audio.addEventListener("ended", () => {
    audNow++;
    if (audNow >= playlist.length) { audNow = 0; }
    audPlay(audNow);
  });

  // (B5) INIT SET FIRST SONG
  audPlay(0, true);

  // (C) PLAY/PAUSE BUTTON
  // (C1) AUTO SET PLAY/PAUSE TEXT
  audio.addEventListener("play", () => {
    aPlayIco.innerHTML = "pause";
  });
  audio.addEventListener("pause", () => {
    aPlayIco.innerHTML = "play_arrow";
  });

  // (C2) CLICK TO PLAY/PAUSE
  aPlay.addEventListener("click", () => {
    if (audio.paused) { audio.play(); }
    else { audio.pause(); }
  });

  // (D) TRACK PROGRESS
  // (D1) SUPPORT FUNCTION - FORMAT HH:MM:SS
  var timeString = (secs) => {
    // HOURS, MINUTES, SECONDS
    let ss = Math.floor(secs),
        hh = Math.floor(ss / 3600),
        mm = Math.floor((ss - (hh * 3600)) / 60);
    ss = ss - (hh * 3600) - (mm * 60);

    // RETURN FORMATTED TIME
    if (hh>0) { mm = mm<10 ? "0"+mm : mm; }
    ss = ss<10 ? "0"+ss : ss;
    return hh>0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}` ;
  };

  // (D2) INIT SET TRACK TIME
  audio.addEventListener("loadedmetadata", () => {
    aNow.innerHTML = timeString(0);
    aTime.innerHTML = timeString(audio.duration);
  });

  // (D3) UPDATE TIME ON PLAYING
  audio.addEventListener("timeupdate", () => {
    aNow.innerHTML = timeString(audio.currentTime);
  });

  // (E) SEEK BAR
  audio.addEventListener("loadedmetadata", () => {
    // (E1) SET SEEK BAR MAX TIME
    aSeek.max = Math.floor(audio.duration);

    // (E2) USER CHANGE SEEK BAR TIME
    var aSeeking = false; // USER IS NOW CHANGING TIME
    aSeek.addEventListener("input", () => {
      aSeeking = true; // PREVENTS CLASH WITH (E3)
    });
    aSeek.addEventListener("change", () => {
      audio.currentTime = aSeek.value;
      if (!audio.paused) { audio.play(); }
      aSeeking = false;
    });

    // (E3) UPDATE SEEK BAR ON PLAYING
    audio.addEventListener("timeupdate", () => {
      if (!aSeeking) { aSeek.value = Math.floor(audio.currentTime); }
    });
  });

  // (F) VOLUME
  aVolume.addEventListener("change", () => {
    audio.volume = aVolume.value;
    aVolIco.innerHTML = (aVolume.value==0 ? "volume_mute" : "volume_up");
  });

  // (G) ENABLE/DISABLE CONTROLS
  audio.addEventListener("canplay", () => {
    aPlay.disabled = false;
    aVolume.disabled = false;
    aSeek.disabled = false;
  });
  audio.addEventListener("waiting", () => {
    aPlay.disabled = true;
    aVolume.disabled = true;
    aSeek.disabled = true;
  });
});
