/**
 *   to look up user typed username in the user collection
 * Created by cy on 13/12/15.
 */

"use strict";

Meteor.methods({
  usernameExistDetect: function (username) {
    check(username, String);
    var result = Accounts.findUserByUsername(username);

    // if exist one, return 1, else, 0.
    return !result ? 0 : 1;
  },
  changeUsername: function ( newUsername ) {
    check(newUsername, String);
    if (this.userId) {
      Accounts.setUsername(this.userId, newUsername);
    } else {
      return false;
    }
  }
});
