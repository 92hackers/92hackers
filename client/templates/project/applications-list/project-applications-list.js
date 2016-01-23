/**
 * Created by cy on 23/01/16.
 */

"use strict";

var isProjectOwner = new ReactiveVar(false);

Template.projectApplicationsList.onCreated(function () {
  var template = this;
  template.ready = new ReactiveVar();
  template.autorun(function () {
    SEO.set({ title: "92Hackers - 项目申请者列表"});
    var pid = FlowRouter.getParam("pid");
    GlobalObject.subscribeCache.subscribe("projectApplications", pid);
    template.ready.set(GlobalObject.subscribeCache.ready());
  });

  template.autorun(function () {
    var currentProject = Project.findOne({_id: FlowRouter.getParam("pid")});
    if (!!Meteor.user() && currentProject && Meteor.userId() === currentProject.owner) {
      isProjectOwner.set(true);
    }
    if (!Meteor.user()) {             // log out from current session.
      isProjectOwner.set(false);
    }
  });
});

Template.projectApplicationsList.onRendered(function () {
  var template = this;
  template.autorun(function () {
    if (template.ready.get()) {
      var timeId = Meteor.setTimeout(function () {
        $.material.init();
        Meteor.clearTimeout(timeId);
      }, 100);
    }
  });
});

Template.projectApplicationsList.helpers({
  ready: function () {
    return Template.instance().ready.get();
  },
  isProjectOwner: function () {
    return isProjectOwner.get();
  },
  applications: function () {
    var pid = FlowRouter.getParam("pid");
    var applications = ProjectApplications.find({projectId: pid});
    return applications.map(function ( singleApplication ) {
      return {
        userInfo: Meteor.users.findOne({_id: singleApplication.userId}),
        positionApplyFor: singleApplication.positionApplyFor,
        status: singleApplication.status
      }
    });
  },
  isApplied: function (parentContext) {
    return parentContext.status === "applied";
  },
  isAgreed: function ( parentContext ) {
    return parentContext.status === "agreed";
  },
  isDenied: function ( parentContext ) {
    return parentContext.status === "denied";
  },
  isFired: function ( parentContext ) {
    return parentContext.status === "fired";
  }
});

Template.projectApplicationsList.events({
  "click .go-back": function ( event, template ) {
    FlowRouter.go("projectHomepage", {pid: FlowRouter.getParam("pid")});
  },
  "click .application-agree": function ( event, template ) {
    event.stopPropagation();
    var isConfirmed = confirm("在同意之前，请确定你已经与对方取得联系，并且他同意你的做法。");
    var uid = template.$(event.currentTarget).data().uid;
    var pid = FlowRouter.getParam("pid");
    if (isConfirmed) {
      Meteor.call("updateApplication", pid, uid, "agreed", function ( err, result ) {
        var positionApplyFor = ProjectApplications.findOne({projectId: pid, userId: uid}).positionApplyFor;
        // todo: if below sentences can be simplified.
        if (!err) {
          switch (positionApplyFor.type) {
            case "产品":
              Project.update({_id: pid}, {$pull: {productHire: {category: positionApplyFor.position}}});
              break;
            case "技术":
              Project.update({_id: pid}, {$pull: {techHire: {category: positionApplyFor.position}}});
              break;
            case "设计":
              Project.update({_id: pid}, {$pull: {designHire: {category: positionApplyFor.position}}});
              break;
          }
        } else {
          alert("出现错误，稍后请重试！");
        }
      });
    }
  },
  "click .application-deny": function ( event, template ) {
    event.stopPropagation();
    var isConfirmed = confirm("在拒绝之前，请确定你跟对方已经充分沟通过，并且认为他不合适。");
    var uid = template.$(event.currentTarget).data().uid;
    var pid = FlowRouter.getParam("pid");
    if (isConfirmed) {
      Meteor.call("updateApplication", pid, uid, "denied", function ( err, result ) {
        if (err) {
          alert("出现错误，稍后请重试！");
        }
      });
    }
  },
  "click .application-fire": function ( event, template ) {
    event.stopPropagation();
    var isConfirmed = confirm("开除之前，请确定你跟对方已经充分沟通过，并且认为他不能胜任这份工作。");
    var uid = template.$(event.currentTarget).data().uid;
    var pid = FlowRouter.getParam("pid");
    if (isConfirmed) {
      Meteor.call("updateApplication", pid, uid, "fired", function ( err, result ) {
        var positionApplyFor = ProjectApplications.findOne({projectId: pid, userId: uid}).positionApplyFor;
        if (!err) {
          switch(positionApplyFor.type) {
            case "产品":
              Project.update({_id: pid}, {$push: {productHire: {category: positionApplyFor.position, salary: positionApplyFor.salary}}});
              break;
            case "技术":
              Project.update({_id: pid}, {$push: {techHire: {category: positionApplyFor.position, salary: positionApplyFor.salary}}});
              break;
            case "设计":
              Project.update({_id: pid}, {$push: {designHire: {category: positionApplyFor.position, salary: positionApplyFor.salary}}});
              break;
          }
        } else {
          alert("出现错误，稍后请重试！");
        }
      });
    }
  }
});

Template.projectApplicationsList.onDestroyed(function () {
  GlobalObject.subscribeCache.clear();
});