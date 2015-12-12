/**
 *
 * Created by cy on 30/11/15.
 */

"use strict";

var signIn = new ReactiveVar(null);

Template.index.onCreated(function () {
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
    }
});


Template.signIn.events({
    "submit": function (event, template) {
        event.preventDefault();

        if (Meteor.user()) Meteor.logout();


    }
});

Template.signUp.events({
    "keyup #rePassword": function (event, template) {
        var password = template.$("#password").val();
        var rePassword = template.$(event.currentTarget).val();
        var $formGroup = template.$(event.currentTarget).closest(".form-group");

        if (password === rePassword) {
            $formGroup.removeClass("has-error");
            $formGroup.addClass("has-success");
        } else {
            $formGroup.removeClass("has-success");
            $formGroup.addClass("has-error");
        }
    },
    "submit": function (event, template) {
        event.preventDefault();

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
                console.log("new user created.");
            } else {
                console.log(err);
            }
        });
    }
});
