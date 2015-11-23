/**
 *  user profile collection definition.
 * Created by cy on 20/11/15.
 */

var userProfileSchema = new SimpleSchema({
  name: {
    type: String,
    label: "name",
    index: true,
    max: 100
  },
  emails: {
    type: [Object],
    optional: true
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  introduction: {
    type: String,
    label: "introduction",
    max: 100
  },
  gender: {
    type: String,
    label: "gender",
    allowedValues: ["男","女","male","female"],
    optional: true
  },
  avatar: {
    type: String,
    label: "avatar",
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  location: {
    type: String,
    label: "location"
  },
  goodAt: {           // what are you good at , which fileds are you skilled?
    type: [String],
    label: "goodAt"
  }
});

Meteor.users.attachSchema(new SimpleSchema({
  username: {
    type: String,
    label: "username",
    regEx: /^[a-zA-Z0-9_]{3,15}$/,
    index: false
  },
  profile: {
    type: userProfileSchema
  },
  createdAt: {
    type: Date,
    label: "createdAt"
  },
  services: {
    type: Object,
    label: "services",
    optional: true,
    blackbox: true
  }
}));
