/**
 * Created by cy on 22/11/15.
 *  init something when start app.
 */

// below is simpleschema debug mode, must be removed in production environment.
//SimpleSchema.debug = true;

Meteor.startup(function () {
  if (Meteor.users.find().count() === 0 && Project.find().count() === 0 ) {
    console.log("empty collection");
  }
});
