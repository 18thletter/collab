Router.route('login', {
  onBeforeAction: function() {
    if (Meteor.userId()) {
      this.redirect('player');
    }
  },
  fastRender: true,
});
Router.route('player', {
  template: 'playerPage',
  waitOn: function() {
    return [
      Meteor.subscribe("currentSong"),
      Meteor.subscribe("playlist"),
      Meteor.subscribe("chatUsers"),
    ];
  },
  onBeforeAction: function() {
    if (!Meteor.userId()) {
      this.redirect('login');
    }
  },
  fastRender: true,
});
Router.route('/', {
  template: 'home',
  onBeforeAction: function() {
    if (!Meteor.userId()) {
      this.redirect('login');
    } else {
      this.redirect('player');
    }
  }
})
