/**
 *
 * Created by cy on 30/11/15.
 */

"use strict";

var signIn = new ReactiveVar(null);
var reloadAble = new ReactiveVar(null);

var rePasswordCorrect = new ReactiveVar(null);

Template.index.onCreated(function () {

    // since when a new user created, this var set to 1, here to reset it.
    reloadAble.set(0);

});

Template.index.onRendered(function () {

    // full-page.js initialisation.

    $("#full-page").fullpage({
        loopTop: true,
        loopBottom: true,
        navigation: true,
        navigationPosition: "right"
    });

    // material design plugin initialisation.

    $.material.init();

});


Template.index.helpers({
    "signWhich": function () {
        return signIn.get();
    }
});

Template.index.events({
    "show.bs.modal #signModal": function (event, template) {
        var triggerButton = template.$(event.relatedTarget);
        var which = triggerButton.data("which");

        var modalTitle = $("#signModal").find(".modal-title");

        if (which === "signIn") {
            signIn.set(true);
            modalTitle.text("登陆");
        } else {
            signIn.set(false);
            modalTitle.text("注册");
        }
    },
    "hidden.bs.modal #signModal": function () {
        if (reloadAble.get()) {
            FlowRouter.reload();
        }
    }
});

Template.index.onDestroyed(function () {
    $.fn.fullpage.destroy("all");

    // below two lines are used to clean up the effect of fullpage.js
    $("html").removeClass("fp-enabled");
    $("body").removeClass("fp-viewing-0");
});


Template.signIn.events({
    "submit": function (event, template) {
        event.preventDefault();

        var username = template.$("#user-name").val();
        var password = template.$("#password").val();

        var clientErrorCode = /^4\d+$/;

        Meteor.loginWithPassword(username, password, function (err, result) {
            if (!err) {
                reloadAble.set(1);
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
    "submit": function (event, template) {
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

        Accounts.createUser(userObject, function (err) {
            if (!err) {
                reloadAble.set(1);
                $("#signModal").modal("hide");
                console.log("new user created.");
            } else {
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
