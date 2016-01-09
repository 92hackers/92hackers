/**
 * Created by cy on 07/01/16.
 */

"use strict";

ProjectApplications.allow({
  insert: function ( userId, doc ) {
    return !!userId;
  },
  update: function () {
    return false;
  },
  remove: function ( userId, doc ) {
    return (userId && doc.userId === userId);
  }
});