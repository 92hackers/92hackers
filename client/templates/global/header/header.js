/**
 *  header
 * Created by cy on 13/12/15.
 */

Template.header.onRendered(function () {
  $.material.init();
});

Template.header.events({
  "shown.bs.modal #header-feed-back-modal": function (event, template) {
    "use strict";
    template.$("#advisor-email").focus();
  },
  "submit #header-feed-back-modal form": function ( event, template ) {
    "use strict";
    event.preventDefault();
    var feedBack = {
      email: template.$("#advisor-email").val(),
      feedBackText: template.$("#feed-back-textarea").val()
    };
    var submitButton = $("#submit-feed-back");
    if (feedBack) {
      FeedBacks.insert(feedBack, function ( err, result ) {
        if (!err && result) {
          submitButton.text("反馈成功 ！");
          var timeId = Meteor.setTimeout(function () {
            $("#header-feed-back-modal").modal("hide");
            submitButton.attr("disabled", "disabled");      // prevent submit feedback repeat.
            Meteor.clearTimeout(timeId);
          }, 2000);
        } else {
          console.log(err);
        }
      });
    }
  },
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
