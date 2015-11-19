/**
 * Created by cy on 19/11/15.
 */

// project collection.

Project = new Mongo.Collection("project");
ProjectFounders = new Mongo.Collection("projectFounders");

var projectSchema = new SimpleSchema({
  name: {
    type: String,
    label: "name",
    max: 20,
    min: 2,
    unique: true
  },
  tags: {
    type: [String],
    lable: "tags"
  },
  category: {
    type: String,
    lable: "category"
  },
  shortDescription: {
    type: String,
    label: "shortDesc",
    max: 100
  },
  fullDescription: {        // including the owner's plan to this idea.
    type: String,
    label: "fullDesc"
  },
  demoUrl: {                // if has already, that it's, if not, set one after demo created.
    type: String,
    label: "demoUrl",
    optional: true
  },
  ownResources: {
    type: String,
    label: "ownResources",
    optional: true
  },
  createAt: {
    type: Date,
    label: "createAt",
    autoValue: function () {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();
      }
    }
  }
});

Project.attachSchema(projectSchema);


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
