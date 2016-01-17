/**
 * Created by cy on 12/01/16.
 */

"use strict";

var isYourOwnSettings = new ReactiveVar();

Template.userSettings.onCreated(function () {
  var template = this;
  template.ready = new ReactiveVar();
  template.autorun(function () {
    var uid = FlowRouter.getParam("uid");
    if ( !!Meteor.user() && Meteor.userId() === uid ) {
      isYourOwnSettings.set(true);
    }
    if (!Meteor.user()) {     // log out.
      isYourOwnSettings.set(false);
    }
  });
});

Template.userSettings.onRendered(function () {
  var template = this;
  template.autorun(function () {
    GlobalObject.subscribeCache.subscribe("userInfo", {
      onReady: function () {
        SEO.set({
          title: "92hackers - 设置"
        });
      }
    });
    template.ready.set(GlobalObject.subscribeCache.ready());
    if (template.ready.get()) {
      var timeId = Meteor.setTimeout(function () {
        // dom manipulations.
        $.material.init();

        Meteor.clearTimeout(timeId);
      }, 100);
    }
  });
});

Template.userSettings.helpers({
  isYourOwnSettings: function () {
    return isYourOwnSettings.get();
  },
  ready: function () {
    return Template.instance().ready.get();
  },
  userInfo: function () {
    return Meteor.users.findOne({_id: Meteor.userId()}) || {};
  }
});

Template.userSettings.events({
  "show.bs.tab a[data-toggle=tab]": function ( event, template ) {
  },
  "hidden.bs.modal #upload-avatar-modal": function ( event, template ) {
    $("#cropBtn").text("上传").removeClass("text-success");
  }
});