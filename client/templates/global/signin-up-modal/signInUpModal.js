/**
 * Created by cy on 29/12/15.
 */

"use strict";

var signIn = new ReactiveVar(null);

var rePasswordCorrect = new ReactiveVar(null);

// if user log into system successfully.
var logIn = new ReactiveVar(false);

Template.signInUpModal.onCreated(function () {
  // since when a new user created, this var set to 1, here to reset it.
  Session.set("reloadAble", false);
});

Template.signInUpModal.onRendered(function () {

  // material design plugin initialisation.
  $.material.init();
});


Template.signInUpModal.helpers({
  "signWhich": function () {
    return signIn.get();
  }
});

Template.signInUpModal.events({
  "show.bs.modal #signModal": function (event, template) {
    var triggerButton = $(event.relatedTarget);
    var which = triggerButton.data("which");

    var modalTitle = $("#signModal").find(".modal-title");

    if (which === "signIn") {
      signIn.set(true);
      modalTitle.text("登录");
    } else {
      signIn.set(false);
      modalTitle.text("注册");
    }
  },
  "shown.bs.modal #signModal": function () {
    if ($("#username").size()) {
      $("#username").focus();
    } else if ($("#user-name").size()) {
      $("#user-name").focus();
    }
  },
  "hidden.bs.modal #signModal": function () {
    Session.set("loggedIn", logIn.get());

    if (logIn.get()) {
      logIn.set(false);     //  variable life cycle.  which is very important.
    }
    // bind elements to js plugin.
    $.material.init();
  }
});

Template.signIn.events({
  "submit .signIn-form": function (event, template) {
    event.preventDefault();

    var username = template.$("#user-name").val();
    var password = template.$("#password").val();

    var clientErrorCode = /^4\d+$/;

    Meteor.loginWithPassword(username, password, function (err, result) {
      if (!err) {
        Session.set("reloadAble", true);
        logIn.set(true);
        $("#signModal").modal("hide");
      } else {
        if ( clientErrorCode.test(err.error) ) {
          $(".login-error").fadeIn();
          var timeId = Meteor.setTimeout(function () {
            $(".login-error").fadeOut();
            Meteor.clearTimeout(timeId);
          }, 2000);
        }
      }
    });
  }
});

var usernameHandler = _.debounce(function () {
  var $loadingImg = $(".form-loading-img");
  var $existed = $(".usernameExisted");
  var $username = $("#username");
  var $formGroup = $username.closest(".form-group");

  var username = $username.val();

  // username should be tested pass firstly.
  if ( !$formGroup.hasClass("has-success") ) {
    return ;
  }

  $loadingImg.show();
  Meteor.call("usernameExistDetect", username, function (err, result) {
    if (!err) {
      $loadingImg.hide();
      if (result) {
        $formGroup.removeClass("has-success");
        $formGroup.addClass("has-warning");
        $existed.fadeIn();
        var timeId = Meteor.setTimeout(function () {
          $existed.fadeOut();
          Meteor.clearTimeout(timeId);
        }, 2000);
      } else {
        console.log("this new username can be use !");
      }
    } else {
      console.log("call usernameExistDetect error");
    }
  });

}, 1000);

Template.signUp.events({
  "keyup #rePassword": function (event, template) {
    var password = template.$("#password").val();
    var rePassword = template.$(event.currentTarget).val();
    var $formGroup = template.$(event.currentTarget).closest(".form-group");

    if (password === rePassword) {
      rePasswordCorrect.set(1);
      $formGroup.removeClass("has-error");
      $formGroup.addClass("has-success");
    } else {
      rePasswordCorrect.set(0);
      $formGroup.removeClass("has-success");
      $formGroup.addClass("has-error");
    }
  },
  "keyup #username": usernameHandler,
  "submit .signUp-form": function (event, template) {
    event.preventDefault();

    // repeat typed password must be correct.

    if ( !rePasswordCorrect.get() ) {
      $("#rePassword").focus();
      return ;
    }

    if (Meteor.user()) Meteor.logout();

    var username = template.$("#username").val();
    var password = template.$("#password").val();
    var email = template.$("#email").val();
    var introduction = template.$("#introduction").val();

    var userObject = {
      username: username,
      password: password,
      profile: {
        isNewUser: true,        // set new user tag.
        emails: [
          {
            address: email,
            verified: false
          }
        ],
        introduction: introduction
      },
      createdAt: new Date()
    };


    console.log(userObject);
    Accounts.createUser(userObject, function (err) {
      if (!err) {
        logIn.set(true);
        Session.set("reloadAble", true);
        $("#signModal").modal("hide");
        console.log("new user created.");
      } else {
        console.log(err);
        if (err.error === 403) {
          var $existed = $(".usernameExisted");

          $("#username").focus();
          $existed.fadeIn();
          var timeId = Meteor.setTimeout(function () {
            $existed.fadeOut();
            Meteor.clearTimeout(timeId);
          }, 2000);
        }
      }
    });
  }
});
