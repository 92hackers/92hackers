/**
 *  collection file.
 * Created by cy on 19/11/15.
 */

// TODO: project comments,

Project = new Mongo.Collection("project");

var projectSchema = new SimpleSchema({
  name: {
    type: String,
    label: "name",
    max: 20,
    min: 2,
    index: 1,
    unique: true
  },
  owner: {            //  owner's userId
    type: String,
    label: "owner"
  },
  tags: {
    type: [String],
    label: "tags"
  },
  category: {               // given some choices.
    type: String,
    label: "category"
  },
  introduction: {
    type: String,
    label: "introduction",
    max: 100
  },
  fullDescription: {        // including the owner's plan to this idea.
    type: String,
    label: "fullDesc"
  },
  demoUrl: {                // if has already, that it's, if not, set one after demo created.
    type: String,
    label: "demoUrl",
    max: 200,
    optional: true
  },
  ownResource: {
    type: String,
    label: "ownResource",
    optional: true
  },
  createdAt: {
    type: Date,
    label: "createdAt",
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

