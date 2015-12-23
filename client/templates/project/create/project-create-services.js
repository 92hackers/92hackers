/**
 * Created by cy on 18/12/15.
 */

"use strict";

var valuesCollection;

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
    getFormValues();
    _.extend(GlobalObject.projectCreate, valuesCollection);
    var newProject = {};
    if (Meteor.user()) {
      newProject.owner = Meteor.userId();
      _.extend(newProject, GlobalObject.projectCreate);
      Project.insert(newProject, function ( error ) {
        if (!error) {
          GlobalObject.projectCreate = {};
        } else {
          alert("信息填写不完整，重新填写");
          FlowRouter.go("/project/create/basic");
        }
      });
    } else {
      console.log("permission denied, please log in firstly");
    }
    console.log(GlobalObject.projectCreate);
  }
});