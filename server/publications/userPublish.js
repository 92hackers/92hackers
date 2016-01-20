/**
 * Created by cy on 09/01/16.
 */


Meteor.publishComposite("singleUser", function ( uid ) {
  check(uid, String);
  return {
    find: function () {
      if (this.userId && this.userId === uid) {
        return Meteor.users.find({_id: uid}, {fields: {services: 0}});
      }
      return Meteor.users.find({_id: uid},
          {
            fields: {
              "profile.contactInformation": 0,
              "profile.name": 0,
              "profile.gender": 0,
              services: 0
            }
          }
      );
    },
    children: [
      {
        find: function ( users ) {
          return Project.find({owner: users._id}, {fields: {
            name: 1,
            owner: 1,
            introduction: 1,
            "fullDescription.initialMind": 1
          }});
        }
      },
      {
        find: function ( users ) {
          return ProjectApplications.find({userId: users._id});
        },
        children: [
          {
            find: function ( projectApplications ) {
              return Project.find({_id: projectApplications.projectId}, {fields: {name: 1, owner: 1, introduction: 1, "fullDescription.initialMind": 1}});
            },
            children: [
              {
                find: function ( project ) {
                  return Meteor.users.find({_id: project.owner}, {fields: {username: 1}});
                }
              }
            ]
          }
        ]
      },
      {
        find: function ( users ) {
          return ProjectSubscribe.find({userId: users._id});
        },
        children: [
          {
            find: function ( projectSubscriptions ) {
              "use strict";
              return Project.find({_id: projectSubscriptions.projectId}, {
                fields: {
                  name: 1,
                  owner: 1,
                  introduction: 1,
                  "fullDescription.initialMind": 1
                }
              });
            },
            children: [
              {
                find: function ( project ) {
                  return Meteor.users.find({_id: project.owner}, {fields: {username: 1}});
                }
              }
            ]
          }
        ]
      }
    ]
  }
});

Meteor.publish("userInfo", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}, {fields: {services: 0}});
  }
});

Meteor.publishComposite("userSubscriptions", function ( uid ) {
  check(uid, String);
  return {
    find: function () {
      return ProjectSubscribe.find({userId: uid});
    },
    children: [
      {
        find: function (projectSubscriptions) {
          return Project.find({_id: projectSubscriptions.projectId}, {fields: {
            name: 1,
            owner: 1,
            introduction: 1,
            "fullDescription.initialMind": 1
          }});
        },
        children: [
          {
            find: function ( project ) {
              return Meteor.users.find({_id: project.owner}, {fields: {username: 1}});
            }
          }
        ]
      }
    ]
  }
});
