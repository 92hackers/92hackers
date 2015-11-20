/**
 * Created by cy on 20/11/15.
 * your applications must be accepted by owner of project.
 */


ProjectApplications = new Mongo.Collection("projectApplications");

ProjectApplications.attachSchema(new SimpleSchema({
  projectId: {
    type: String,
    label: "projectId"
  },
  userId: {
    type: String,
    label: "userId"
  }
}));
