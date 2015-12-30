/**
 * Created by cy on 31/12/15.
 */

"use strict";

FeedBacks.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return false;
  },
  remove: function () {
    return false;
  }
});