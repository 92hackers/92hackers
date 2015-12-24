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
    max: 60,
    min: 2,
    index: 1
  },
  owner: {            //  owner's userId
    type: String,
    label: "owner"
  },
  tags: {
    type: [String],
    label: "tags",
    optional: true
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
  demoUrl: {                // if has already, that it's, if not, set one after demo created.
    type: String,
    label: "demoUrl",
    max: 200,
    regEx: /^\s*(http:\/\/|https:\/\/)www\.\S+\.\S+$/,
    optional: true
  },
  ownResource: {
    type: String,
    label: "ownResource"
  },
  fullDescription: {        // including the owner's plan to this idea.
    type: Object,
    label: "fullDesc"
  },
  "fullDescription.initialMind": {
    type: String
  },
  "fullDescription.problemsToSolve": {
    type: String
  },
  "fullDescription.howToSolve": {
    type: String
  },
  "fullDescription.usageScene": {
    type: String
  },
  "fullDescription.futureVision": {
    type: String
  },
  "fullDescription.aboutMyself": {
    type: String
  },
  "payOrNot": {
    type: String,
    label: "payOrNot",
    optional: true
  },
  "productHire": {
    type: Array,
    optional: true,
    label: "productHire"
  },
  "productHire.$": {
    type: Object
  },
  "productHire.$.category": {
    type: String
  },
  "productHire.$.salary": {
    type: Number,
    optional: true
  },
  "techHire": {
    type: Array,
    optional: true,
    label: "techHire"
  },
  "techHire.$": {
    type: Object
  },
  "techHire.$.category": {
    type: String
  },
  "techHire.$.salary": {
    type: Number,
    optional: true
  },
  "designHire": {
    type: Array,
    optional: true,
    label: "designHire"
  },
  "designHire.$": {
    type: Object
  },
  "designHire.$.category": {
    type: String
  },
  "designHire.$.salary": {
    type: Number,
    optional: true
  },
  "cooperationTools": {
    type: [String],
    optional: true,
    label: "cooperationTools"
  },
  "codeTools": {
    type: [String],
    optional: true,
    label: "codeTools"
  },
  "communicationTools": {
    type: [String],
    optional: true,
    label: "communicationTools"
  },
  "fileTools": {
    type: [String],
    optional: true,
    label: "fileTools"
  },
  createdAt: {
    type: Date,
    label: "createdAt",
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();
      }
    }
  }
});

Project.attachSchema(projectSchema);

