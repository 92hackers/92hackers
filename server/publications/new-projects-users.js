/**
 * Created by cy on 21/01/16.
 */

"use strict";

Meteor.publishComposite("newestProjects", function ( projectLimit ) {
  return {
    find: function () {
      return Project.find({}, {fields: {
        name: 1,
        owner: 1,
        introduction: 1,
        "fullDescription.initialMind": 1,
        createdAt: 1
      }, sort: {createdAt: -1}, limit: projectLimit});
    },
    children: [
      {
        find: function ( project ) {
          return Meteor.users.find({_id: project.owner}, {fields: {username: 1}});
        }
      }
    ]
  }
});

Meteor.publish("newestUsers", function ( userLimit ) {
  return Meteor.users.find({}, {fields: {
    username: 1,
    "profile.introduction": 1,
    "profile.selfIntroduction": 1,
    "profile.avatar": 1,
    createdAt: 1
  }, sort: {createdAt: -1}, limit: userLimit});
});
