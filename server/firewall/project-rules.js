/**
 * Created by cy on 22/12/15.
 */

"use strict";

Project.allow({
  insert: function ( userId, doc ) {
    return userId;
  },
  update: function ( userId, doc ) {
    return (userId && doc.owner === userId);
  },
  remove: function ( userId, doc ) {
    return (userId && doc.owner === userId);
  },
  fetch: ['owner']
});

ProjectSubscribe.allow({
  insert: function ( userId, doc ) {
    return userId;
  },
  update: function ( userId, doc ) {
    return false;
  },
  remove: function ( userId, doc ) {
    return userId
  }
});
