Router.route('/', function() {
  if (Meteor.user()) {
    this.redirect('player');
  } else {
    this.redirect('login');
  }
});
Router.route('login', function() {
  this.render('login');
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
