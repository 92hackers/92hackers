/**
 *  this is the real home page if you login.
 * Created by cy on 07/12/15.
 */

Template.login.onCreated(function () {
  var template = this;
  var projectLimit = 4;
  var userLimit = 6;
  template.ready = new ReactiveVar();
  template.autorun(function () {
    "use strict";
    SEO.set({ title: "92Hackers - 最新创建的项目和最新加入的黑客"});
    GlobalObject.subscribeCache.subscribe("newestProjects", projectLimit);
    GlobalObject.subscribeCache.subscribe("newestUsers", userLimit);
    template.ready.set(GlobalObject.subscribeCache.ready());
  });
});

Template.login.onRendered(function () {
  var template = this;
  template.autorun(function () {
    "use strict";
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

Template.login.helpers({
  ready: function () {
    return Template.instance().ready.get();
  },
  newestUsers: function () {
    return Meteor.users.find({}, {sort: {createdAt: -1}, limit: 6});
  },
  newestProjects: function () {
    var projects =  Project.find({}, {sort: {createdAt: -1}, limit: 4});
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


Template.login.onDestroyed(function () {
  "use strict";
  GlobalObject.subscribeCache.clear();
});
