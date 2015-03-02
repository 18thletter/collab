Template.login.events({
  "submit .login form": function(event) {
    var username = $(".name").val();
    var boxname = $(".box").val();
    Meteor.insecureUserLogin(username, boxname);

    // prevent default form submit
    return false
  }
});
