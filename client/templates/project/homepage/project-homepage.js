/**
 * Created by cy on 23/12/15.
 */

"use strict";

Template.projectHomepage.onCreated(function () {
  var self = this;
  self.ready = new ReactiveVar();
  self.autorun(function () {
    var projectId = FlowRouter.getParam("pid");
    GlobalObject.subscribeCache.subscribe("singleProject", projectId, {onReady: function () {
          var project = Project.findOne({_id: projectId});
          SEO.set({
            title: "92Hackers - " + project.name
          });
        }}
    );
    GlobalObject.subscribeCache.subscribe("projectOwnerProfile", projectId);
    self.ready.set(GlobalObject.subscribeCache.ready());
  });
});

Template.projectHomepage.onRendered(function () {

  var timeId = Meteor.setInterval(function () {
    if ( $("#edit-button").size() && $("#save-button").size() || $("#join-button").size() ) {
      $.material.init();
      Meteor.clearInterval(timeId);
    }
  }, 500);
});

Template.projectHomepage.helpers({
  projectReady: function () {
    return Template.instance().ready.get();
  },
  singleProject: function () {
    var projectId = FlowRouter.getParam("pid");
    return Project.findOne({_id: projectId}) || {};
  },
  projectOwnerProfile: function () {
    return Meteor.users.findOne({_id: this.owner}, {limit: 1, fields: {username: 1, profile: 1}}) || {};
  },
  publishDate: function () {
    var createdAt = this.createdAt;
    var publishDate = {
      fullYear: createdAt.getFullYear(),
      month: createdAt.getMonth() + 1,      // month count from 0.
      date: createdAt.getDate()
    };
    return publishDate || {};
  },
  isProjectOwner: function () {
    var projectOwner = this.owner;
    return Meteor.userId() === projectOwner;
  }
});
