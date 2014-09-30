// used to hold the current SoundManager2 sound object
// this has been moved to ojplayer class
//var currentSound = null;

// update the seek bar for the clients at intervals
var okToUpdate = true;
// how often to update the client seek bar
var seekBarUpdateInterval = 2000;

var updateSeekBarDisplay = function(percentage) {
  // update the progress bar
  $('.progress-bar').width((percentage * 100) + '%');
}

// to be able to access the template from inside soundmanager callbacks
var hostplayerTemplateInstance;

// now we want all clients to get the same thing
var soundManagerOptions = {
  autoLoad: true,
  autoPlay: false,
  stream: true,
  //onload: function() {
    //var startingPosition;
    //Tracker.nonreactive(function() {
      //OJPlayer.loaded(true);
      //startingPosition = OJPlayer.getStartingPosition();
    //});
    //currentSound.setPosition(startingPosition);
    //currentSound.play();
    //currentSound.pause();
    //Session.set("loading", false);
  //},
  onconnect: function() {
    if (this.connected) {
      console.log("successfully connected");
    } else {
      console.log("error connecting");
    }
  },
  onplay: function() {
    console.log("play called");
    $(".playpause > i").removeClass("fa-play").addClass("fa-pause");
    //console.log(hostplayerTemplateInstance.data);
    OJPlayer.play(hostplayerTemplateInstance.data._id);
  },
  onpause: function() {
    console.log("pause called");
    $(".playpause > i").removeClass("fa-pause").addClass("fa-play");
    OJPlayer.pause(hostplayerTemplateInstance.data._id);
  },
  onload: function(success) {
    //console.log("on load");
    if (!success || this.readyState === 2) {
      this.destruct();
      OJPlayer.currentSound = null;
      OJPlayer.startingPosition = null;
      console.log("error loading, skipping track");
      OJPlayer.nextSong(hostplayerTemplateInstance.data._id,
                        hostplayerTemplateInstance.data.paused);
      updateSeekBarDisplay(0);
    }
  },
  whileplaying: function() {
    updateSeekBarDisplay(this.position / this.durationEstimate);
    // update the position
    if (okToUpdate) {
      // make sure we don't update too often
      okToUpdate = false;
      OJPlayer.setPosition(hostplayerTemplateInstance.data._id, this.position);
      // set a timeout to be able to update again in a few seconds
      Meteor.setTimeout(function() {
        okToUpdate = true;
      }, seekBarUpdateInterval);
    }
  },
  whileloading: function() {
    console.log("loading");
    if (OJPlayer.startingPosition) {
      if (OJPlayer.currentSound.position >= OJPlayer.startingPosition) {
        console.log("setting the position has been done");
        OJPlayer.startingPosition = null;
      } else {
        OJPlayer.currentSound.setPosition(OJPlayer.startingPosition);
      }
    }
  },
  onfinish: function() {
    // destroy the song and remove it from CurrentSong
    console.log("song finished playing");
    //console.log(hostplayerTemplateInstance);
    this.destruct();
    OJPlayer.currentSound = null;
    OJPlayer.startingPosition = null;
    OJPlayer.nextSong(hostplayerTemplateInstance.data._id,
                      hostplayerTemplateInstance.data.paused);
    updateSeekBarDisplay(0);
  }
}

Template.player.helpers({
  mainPlayer: function() {
    return Meteor.connection._lastSessionId === Settings.findOne().playerId;
  },
  playingSong: function() {
    console.log("playingsong called");
    return CurrentSong.findOne();
  },
});

Template.player.created = function() {
  console.log("player created");
  // if it's the first run of the player, start off paused
  var current = CurrentSong.findOne();
  if (current) {
    console.log("setting song to initially be paused");
    OJPlayer.pause(current._id);
  }
}

Template.hostPlayer.rendered = function() {
  console.log("hostplayer template rendered");
  hostplayerTemplateInstance = this;
  SC.whenStreamingReady(function() {
    console.log("streaming ready");
    // makes sure this autorun gets destroyed when the hostplayer template is
    hostplayerTemplateInstance.autorun(function() {
      // if there's already a sound, get rid of it first so two don't start
      // playing at the same time
      OJPlayer.currentSound && OJPlayer.currentSound.destruct();
      OJPlayer.currentSound = null;
      OJPlayer.startingPosition = null;
      console.log("autorun");
      // this should set up a reactive variable
      var url = CurrentSong.findOne({}, {fields: {stream_url: 1}});
      //console.log(hostplayerTemplateInstance.data);
      //console.log(url);
      //console.log(soundManager.canPlayURL(url.stream_url));
      if (url) {
        SC.stream(
          url.stream_url, soundManagerOptions, function(sound) {
          console.log("streaming sound successful and created");
          OJPlayer.currentSound = sound;
          console.log("getting paused value");
          //var paused = hostplayerTemplateInstance.data.paused;
          //console.log(paused);
          // need this nonreactive because for some reason, the template data
          // context does not update yet
          Tracker.nonreactive(function() {
            OJPlayer.startingPosition = CurrentSong.findOne(
              {},
              {fields: {position: 1}}
            ).position;
          });
          //console.log(hostplayerTemplateInstance.data);
          console.log(OJPlayer.startingPosition);
          OJPlayer.currentSound.play();
          if (hostplayerTemplateInstance.data.paused) {
            console.log("paused!");
            OJPlayer.currentSound.pause();
          }
        });
      }
    });
  });
  // to handle playing/pausing using spacebar
  $(document).off('.hostplayer').on("keydown.hostplayer", function(event) {
    console.log("keydown event");
    if (event.which === 32 && document.activeElement.tagName !== "INPUT") {
      console.log("spacebar pressed");
      OJPlayer.currentSound.togglePause();
    }
  });
}

Template.hostPlayer.helpers({
  //loadStreaming: function() {
    //if (!this.loaded && Session.equals("loading", false)) {
      // don't want the song loading multiple times
      //Session.set("loading", true);
    //console.log("loadstreaming called");
      //SC.stream(
        //this.uri, soundManagerOptions, function(sound) {
        //currentSound = sound;
      //});
    //}
  //},
  //playingSong: function() {
    //return CurrentSong.findOne();
  //},
  playPauseIcon: function() {
    //if (this.paused) {
      //if (_.isObject(currentSound) &&
          //this.loaded &&
          //currentSound.paused === false) {
        //currentSound.pause();
      //}
      //return "play";
    //} else {
      //if (_.isObject(currentSound) &&
          //this.loaded &&
          //currentSound.paused === true) {
        //currentSound.resume();
      //}
      //return "pause";
    //}
    //return "play";
  },
  playerDisabled: function() {
    //return this.loaded ? "" : "disabled";
    return "";
  },
});

Template.clientPlayer.helpers({
  playingSong: function() {
    return CurrentSong.findOne();
  },
  playPauseIcon: function() {
    return this.paused ? "play" : "pause";
  },
  playerDisabled: function() {
    //return this.loaded ? "" : "disabled";
    return "";
  },
  updateSeekBar: function() {
    updateSeekBarDisplay(this.position / this.duration);
  }
});

Template.hostPlayer.events({
  // use togglepause on this one (soundmanager2 library)
  "click .playpause, touchstart .playpause" : function(event) {
    //event.preventDefault();
    //if (this.loaded === false) {
      //return;
    //}
    OJPlayer.currentSound.togglePause();
    //if ($(".playpause").has(".fa-play").length) {
      //CurrentSong.update(this._id, {
        //$set: {paused: false}
      //});
      //$(".fa-play").switchClass("fa-play", "fa-pause");
    //} else {
      //CurrentSong.update(this._id, {
        //$set: {paused: true}
      //});
      //$(".fa-pause").switchClass("fa-pause", "fa-play");
    //}
  },
  "touchend .playpause": function(event) {
    // click doubles as a touchend event, so prevent doubling up
    event.preventDefault();
  },
  //"click .ff-next, touchstart .ff-next": function(event) {
    ////event.preventDefault();
    ////if (this.loaded === false) {
      ////return;
    ////}
    //console.log("next clicked");
    //var self = this;
    //OJPlayer.currentSound.destruct();
    //OJPlayer.nextSong(self._id, self.paused);
    //updateSeekBarDisplay(0);
  //},
  //"touchend .ff-next": function(event) {
    //event.preventDefault();
  //},
  "click .backward-fifteen, touchstart .backward-fifteen": function(event) {
    //event.preventDefault();
    //if (this.loaded === false) {
      //return;
    //}
    // rewind 15 seconds
    OJPlayer.currentSound.setPosition(OJPlayer.currentSound.position - 15000);
  },
  "touchend .backward-fifteen": function(event) {
    event.preventDefault();
  },
  "click .forward-fifteen, touchstart .forward-fifteen": function(event) {
    //event.preventDefault();
    //if (this.loaded === false) {
      //return;
    //}
    // skip ahead 15 seconds
    OJPlayer.currentSound.setPosition(OJPlayer.currentSound.position + 15000);
  },
  "touchend .forward-fifteen": function(event) {
    event.preventDefault();
  },
});

Template.clientPlayer.events({
  "click .playpause, touchstart .playpause": function(event) {
    event.preventDefault();
    if (this.loaded === false) {
      return;
    }
    if ($(".playpause").has(".fa-play").length) {
      CurrentSong.update(this._id, {
        $set: {paused: false}
      });
      $(".fa-play").switchClass("fa-play", "fa-pause");
    } else {
      CurrentSong.update(this._id, {
        $set: {paused: true}
      });
      $(".fa-pause").switchClass("fa-pause", "fa-play");
    }
  },
});

