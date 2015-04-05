Meteor.collectionHelpers = {
  getChatUsers : function() {
		var theUser
		if (Meteor.isClient) {
			theUser = Meteor.user()
		} else {
			if (this.userId) {
				theUser = Meteor.users.findOne(this.userId)
			} else {
				return []
			}
		}
    return Meteor.users.find({
      "profile.boxname": theUser.profile.boxname.toLowerCase()
    }, {fields: {'username': 1, 'profile.boxname': 1}})
	}
}
