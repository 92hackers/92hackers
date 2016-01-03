/**
 * Created by cy on 03/01/16.
 */

"use strict";

Meteor.startup(function () {
  if ( !Accounts.userId() ) {
    Session.set("loggedIn", false);
  }
});