/**
 * Created by cy on 20/01/16.
 */

"use strict";

var isYourOwnSubscriptions = new ReactiveVar(false);

Template.userSubscriptions.onCreated(function () {
  var template = this;
  template.ready = new ReactiveVar();
  template.autorun(function () {
    var uid = FlowRouter.getParam("uid");
    if (Meteor.user() && Meteor.userId() === uid) {
      isYourOwnSubscriptions.set(true);
    }
    if (!Meteor.user()) {
      isYourOwnSubscriptions.set(false);
    }
    SEO.set({ title: "92hackers - " + "我的关注"});
    GlobalObject.subscribeCache.subscribe("userSubscriptions", uid);
    template.ready.set(GlobalObject.subscribeCache.ready());
  });
});

Template.userSubscriptions.onRendered(function () {
  var template = this;
  template.autorun(function () {
    if (template.ready.get()) {
      var timeId = Meteor.setTimeout(function () {
        $.material.init();

        var elements = template.$(".single-project-card-wrap");
        if (elements.size()) {
          GlobalObject.projectCard(elements);
        }

        $(window).on("resize", function ( event ) {
          GlobalObject.projectCard(elements);
        });

        Meteor.clearTimeout(timeId);
      }, 100);
    }
  });
});

Template.userSubscriptions.helpers({
  ready: function () {
    return Template.instance().ready.get();
  },
  hasSubscriptions: function () {
    var subscriptions = ProjectSubscribe.find({userId: FlowRouter.getParam("uid")});
    return subscriptions.count() ? true : false;
  },
  subscribedProjects: function () {
    var subscriptions = ProjectSubscribe.find({userId: FlowRouter.getParam("uid")});
    if (subscriptions.count()) {
      var projectIds = subscriptions.map(function ( subscription ) {
        return subscription.projectId;
      });
      var projects = [];
      _.each(projectIds, function ( pid, index ) {
        var currentProject = Project.findOne({ _id: pid });
        var username = Meteor.users.findOne({ _id: currentProject.owner }, { fields: { username: 1 } });
        projects.push({
          projectInfo: currentProject,
          ownerUsername: username
        });
      });
      return projects;
    }
  }
});

Template.userSubscriptions.onDestroyed(function () {
  GlobalObject.subscribeCache.clear();
});