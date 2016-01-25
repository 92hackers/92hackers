/**
 * Created by cy on 21/01/16.
 */

"use strict";

var limit = 10;

Template.allProjects.onCreated(function () {
  var template = this;
  template.ready = new ReactiveVar();
  SEO.set({ title: "92Hackers - 所有项目"});
  template.autorun(function () {
    GlobalObject.subscribeCache.subscribe("newestProjects", limit);
    template.ready.set(GlobalObject.subscribeCache.ready());
  });
});

Template.allProjects.onRendered(function () {
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

Template.allProjects.helpers({
  ready: function () {
    return Template.instance().ready.get();
  },
  allProjects: function () {
    var projects =  Project.find({}, {sort: {createdAt: -1}, limit: limit});
    var results = [];
    if (projects.count()) {
      projects.forEach(function ( singleProject ) {
        var project = singleProject;
        var username = Meteor.users.findOne({ _id: project.owner }, { fields: { username: 1 } });
        results.push({
          projectInfo: project,
          ownerUsername: username
        });
      });
      return results;
    }
  }
});

Template.allProjects.onDestroyed(function () {
  GlobalObject.subscribeCache.clear();
});
