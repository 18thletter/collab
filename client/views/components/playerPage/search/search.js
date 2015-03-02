// limit results and instant results
var maxResults = 20;
// minimum song length
// 120000 = 2 minutes
var minSongLength = 120000;
// maximum song length
// 600000 = 10 minutes
var maxSongLength = 600000;

// collection for results. only a local collection
SearchResults = new Meteor.Collection(null);
// to track adds to the playlist
PlaylistTracker = new Meteor.Stream("playlistTracker");
PlaylistTracker.on("songAdded", function() {
  if (!Session.equals("selectedTab", "playlist")) {
    Session.set("missedPlaylist", Session.get("missedPlaylist") + 1);
  }
});

var processSearchResults = function(tracks, query) {
  // clear the results
  SearchResults.remove({});
  $(".searching").hide();
  if (_.size(tracks)) {
    $(".results-message").show();
  } else {
    $(".no-results").show();
  }
  _.each(tracks, function(track, key, list) {
    if (track.streamable) {
      if (Playlist.find({
        id: track.id,
        boxname: Meteor.user().profile.boxname.toLowerCase()
      }).count()) {
        track.inPlaylist = true;
      } else {
        track.inPlaylist = false;
      }
      SearchResults.insert({
        id: track.id,
        duration: track.duration,
        original_content_size: track.original_content_size,
        tag_list: track.tag_list,
        purchase_title: track.purchase_title,
        genre: track.genre,
        title: track.title,
        description: track.description,
        track_type: track.track_type,
        video_url: track.video_url,
        uri: track.uri,
        permalink_url: track.permalink_url,
        artwork_url: track.artwork_url,
        stream_url: track.stream_url,
        inPlaylist: track.inPlaylist,
      });
    }
  });
  // highlight the instant search results
  $(".search-results tbody").highlight(query.split(" "));
}

var getSearchResults = function(query) {
  if (!query) {
    return;
  }
  $(".query").html(query);
  SC.get("/tracks", {
    limit: maxResults,
    q: query,
    // there is a bug in the soundcloud api where the filter option
    // is ignored when there is a query option. i'm including it
    // anyway so when it's fixed it'll work
    filter: {streamable: true},
    duration: {from: minSongLength, to: maxSongLength}
  }, function(tracks, error) {
    if (error) {
      $(".searching").hide();
      $(".error").show();
      return;
    }
    processSearchResults(tracks, query);
  });
}

Template.search.events({
  "submit .search form": function(event) {
    var query = $(".search input[type=search]").val().trim();
    if (query) {
      $(".results-message").hide();
      $(".no-results").hide();
      $(".error").hide();
      $(".searching").show();
      getSearchResults(query);
    }

    // prevent default form submit
    return false
  },
  "click .add-to-playlist": function(event) {
    OJPlayer.addSongToPlaylist(this);
    if (!Session.equals("selectedTab", "playlist")) {
      Session.set("missedPlaylist", Session.get("missedPlaylist") + 1);
    }
    PlaylistTracker.emit("songAdded");
    $(event.currentTarget).parent().addClass("in-playlist");
    $(".added").fadeIn("fast").delay(1000).fadeOut("slow");

    // prevent default form submit
    return false
  }
});

Template.search.helpers({
  searchResults: function() {
    return SearchResults.find({inPlaylist: false});
  },
});

Template.searchResult.helpers({
  inPlaylist: function() {
    if (Playlist.find({
      id: this.id,
      boxname: Meteor.user().profile.boxname.toLowerCase()
    }).count()) {
      if (!this.inPlaylist) {
        SearchResults.update(this._id, {
          $set: {inPlaylist: true}
        });
      }
      return "in-playlist";
    }
    if (this.inPlaylist) {
      SearchResults.update(this._id, {
        $set: {inPlaylist: false}
      });
    }
    return "";
  },
});
