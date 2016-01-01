/**
 * Created by cy on 18/12/15.
 */

"use strict";

var valuesCollection;

Template.projectCreateServices.onCreated(function () {
  SEO.set({ title: "92Hackers - 创建新项目"});
});

Template.projectCreateServices.onRendered(function () {
  componentHandler.upgradeAllRegistered();
  $.material.init();
});

function getFormValues() {
  var coopTools = $("[name='coop-tool']:checked");
  var codeTools = "Github";
  var comTools = $("[name='com-tool']:checked");
  var fileTools = $("[name='file-tool']:checked");

  var coopChecked = [];
  var codeChecked = [codeTools];
  var comChecked = [];
  var fileChecked = [];

  if (coopTools.size()) {
    _.each(coopTools, function ( item, index ) {
      coopChecked.push(item.value);
    });
  }

  if (comTools.size()) {
    _.each(comTools, function ( item, index ) {
      comChecked.push(item.value);
    });
  }

  if (fileTools.size()) {
    _.each(fileTools, function ( item, index ) {
      fileChecked.push(item.value);
    });
  }

  valuesCollection = {
    cooperationTools: coopChecked,
    codeTools: codeChecked,
    communicationTools: comChecked,
    fileTools: fileChecked
  }
}

Template.projectCreateServices.events({
  "submit .project-create-services-wrap form": function ( event, template ) {
    event.preventDefault();

    //  ui displays loading button
    $("[type=submit]").hide();
    $(".loader").fadeIn();

    getFormValues();
    _.extend(GlobalObject.projectCreate, valuesCollection);

    var newProject = {};

    if ( !!Meteor.user() ) {
      newProject.owner = Meteor.userId();
      _.extend(newProject, GlobalObject.projectCreate);
      Project.insert(newProject, function ( error, result ) {
        if (!error && result) {
          // go to project homepage.
          FlowRouter.go("projectHomepage", {pid: result});
        } else {
          $(".loader").fadeOut();
          $("[type=submit]").show();
          console.log(error);
          alert("信息填写不完整，请重新填写");
          FlowRouter.go("projectCreateBasic");
        }
      });
    } else {
      console.log("permission denied, please log in firstly");
    }
    console.log(GlobalObject.projectCreate);
  }
});

Template.projectCreateServices.onDestroyed(function () {

  GlobalObject.projectCreate = {};

});