/**
 * Created by cy on 30/12/15.
 */


FeedBacks = new Mongo.Collection("feedBacks");

var feedBacksSchema = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: "email"
  },
  feedBackText: {
    type: String,
    max: 1000,
    label: "feedBackText"
  }
});

FeedBacks.attachSchema(feedBacksSchema);