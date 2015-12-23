/**
 * Created by cy on 15/12/15.
 */

"use strict";

var valuesCollection;

valuesCollection = {
  fullDescription: {}
};

Template.projectCreateFullDesc.onRendered(function () {
  componentHandler.upgradeAllRegistered();
  $.material.init();

  $("#initial-mind").focus();
});


function getFormValues() {
  valuesCollection.fullDescription = {
    initialMind: $("#initial-mind").val(),
    problemsToSolve: $("#problems-to-solve").val(),
    howToSolve: $("#how-to-solve").val(),
    usageScene: $("#usage-scene").val(),
    futureVision: $("#future-vision").val(),
    aboutMyself: $("#about-myself").val()
  }
}

Template.projectCreateFullDesc.events({
  "submit": function ( event, template ) {
    event.preventDefault();

    getFormValues();

    _.extend(GlobalObject.projectCreate, valuesCollection);
    FlowRouter.go("/project/create/hr");
  }
});