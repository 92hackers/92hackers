/**
 *  user profile collection definition.
 * Created by cy on 20/11/15.
 */

var userProfileSchema = new SimpleSchema({
  name: {
    type: String,
    label: "name",
    index: true,
    max: 100,
    optional: true
  },
  emails: {
    type: [Object],
    optional: true,
    label: "contactInformation"
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  "contactInformation": {     // private contact information. only visible by yourself.
    type: [Object],
    optional: true,
    label: "contactInformation"
  },
  "contactInformation.$.type": {
    type: String,
    label: "type"
  },
  "contactInformation.$.value": {
    type: String,
    label: "value"
  },
  introduction: {
    type: String,
    label: "introduction",
    max: 100
  },
  selfIntroduction: {         // about myself.
    type: String,
    label: "fullIntroduction",
    max: 1000
  },
  gender: {
    type: String,
    label: "gender",
    allowedValues: ["男","女","male","female"],
    optional: true
  },
  avatar: {         // store avatar's url.
    type: String,
    label: "avatar",
    optional: true
  },
  location: {
    type: String,
    label: "location",
    optional: true
  },
  goodAt: {           // what are you good at , which fileds are you skilled?
    type: String,
    label: "goodAt",
    optional: true
  },
  interestedFields: {       // what fields are you interested in ?
    type: [String],
    label: "interestedFields",
    optional: true
  },
  ideas: {
    type: [String],
    label: "interestedFields",
    optional: true
  },
  serviceAccounts: {
    type: [Object],
    label: "serviceAccounts",
    optional: true
  },
  "serviceAccounts.$.service": {
    type: String,
    label: "service"
  },
  "serviceAccounts.$.account": {
    type: String,
    label: "account"
  }
});

Meteor.users.attachSchema(new SimpleSchema({
  username: {
    type: String,
    label: "username",
    regEx: /^[^\d][\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z0-9]{2,29}$/,
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
    blackbox: true
  }
}));
