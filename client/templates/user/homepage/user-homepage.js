/**
 * Created by cy on 28/12/15.
 */

"use strict";

var isYourOwnHomepage = new ReactiveVar(false);
var goToEdit = false;

Template.userHomepage.onCreated(function () {
  var template = this;
  template.subscriptionReady = new ReactiveVar();
  template.autorun(function () {
    var uid = FlowRouter.getParam("uid");
    var routeUser = Meteor.users.findOne({_id: uid});
    console.log("route user: " + routeUser);
    if (Meteor.userId() && routeUser && routeUser._id === Meteor.userId()) {
      isYourOwnHomepage.set(true);
      console.log(isYourOwnHomepage.get());
    }
    if (!Meteor.user()) {       // user logout.
      isYourOwnHomepage.set(false);
    }
  });
});

Template.userHomepage.onRendered(function () {
  var template = this;
  template.autorun(function () {
    var uid = FlowRouter.getParam("uid");
    GlobalObject.subscribeCache.subscribe("singleUser", uid, {      // only run once. and then cache it.
      onReady: function () {
        var user = Meteor.users.findOne({_id: uid});
        if (user) {
          SEO.set({
            title: "92Hackers - " + user.username
          });
        }
      }
    });
    template.subscriptionReady.set(GlobalObject.subscribeCache.ready());
    if (template.subscriptionReady.get()) {
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
  template.autorun(function () {
    if (isYourOwnHomepage.get() && template.subscriptionReady.get()) {
      var timeId = Meteor.setTimeout(function () {
        if (Meteor.user().isNewUser) {
          template.$("#new-user-tooltip-modal").modal("show");
        }
        Meteor.clearTimeout(timeId);
      }, 100);
    }
  });
});

Template.userHomepage.helpers({
  subscriptionReady: function () {
    return Template.instance().subscriptionReady.get();
  },
  user: function () {
    var uid = FlowRouter.getParam("uid");
    console.log("nice to meet you");
    return Meteor.users.findOne({_id: uid}) || {};
  },
  email: function () {
    var emails = this.profile.emails;
    return emails[0].address;
  },
  joinDate: function () {
    var joinDate = this.createdAt;
    return {
      year: joinDate.getFullYear(),
      month: joinDate.getMonth() + 1,
      day: joinDate.getDate()
    }
  },
  isYourOwnHomepage: function () {
    return isYourOwnHomepage.get();
  },
  hasIdeasCreated: function () {
    if (this.ideas) {
      return this.ideas.length > 0;
    }
  },
  hasNoProjects: function () {
    var uid = FlowRouter.getParam("uid");
    var createdProjects = Project.find({owner: uid});
    var appliedProjects = ProjectApplications.find({userId: uid});
    var subscribedProjects = ProjectSubscribe.find({userId: uid});

    return !!( !createdProjects.count() && !appliedProjects.count() && !subscribedProjects.count() );
  },
  createdProjects: function () {
    var projects = Project.find({owner: FlowRouter.getParam("uid")});
    var results = [];
    if (projects.count()) {
      projects.forEach(function ( project ) {
        var project = project;
        var username = Meteor.users.findOne({ _id: project.owner }, { fields: { username: 1 } });
        results.push({
          projectInfo: project,
          ownerUsername: username,
          label: '<span class="label label-primary">创建者</span>'
        });
      });
      return results;
    }
  },
  appliedProjects: function () {
    var applications = ProjectApplications.find({userId: FlowRouter.getParam("uid")}, {fields: {projectId: 1}});
    if (applications.count()) {
      var projectIds = applications.map(function ( application ) {
        return application.projectId;
      });
      var projects = [];
      // below code could be refactored to be single function.
      _.each(projectIds, function ( pid, index ) {
        var currentProject = Project.findOne({ _id: pid });
        var username = Meteor.users.findOne({ _id: currentProject.owner }, { fields: { username: 1 } });
        projects.push({
          projectInfo: currentProject,
          ownerUsername: username,
          label: '<span class="label label-success">正在参与</span>'
        });
      });
      return projects;
    }
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
          ownerUsername: username,
          label: '<span class="label label-default">正在关注</span>'
        });
      });
      return projects;
    }
  }
});

Template.userHomepage.events({
  "click #new-user-edit-button": function ( event, template ) {
    goToEdit = true;
    template.$("#new-user-tooltip-modal").modal("hide");
  },
  "hidden.bs.modal #new-user-tooltip-modal": function ( event, template ) {
    if (goToEdit) {
      goToEdit = false;
      FlowRouter.go("userSettings", {uid: Meteor.userId()});
    }
  }
});
