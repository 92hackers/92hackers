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
  productPositionsRest: function () {
    var positionsInList = this.productHire;
    var positionsSelected = [];
    _.each(positionsInList, function ( item, index ) {
      positionsSelected.push(item.category);
    });
    return _.difference(GlobalObject.positionsList.product, positionsSelected) || [];
  },
  techPositionsRest: function () {
    var positionsList = this.techHire;
    var positionsSelected = [];
    _.each(positionsList, function ( item, index ) {
      positionsSelected.push(item.category);
    });
    return _.difference(GlobalObject.positionsList.tech, positionsSelected) || [];
  },
  designPositionsRest: function () {
    var positionsList = this.designHire;
    var positionsSelected = [];
    _.each(positionsList, function ( item, index ) {
      positionsSelected.push(item.category);
    });
    return _.difference(GlobalObject.positionsList.design, positionsSelected) || [];
  },
  isPay: function (parentContext) {
    return parentContext.payOrNot === "pay" || {};
  },
  coopToolsRest: function () {
    return _.difference(GlobalObject.servicesList.cooperationTools, this.cooperationTools) || [];
  },
  comToolsRest: function () {
    return _.difference(GlobalObject.servicesList.communicationTools, this.communicationTools) || [];
  },
  fileToolsRest: function () {
    return _.difference(GlobalObject.servicesList.fileTools, this.fileTools) || [];
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
  isProjectOwner: function (parentContext) {
    var projectOwner = parentContext || this;
    return Meteor.userId() === projectOwner.owner;
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

    // show plus and minus icon.
    $(".fa-plus").show();
    $(".fa-minus").show();

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

    // hide plus and minus icon.
    $(".fa-plus").hide();
    $(".fa-minus").hide();

    cancelButton.hide();
    saveButton.hide();
    editButton.show();
  },
  "click #save-button": function ( event, template ) {
    // hide plus and minus icon.
    template.$(".fa-plus").hide();
    template.$(".fa-minus").hide();
  },
  "click .hide-on-edit": function ( event, template ) {
    var currentElem = template.$(event.currentTarget);
    currentElem.hide();
    currentElem.next(".show-on-edit").show();
    currentElem.parent().next(".checkbox").show();
  },
  "click .show-on-edit": function ( event, template ) {

    var currentElem = template.$(event.currentTarget);
    var positionsContainer = currentElem.parent().next(".checkbox");
    var parentNode = currentElem.parent().nextAll("ul")[0];
    var elemToBeInsertedTo = currentElem.parent().nextAll("ul").eq(0);
    var positions = positionsContainer.find("input[type=checkbox]:checked");
    var dataPositions = [];
    var data = {};

    if (elemToBeInsertedTo.hasClass("services-list")) {
      if (positions.size()) {
        positions.each(function () {
          dataPositions.push({
            serviceCategory: positionsContainer.attr("id").split("-")[0] + "-tool",
            service: $(this).val()
          });
        });
      }

      data = {
        services: dataPositions
      };
      Blaze.renderWithData(Template.serviceSelected, data, parentNode);
    } else if (elemToBeInsertedTo.hasClass("hire-list")) {

      var salaryElem = positionsContainer.find("input[type=text]");
      var isPay = salaryElem.size() ? true : false;
      if (positions.size()) {
        _.each(positions, function ( item, index ) {
          dataPositions.push({
            positionCategory: positionsContainer.attr("id").split("-")[0] + "-position",
            position: $(item).val(),
            salary: salaryElem.size() ? $(item).nextAll(".salary")
                .children("input[type=text]").val() : 0
          });
        });
      }
      data = {
        isPay: isPay,
        positions: dataPositions
      };
      console.log(data);
      Blaze.renderWithData(Template.selectedItem, data, parentNode);
    }

    currentElem.hide();
    currentElem.prev(".hide-on-edit").show();
    positionsContainer.hide();

    // remove the checked label from list.
    positions.parent().detach();
  },
  "click .fa-minus": function ( event, template ) {
    var currentElem = template.$(event.currentTarget);
    var parentNode = currentElem.parents("ul").prev(".checkbox")[0];
    var currentElemParent = currentElem.parents("ul").eq(0);
    var data = {};

    if (currentElemParent.hasClass("services-list")) {
      data = {
        service: currentElem.parent().text().trim()
      };
      Blaze.renderWithData(Template.serviceCheckable, data, parentNode);
    } else if (currentElemParent.hasClass("hire-list")) {

      var position = currentElem.next(".hire-category").text();
      var salaryElem = currentElem.nextAll(".hire-salary");
      var isPay = salaryElem.size() ? true : false;
      data = {
        position: position,
        isPay: isPay
      };

      Blaze.renderWithData(Template.checkableItem, data, parentNode);
    }

    currentElem.closest("li").remove();

    $.material.init();
  },
  "change .salary input[type=text]": function ( event, template ) {

    var currentElem = template.$(event.currentTarget);
    var value = currentElem.val();
    var numberPattern = /^[1-9][0-9]+$/;
    if ( !numberPattern.test(value) ) {
      alert("请输入数字!");
      currentElem.focus();
    }
  },
  "click .checkbox label": function ( event, template ) {
    var currentElem = template.$(event.currentTarget);
    var target = currentElem.find("input[type=text]");
    if (target.size()) {
      if (currentElem.find("input[type=checkbox]").is($(":checked"))) {
        target.focus();
      } else {
        target.blur();
      }
    }
  }
});
