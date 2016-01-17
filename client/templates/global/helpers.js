/**
 * Created by cy on 27/12/15.
 * this file includes global registered helpers.
 */

"use strict";

Template.registerHelper("avatarOrDefault", function () {
  return (this.profile && this.profile.avatar && "http://7xoi1c.com1.z0.glb.clouddn.com/" + this.profile.avatar) || "/images/default-avatar.png";
});

Template.registerHelper("loggedIn", function () {
  return Session.get("loggedIn");
});

