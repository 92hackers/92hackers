/**
 * Created by cy on 27/12/15.
 */

"use strict";

Meteor.publish("singleProject", function ( pid ) {
  check(pid, String);
  return Project.find({_id: pid});
});

Meteor.publishComposite("projectOwnerProfile", function ( pid ) {
  check(pid, String);
  return {
    find: function () {
      return Project.find({_id: pid}, {fields: {owner: 1}});
    },
    children: [
      {
        find: function ( project ) {
          return Meteor.users.find({_id: project.owner}, {limit: 1, fields: {username: 1, profile: 1}});
        }
      }
    ]
  }
});