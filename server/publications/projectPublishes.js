/**
 * Created by cy on 27/12/15.
 */

"use strict";

// and then, you only need to subscribe this publication.
Meteor.publishComposite("singleProject", function ( pid ) {
  check(pid, String);
  var isProjectOwner= false;
  var project = Project.findOne({_id: pid});
  if (project.owner === this.userId) {
    isProjectOwner = true;
  }
  return {
    find: function () {
      return Project.find({_id: pid});
    },
    children: [
      {
        find: function ( project ) {
          return Meteor.users.find({_id: project.owner}, {limit: 1, fields: {
            username: 1,
            "profile.avatar": 1,
            "profile.introduction": 1
          }});
        }
      },
      {
        find: function ( project ) {
          if (isProjectOwner) {
            return ProjectApplications.find({projectId: project._id});
          } else {
            return ProjectApplications.find({projectId: project._id, userId: this.userId});
          }
        }
      },
      {
        find: function ( project ) {
          if (this.userId) {
            return ProjectSubscribe.find({projectId: project._id});
          }
        }
      }
    ]
  }
});

Meteor.publishComposite("projectApplications", function ( pid ) {
  check(pid, String);
  return {
    find: function () {
      return Project.find({_id: pid}, {fields: {owner: 1}});
    },
    children: [
      {
        find: function ( project ) {
          return ProjectApplications.find({projectId: project._id});
        }
      },
      {
        find: function ( project ) {
          return Meteor.users.find({_id: project._id}, {fields: {
            username: 1,
            "profile.avatar": 1,
            "profile.emails": 1,
            "profile.contactInformation": 1,
            "profile.name": 1,
            "profile.gender": 1,
            "profile.serviceAccounts": 1
          }});
        }
      }
    ]
  }
});