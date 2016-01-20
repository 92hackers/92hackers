/**
 * Created by cy on 20/01/16.
 */

"use strict";
Meteor.methods({
  cancelSubscribe: function ( pid ) {
    check(pid, String);
    ProjectSubscribe.remove({userId: this.userId, projectId: pid});
  }
});