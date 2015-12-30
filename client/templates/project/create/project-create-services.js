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
  var a, b, c;
  var coopTools = $("[name='coop-tool']:checked");
  var codeTools = "github";
  var comTools = $("[name='com-tool']:checked");
  var archiveTools = $("[name='archive-tool']:checked");

  var coopChecked = [];
  var codeChecked = [codeTools];
  var comChecked = [];
  var archiveChecked = [];

  if (coopTools.size()) {
    for (a = 0; a < coopTools.size(); a++) {
      coopChecked.push(coopTools[a].value);
    }
  }

  if (comTools.size()) {
    for (b = 0; b < comTools.size(); b++) {
      comChecked.push(comTools[b].value);
    }
  }

  if (archiveTools.size()) {
    for (c = 0; c < archiveTools.size(); c++) {
      archiveChecked.push(archiveTools[c].value);
    }
  }

  valuesCollection = {
    cooperationTools: coopChecked,
    codeTools: codeChecked,
    communicationTools: comChecked,
    fileTools: archiveChecked
  }
}

Template.projectCreateServices.events({
  "submit": function ( event, template ) {
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