//===============================
// BUFFERLOADER CLASS
function BufferLoader(context, urlList, type, callback) {
//===============================
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.type = type;

  this.requestArray = [];
  this.bufferList = [];
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  if(!url.match(".ogg|.mp3|.wav")) url += Modernizr.audio.ogg ? '.ogg' :
  										                    Modernizr.audio.mp3 ? '.mp3' : '.wav';

  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var that = this;

  request.onload = function () {
  	that.loadCount++;
    // Asynchronously decode the audio file data in request.response
    that.context.decodeAudioData(
      request.response,
      function (buffer) {
        if (!buffer || !buffer.length) {
          console.error('error decoding file data: ' + url);
          return;
        }

        buffer.name = url.slice(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
        that.bufferList[index] = buffer;
        if (that.loadCount === that.urlList.length) {
          that.onload(that.bufferList);
        }
      },
      function (error) { 
      	if(url.match(".wav")) {
      		console.error('decodeAudioData error', url);
      		return;
      	}

      	var newURL = url;
      	if(url.match(".ogg")) newURL = url.replace(".ogg", ".mp3");
      	else if(url.match(".mp3")) newURL = url.replace(".mp3", ".wav");

      	that.loadBuffer(newURL, index);
      }
    );
  }

  request.onprogress = function(e) {
  	that.requestArray[index] = e;

  	var loaded = 0;
  	var total = 0;
  	var notReady = false;

  	for(var i = 0; i < that.requestArray.length; i++) {
  		if(!that.requestArray[i] || that.requestArray[i].total == 0) {
  			notReady = true;
  			break;
  		}

  		loaded += that.requestArray[i].loaded;
  		total += that.requestArray[i].total;
  	}

  	if(notReady) return;

  	if(that.type == "bgm") {
	  	$audioEngine.loadBGM = loaded;
	  	$audioEngine.loadBGMTotal = total;
	}
	if(that.type == "sfx") {
	  	$audioEngine.loadSFX = loaded;
	  	$audioEngine.loadSFXTotal = total;
	}

  	$(document).trigger("loading"+that.type.toUpperCase());
  }

  request.onerror = function() { alert('BufferLoader: XHR error'); }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  	this.loadBuffer(this.urlList[i], i);
}


//===============================
// AUDIOENGINE CLASS
function AudioEngine() {
//===============================
  this.muted = false;
  this.ready = false;
  this.BGM = BGM.getInstance();
  this.SFX = SFX.getInstance();

  this.loadBGM = 0;
  this.loadBGMTotal = 0;
  this.loadSFX = 0;
  this.loadSFXTotal = 0;

  this.init = function() {
    this.BGM.init();
    this.SFX.init();
  };

  this.loadedPercentage = function() {
    return Math.ceil(this.loadedFiles * 100 / this.audioFiles);
  };

  this.mute = function() {
    this.BGM.mute();
    this.SFX.mute();

    this.muted = true;
  };

  this.unMute = function() {
    this.BGM.unMute();
    this.SFX.unMute();

    this.muted = false;
  };

  this.toggleMute = function() {
    this.BGM.toggleMute();
    this.SFX.toggleMute();

    this.muted = !this.muted;
  };

  this.init();
};


//===============================
// SINGLETON
AudioEngine.getInstance = function() {
//===============================
  if(this.instance == null)
    this.instance = new AudioEngine();
  return this.instance;  
}

AudioEngine.instance = null;


//===============================
// BGM CLASS
function BGM() {
//===============================
  this.audioCtx;
  
  this.fileURL;
  this.currentFile;
  this.fileLoaded = false;
  this.loadingArray = [];
  this.sourceArray = {};
  
  this.muted = false;
  this.paused = false;
  this.hasEnded = false;

  this.crossfadeArray = [];
  this.crossfading = false;

  this.startedAt = 0;
  this.pausedAt = 0;
  this.songLength = 0;

  this.currentPosition = function() {
    var position = this.paused ? this.pausedAt / 1000 : ((new Date().getTime() - this.startedAt) + this.pausedAt) / 1000;
    if(position > this.songLength) position = this.songLength;

    return position;
  };

  this.callback;


  this.init = function() {
    try {
      // Fix up for prefixing
      window.AudioContext = window.AudioContext||window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    catch(e) {
      alert('Web Audio API is not supported in this browser');
    }
  }

  this.addSource = function(url, callback) {
    this.fileURL = url;
    if(callback && typeof callback === "function") this.callback = callback;

    // If the BGM buffer has already been loaded before, reuse its source
    if(this.hasBeenLoaded(url)) {
      this.duplicateCurrentSource();

      if(this.callback) this.callback();
      return;
    }

    $audioEngine.ready = false;
    this.fileLoaded = false;

    this.loadingArray.push(url);
    var bufferLoader = new BufferLoader(this.audioCtx, [url], "bgm", this.setSources);
    bufferLoader.load();
  }

  this.setSources = function(bufferList) {
    var bgm = $audioEngine.BGM;

    for(var i = 0; i < bufferList.length; i++) {
      var source = bgm.createSource(bufferList[i]);
      bgm.sourceArray[source.name] = source;
    }

    bgm.fileLoaded = true;
    if($audioEngine.SFX.filesLoaded) $audioEngine.ready = true;

    if(bgm.callback && typeof bgm.callback === "function") bgm.callback();
  }

  this.createSource = function(buffer) {
    var buffer = buffer;
    var source = this.audioCtx.createBufferSource();
    var gainNode = this.audioCtx.createGain ? this.audioCtx.createGain() : this.audioCtx.createGainNode();

    source.buffer = buffer;
    this.songLength = source.buffer.duration;
    gainNode.gain.value = this.muted ? 0 : .15;

    source.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    source.loop = true;
    source.loopStart = 27.75;
    source.loopEnd = 90.65;

    return {
      source: source,
      gainNode: gainNode,
      buffer: buffer,
      name: (function() { return buffer.name; })()
    };
  }

  this.duplicateCurrentSource = function() {
    var source = this.createSource(this.sourceArray[this.currentFile].buffer);
    this.sourceArray[this.currentFile] = source;
  }

  this.hasBeenLoaded = function(url) {
    return this.loadingArray.indexOf(url) != -1
  }

  this.setFile = function(file) {
    if(this.currentFile) this.stop();

    this.currentFile = file;

    this.paused = false;
    this.hasEnded = false;

    this.startedAt = 0;
    this.pausedAt = 0;
    this.songLength = 0;
  }

  this.play = function() {
    this.sourceArray[this.currentFile].source.start(0);
    this.startedAt = new Date().getTime();
    this.pausedAt = 0;
  }

  this.stop = function(memorizePosition) {
    // Try&Catch : Safari fix
    try {
      this.sourceArray[this.currentFile].source.stop(0); 
      if(memorizePosition) this.pausedAt += new Date().getTime() - this.startedAt;
    }
    catch(e) { return; }
  }

  this.setCrossfade = function(gain, callback) {
    if(gain >= 0) {
      this.crossfading = true;

      var crossfade, bgm = this;

      TweenMax.lagSmoothing(0);
      crossfade = TweenMax.to(bgm.sourceArray[bgm.currentFile].gainNode.gain, 3, {value: gain, ease: Circ.easeOut,
        onComplete:function() {
          bgm.crossfading = false;
          TweenMax.lagSmoothing(1000, 16);

          if(callback && typeof callback == "function") callback();
        }
      });
    }
  }

  this.prepareCrossfade = function(gain) { this.crossfadeArray.unshift(gain); }

  this.playCrossfade = function() {
    if(!this.muted && this.crossfadeArray.length > 0) {
      this.setCrossfade(this.crossfadeArray[0]);
      if(!this.crossfading) this.crossfadeArray.shift();
    }
  }

  this.triggerMute = function(state) {
    if(state == "toggle") this.muted = !this.muted;
    else if(state == true || state == false) {
      if(state == this.muted) return;
      this.muted = state;
    }

    if(this.muted) {
      if(!this.crossfading) {
        this.crossfadeArray = [];
        this.prepareCrossfade(this.sourceArray[this.currentFile].gainNode.gain.value);
      }

      this.setCrossfade(0);
    }
    else {
      this.playCrossfade();
      if(!this.crossfading) this.crossfadeArray = [];
    }
  }

  this.mute = function() { $audioEngine.BGM.triggerMute(true) }
  this.unMute = function() { $audioEngine.BGM.triggerMute(false) };
  this.toggleMute = function() { $audioEngine.BGM.triggerMute("toggle") };

  this.triggerPause = function(state) {
    if(this.hasEnded) return;
    if(state == true || state == false) {
      if(state == this.paused) return;
      this.paused = state;
    }
    else if(state == "toggle") this.paused = !this.paused;

    if(this.paused) this.stop(true);
    else {
      this.duplicateCurrentSource();

      this.sourceArray[this.currentFile].source.start(0, this.pausedAt / 1000);
      this.startedAt = new Date().getTime();
    }
  }

  this.pause = function() { $audioEngine.BGM.triggerPause(true) }
  this.resume = function() { $audioEngine.BGM.triggerPause(false) };
  this.togglePause = function() { $audioEngine.BGM.triggerPause("toggle") };
};


//===============================
// SINGLETON
BGM.getInstance = function() {  
//===============================
  if(this.instance == null) 
    this.instance = new BGM(); 
  return this.instance;  
}

BGM.instance = null;


//===============================
// SFX CLASS
function SFX() {
//===============================
  this.audioCtx;
  this.bufferArray = [];

  this.files = ['audio/sfx/turn1',
                'audio/sfx/turn2',
                'audio/sfx/interference1',
                'audio/sfx/interference2',
                'audio/sfx/hover',
                'audio/sfx/confirm',
                'audio/sfx/error',
                'audio/sfx/close',
                'audio/sfx/gameComplete',
                'audio/sfx/cameraReset',
                'audio/sfx/cubeSelect'
               ];

  this.filesLoaded = false;

  this.muted = false;

  this.init = function() {
    this.filesLoaded = false;

      // Fix up for prefixing
      window.AudioContext = window.AudioContext||window.webkitAudioContext;
      this.audioCtx = new AudioContext();

      var bufferLoader = new BufferLoader(this.audioCtx, this.files, "sfx", this.setBuffer);
      bufferLoader.load();
  }

  this.setBuffer = function(bufferList) {
    var sfx = $audioEngine.SFX || this;

    for(var i = 0; i < bufferList.length; i++) {
      sfx.bufferArray[i] = bufferList[i];
    }

    sfx.filesLoaded = true;
    if($audioEngine.BGM.fileLoaded) $audioEngine.ready = true;
  }

  this.createSource = function(buffer) {
    var source = this.audioCtx.createBufferSource();
    var gainNode = this.audioCtx.createGain ? this.audioCtx.createGain() : this.audioCtx.createGainNode();

    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    gainNode.gain.value = .25;
    source.start(0);
  }

  this.play = function(sfxName) {
    if(this.muted) return;
    var sfx;

    if(sfxName == "turn1") sfx = this.bufferArray[0];
    if(sfxName == "turn2") sfx = this.bufferArray[1];
    if(sfxName == "interference1") sfx = this.bufferArray[2];
    if(sfxName == "interference2") sfx = this.bufferArray[3];
    if(sfxName == "hover") sfx = this.bufferArray[4];
    if(sfxName == "confirm") sfx = this.bufferArray[5];
    if(sfxName == "error") sfx = this.bufferArray[6];
    if(sfxName == "close") sfx = this.bufferArray[7];
    if(sfxName == "gameComplete") sfx = this.bufferArray[8];
    if(sfxName == "cameraReset") sfx = this.bufferArray[9];
    if(sfxName == "cubeSelect") sfx = this.bufferArray[10];

    if(sfx) this.createSource(sfx);
  }

  this.triggerMute = function(state) {
    if(state == "toggle") this.muted = !this.muted;
    else if(state == true || state == false) {
      if(state == this.muted) return;
      this.muted = state;
    } 
  }

  this.mute = function() { $audioEngine.SFX.triggerMute(true) }
  this.unMute = function() { $audioEngine.SFX.triggerMute(false) };
  this.toggleMute = function() { $audioEngine.SFX.triggerMute("toggle") };
};


//===============================
// SINGLETON
SFX.getInstance = function() {  
//===============================
  if(this.instance == null)
    this.instance = new SFX();  
  return this.instance;  
}

SFX.instance = null;
