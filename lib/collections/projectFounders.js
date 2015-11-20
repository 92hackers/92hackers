/**
 *
 * Created by cy on 20/11/15.
 */

ProjectFounders = new Mongo.Collection("projectFounders");

var projectFoundersSchema = new SimpleSchema({
  projectId: {
    type: String,
    label: "projectId",
    index: true
  },
  userId: {
    type: String,
    label: "userId",
    index: true
  }
});

ProjectFounders.attachSchema(projectFoundersSchema);
