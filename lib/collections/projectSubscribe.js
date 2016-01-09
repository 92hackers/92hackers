/**
 * Created by cy on 09/01/16.
 */


ProjectSubscribe = new Mongo.Collection("projectSubscriptions");

ProjectSubscribe.attachSchema(new SimpleSchema({
  projectId: {
    type: String,
    label: "projectId"
  },
  userId: {
    type: String,
    label: "userId"
  }
}));