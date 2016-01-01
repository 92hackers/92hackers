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
  projectHireRest: function () {
    var hireList = this.productHire;
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

Template.projectHomepage.events({
  "click #edit-button": function ( event, template ) {
    var editableElems = template.$(".editable");
    var editableDemoUrl = template.$(".editable-item");

    var editButton = template.$("#edit-button");
    var saveButton = template.$("#save-button");
    var cancelButton = template.$("#cancel-button");

    editableElems.addClass("site-inline-edit-wrap").attr("contenteditable", true);
    editableDemoUrl.addClass("site-inline-edit-item-wrap").attr("contenteditable", true);

    editButton.hide();
    saveButton.show();
    cancelButton.show();
  },
  "click #cancel-button": function ( event, template ) {

    var editButton = template.$("#edit-button");
    var saveButton = template.$("#save-button");
    var cancelButton = template.$("#cancel-button");

    var editableElems = template.$(".editable");
    var editableDemoUrl = template.$(".editable-item");

    _.each(editableElems, function ( item, index ) {
      var elemsId = item.id;
      $("#" + elemsId).text($("#" + elemsId + "-clone").text())
          .removeClass("site-inline-edit-wrap")
          .attr("contenteditable", false);
    });

    editableDemoUrl.html($("#demo-url-clone").html())
        .removeClass("site-inline-edit-item-wrap")
        .attr("contenteditable", false);

    cancelButton.hide();
    saveButton.hide();
    editButton.show();
  },
  "click .fa-minus": function ( event, template ) {
    $(event.currentTarget).closest("li").remove();
  }
});
