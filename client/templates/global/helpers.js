/**
 * Created by cy on 27/12/15.
 * this file includes global registered helpers.
 */

"use strict";

Template.registerHelper("avatarOrDefault", function () {
  return (this.profile && this.profile.avatar) || "/images/default-avatar.png";
});

Template.registerHelper("siteTitle", function () {
  return GlobalObject.siteTitle.get() || {};
});