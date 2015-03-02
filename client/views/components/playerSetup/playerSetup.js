Template.playerSetup.events({
  "submit .player-setup form": function(event) {
    // make sure this runs only once when the main player is set up
    Tracker.nonreactive(function() {
        // load in a song from the top of the playlist if the current
        // song is empty
        if (CurrentSong.find().count() === 0) {
          OJPlayer.nextSong();
        }
        // start off the player paused and make sure loaded status
        // is set as off
        if (CurrentSong.find().count() !== 0) {
          CurrentSong.update(CurrentSong.findOne()._id, {
            $set: {paused: true, loaded: false}
          });
        }
    });

    // use the session id, and not the user id, so it's limited to 1 window
    Settings.update(Settings.findOne()._id, {
      $set: {playerId: Meteor.connection._lastSessionId}
    });

    // prevent default form submit
    return false
  }
});
