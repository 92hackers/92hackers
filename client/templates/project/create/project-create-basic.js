/**
 *  project create.
 * Created by cy on 14/12/15.
 */

"use strict";

 var tags = [];

Template.projectCreateBasic.onCreated(function () {
  SEO.set({
    title: "92Hackers - 创建新项目"
  });
});

Template.projectCreateBasic.onRendered(function () {

  componentHandler.upgradeAllRegistered();
  $.material.init();

  $("#name").focus();
});

function getBasicValues() {
  GlobalObject.projectCreate = {
    name: $("#name").val(),
    category: $("[name=category]:checked").val(),
    introduction: $("#introduction").val(),
    ownResource: $("#resource").val(),
    tags: tags
  };
  var demoUrlText = $("#demo-url").val().trim();
  var httpSchemaPattern = /^http.+$/;
  if ( !httpSchemaPattern.test(demoUrlText) ) {
    demoUrlText = "http://" + demoUrlText;
  }

  _.extend(GlobalObject.projectCreate, {demoUrl: demoUrlText});
}

Template.projectCreateBasic.events({
  "submit .project-create-basic-wrap form": function ( event, template ) {
    event.preventDefault();
    if ( !!Meteor.user() ) {
      getBasicValues();
      if ( !GlobalObject.projectCreate.category ) {
        alert("请填写项目所属分类!");
        return ;
      }
      FlowRouter.go("projectCreateFullDesc");
    } else {
      alert("您还没有登录 !");
    }
  },
  "keydown form": function ( event, template ) {    // prevent Enter to trigger submit event.
    if (event.which === 13 && $("#tags").closest(".form-group").hasClass("is-focused")) {
      return false;
    }
  },
  "keyup #tags": function ( event, template ) {     // add tag
    var target = event.currentTarget;
    var value = $(target).val().replace(/\s+/g, "");
    if (event.which === 13) {
      if (!value) {
        $("#tags-warning").fadeIn();
        var timeId = Meteor.setTimeout(function () {
          $("#tags-warning").fadeOut();
          Meteor.clearTimeout(timeId);
        }, 2000);
        return ;
      }
      var tag = '<span class="label label-primary">' + value + ' &times;</span>';

      if ( _.indexOf(tags, value) === -1) {
        template.$("#tags-collection").append(tag);
        tags.push(value);
      }       // you can not input two same tag.

      target.value = "";
    }
  },
  "click .label": function ( event, template ) {    // remove tag.
    var target = event.currentTarget;
    var text = $(target).text().split(" ")[0];
    tags = _.without(tags, text);
    $(target).remove();
  }
});
