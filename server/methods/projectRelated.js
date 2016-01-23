/**
 * Created by cy on 20/01/16.
 */

"use strict";
Meteor.methods({
  cancelSubscribe: function ( pid ) {
    check(pid, String);
    ProjectSubscribe.remove({userId: this.userId, projectId: pid});
  },
  updateApplication: function ( pid, uid, status ) {
    check(pid, String);
    check(uid, String);
    check(status, String);
    ProjectApplications.update({projectId: pid, userId: uid}, {$set: {status: status}});
  }
});
