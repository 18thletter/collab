Template.playlist.helpers({
  currentSong: function() {
    return CurrentSong.findOne({
      boxname: Meteor.user().profile.boxname.toLowerCase()
    });
  },
  song: function() {
    return Playlist.find(
      {boxname: Meteor.user().profile.boxname.toLowerCase()},
      // sort by voteTotal, which is upvotes - downVotes,
      // breaking ties by time added
      {sort: [["voteTotal", "desc"], ["addedAt", "asc"]]}
    );
  },
  // TODO: need to change the color of the icons if they're disabled
  thumbUpIcon: function() {
    return _.contains(this.userIdsWhoVotedUp, Meteor.userId()) ?
      "fa-thumbs-up" : "fa-thumbs-o-up";
  },
  thumbDownIcon: function() {
    return _.contains(this.userIdsWhoVotedDown, Meteor.userId()) ?
      "fa-thumbs-down" : "fa-thumbs-o-down";
  },
  voteDisabled: function() {
    return (_.contains(this.userIdsWhoVotedUp, Meteor.userId()) ||
            _.contains(this.userIdsWhoVotedDown, Meteor.userId()) ||
            this.addedByUserId === Meteor.userId()) ?
            "vote-disabled" : "";
  },
  tooltipUp: function() {
    return (_.contains(this.userIdsWhoVotedUp, Meteor.userId()) ||
            _.contains(this.userIdsWhoVotedDown, Meteor.userId()) ||
            this.addedByUserId === Meteor.userId()) ?
            "You've added this song or already voted it up" : "Vote this song up";
  },
  tooltipDown: function() {
    return (_.contains(this.userIdsWhoVotedUp, Meteor.userId()) ||
            _.contains(this.userIdsWhoVotedDown, Meteor.userId()) ||
            this.addedByUserId === Meteor.userId()) ?
            "You've added this song or already voted it down" : "Vote this song down";
  },
  noSongs: function() {
    return CurrentSong.find({
      boxname: Meteor.user().profile.boxname.toLowerCase()
    }).count() === 0;
  },
  removeSongIcon: function() {
    return this.addedByUserId === Meteor.userId() ? "fa-times" : "";
  },
  removeDisabled: function() {
    return this.addedByUserId === Meteor.userId() ? "" : "remove-disabled";
  },
  tooltipRemove: function() {
    return this.addedByUserId === Meteor.userId() ? "Remove from playlist" : "";
  },
});

Template.playlist.events({
  "click .upvote": function(event) {
    var currentTarget = $(event.currentTarget);
    if (currentTarget.hasClass("vote-disabled")) {
      return;
    }

    Playlist.update(this._id, {
      $push: {userIdsWhoVotedUp: Meteor.userId()},
      $inc: {upvotes: 1, voteTotal: 1}
    });
    $(event.currentTarget).addClass("vote-disabled");

    // prevent default form submit
    return false
  },
  "click .downvote": function(event) {
    var currentTarget = $(event.currentTarget);
    if (currentTarget.hasClass("vote-disabled")) {
      return;
    }

    // remove the song if it's unanimously downvoted
    // removed for now because I removed the user status package. put it back in later
    //var downvotes = this.downvotes;
    //Meteor.call("getOnlineUserCount", function(error, result) {
      //if (result > 2 && downvotes >= result - 2) {
        //Playlist.remove(this._id);
      //}
    //});
    Playlist.update(this._id, {
      $push: {userIdsWhoVotedDown: Meteor.userId()},
      $inc: {downvotes: 1, voteTotal: -1}
    });
    $(event.currentTarget).addClass("vote-disabled");

    // prevent default form submit
    return false
  },
  "click .remove-song": function(event) {
    var currentTarget = $(event.currentTarget);
    if (currentTarget.hasClass("remove-disabled")) {
      return;
    }
    Playlist.remove(this._id);

    // prevent default form submit
    return false
  }
});
