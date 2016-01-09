/**
 * Created by cy on 27/12/15.
 */

"use strict";

// and then, you only need to subscribe this publication.
Meteor.publishComposite("singleProject", function ( pid ) {
  check(pid, String);
  return {
    find: function () {
      return Project.find({_id: pid});
    },
    children: [
      {
        find: function ( project ) {
          return Meteor.users.find({_id: project.owner}, {limit: 1, fields: {username: 1, profile: 1}});
        }
      },
      {
        find: function ( project ) {
          return ProjectApplications.find({projectId: project._id});
        }
      }
    ]
  }
});