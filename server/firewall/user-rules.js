/**
 * Created by cy on 22/12/15.
 */

"use strict";

Meteor.users.allow({
  update: function ( userId, doc ) {
    return (userId && doc._id === userId);
  },
  remove: function ( userId, doc ) {
    return (userId && doc._id === userId);
  },
  fetch: ["_id"]
});