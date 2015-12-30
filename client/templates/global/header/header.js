/**
 *  header
 * Created by cy on 13/12/15.
 */

Template.header.onRendered(function () {
  $.material.init();
});

Template.header.events({
  "click .logout": function (event, template) {
    event.preventDefault();

    Meteor.logout(function (err) {
      if (!err) {
        Session.set("loggedIn", false);
        FlowRouter.reload();
      } else {
        console.log(err);
      }
    });
  }
});
