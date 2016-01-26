/**
 *
 * Created by cy on 30/11/15.
 */

"use strict";

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

Template.index.events({
  "hidden.bs.modal #signModal": function () {
    if (Session.get("reloadAble")) {
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
