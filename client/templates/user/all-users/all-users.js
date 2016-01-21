/**
 * Created by cy on 21/01/16.
 */

"use strict";

var limit = 10;

Template.allUsers.onCreated(function () {
  var template = this;
  template.ready = new ReactiveVar();
  SEO.set({ title: "92Hackers - 所有成员"});
  template.autorun(function () {
    GlobalObject.subscribeCache.subscribe("newestUsers", limit);
    template.ready.set(GlobalObject.subscribeCache.ready());
  });
});

Template.allUsers.helpers({
  ready: function () {
    return Template.instance().ready.get();
  },
  allUsers: function () {
    return Meteor.users.find({}, {sort: {createdAt: -1}, limit: limit});
  }
});

Template.allUsers.onDestroyed(function () {
  GlobalObject.subscribeCache.clear();
});