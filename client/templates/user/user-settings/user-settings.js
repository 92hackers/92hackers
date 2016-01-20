/**
 * Created by cy on 12/01/16.
 */

"use strict";

var isYourOwnSettings = new ReactiveVar();
var isNewUser = false;

Template.userSettings.onCreated(function () {
  var template = this;
  template.ready = new ReactiveVar();
  template.autorun(function () {
    var uid = FlowRouter.getParam("uid");
    if ( !!Meteor.user() && Meteor.userId() === uid ) {
      isYourOwnSettings.set(true);
    }
    if (!Meteor.user()) {     // log out.
      isYourOwnSettings.set(false);
    }
  });
  template.autorun(function () {
    if (isYourOwnSettings.get()) {
      isNewUser = Meteor.user().isNewUser;
    }
  });
});

Template.userSettings.onRendered(function () {
  var template = this;
  template.autorun(function () {
    GlobalObject.subscribeCache.subscribe("userInfo", {
      onReady: function () {
        SEO.set({
          title: "92hackers - 设置"
        });
      }
    });
    template.ready.set(GlobalObject.subscribeCache.ready());
    if (template.ready.get()) {
      var timeId = Meteor.setTimeout(function () {
        // dom manipulations.
        $.material.init();

        // checked selected interested fields.
        var user = Meteor.user();
        var selectedFields = [];
        if (!!user) {
          selectedFields = user.profile.interestedFields;
          template.$("input[name=field]").each(function () {
            if (_.indexOf(selectedFields, $(this).val()) !== -1) {
              $(this).attr("checked", "checked");
            }
          });
          console.log(selectedFields);
        }

        Meteor.clearTimeout(timeId);
      }, 100);
    }
  });
});

function matchContactType(self, type){
  var contactInfo = self.profile.contactInformation;
  var result;
  _.each(contactInfo, function ( item, index ) {
    if (item.type === type) {
      result = item.value;
      return;
    }
  });
  return result;
}

function matchServiceType(self, type) {
  var services = self.profile.serviceAccounts;
  var result;
  _.each(services, function ( item, index ) {
    if (item.service === type) {
      result = item.account;
      return ;
    }
  });
  return result;
}

Template.userSettings.helpers({
  isYourOwnSettings: function () {
    return isYourOwnSettings.get();
  },
  ready: function () {
    return Template.instance().ready.get();
  },
  userInfo: function () {
    return Meteor.users.findOne({_id: Meteor.userId()}) || {};
  },
  isChecked: function ( gender ) {
    return this.profile.gender === gender && "checked";
  },
  phoneNumber: function () {
    return matchContactType(this, "电话");
  },
  weiXinAccount: function () {
    return matchContactType(this, "微信");
  },
  qqAccount: function () {
    return matchContactType(this, "QQ");
  },
  weiboAccount: function () {
    return matchContactType(this, "微博");
  },
  trelloAccount: function () {
    return matchServiceType(this, "Trello");
  },
  asanaAccount: function () {
    return matchServiceType(this, "Asana");
  },
  towerAccount: function () {
    return matchServiceType(this, "Tower");
  },
  teambitionAccount: function () {
    return matchServiceType(this, "Teambition");
  },
  worktileAccount: function () {
    return matchServiceType(this, "Worktile");
  }
});

// todo: all fields had not been verified, to accomplish this in the later version.
function saveSettings(section, event, template) {
  var uid = FlowRouter.getParam("uid");
  var currentElem = template.$(event.currentTarget);
  var submitButton = currentElem.find("[type=submit]");
  var loader = currentElem.find(".loader");
  var data = {};
  submitButton.hide();
  loader.show();
  switch ( section ) {
    case "profile":
      var interestedFields = [];
      template.$("[name=field]:checked").each(function () {
        interestedFields.push($(this).val());
      });
      data = {
        "profile.introduction": template.$("#introduction").val(),
        "profile.selfIntroduction": template.$("#self-introduction").val(),
        "profile.goodAt": template.$("#good-at").val(),
        "profile.interestedFields": interestedFields,
        "profile.location": template.$("#location").val()
      };
      if (isNewUser) {
        data.isNewUser = false;
      }
      Meteor.users.update({ _id: uid }, { $set: data }, function ( err, result ) {
        loader.hide();
        var timeId = Meteor.setTimeout(function () {
          submitButton.text("保存").removeClass("text-success").removeClass("text-danger");
          Meteor.clearTimeout(timeId);
        }, 2000);
        if ( !err && result ) {
          submitButton.text("保存成功!").addClass("text-success").show();
        } else {
          console.log(err);
          submitButton.text("保存失败,请重试!").addClass("text-danger").show();
        }
        data = {};
      });
      break;
    case "changeUsername":
      var newUsername = template.$("#username").val();
      Meteor.call("changeUsername", newUsername, function ( err ) {
        loader.hide();
        var timeId = Meteor.setTimeout(function () {
          submitButton.text("保存").removeClass("text-success").removeClass("text-danger");
          Meteor.clearTimeout(timeId);
        }, 2000);
        if ( !err ) {
          submitButton.text("保存成功!").addClass("text-success").show();
        } else {
          console.log(err);
          if (err.error === 403) {
            submitButton.text("该用户名已存在,请重试!").addClass("text-danger").show();
          } else {
            submitButton.text("保存失败,请重试!").addClass("text-danger").show();
          }
        }
      });
      data = {};
      break;
    case "changePassword":
      var newPassword = template.$("#new-password").val();
      var repeatPassword = template.$("#repeat-password").val();
      var currentPassword = template.$("#current-password").val();
      if ( newPassword && currentPassword && newPassword === repeatPassword) {
        Accounts.changePassword(currentPassword, newPassword, function ( err ) {
          loader.hide();
          var timeId = Meteor.setTimeout(function () {
            submitButton.text("保存").removeClass("text-success").removeClass("text-danger");
            Meteor.clearTimeout(timeId);
          }, 2000);
          if ( !err ) {
            submitButton.text("保存成功!").addClass("text-success").show();
          } else {
            console.log(err);
            if (err.error === 403) {
              submitButton.text("当前密码错误,请重试!").addClass("text-danger").show();
            } else {
              submitButton.text("保存失败,请重试!").addClass("text-danger").show();
            }
          }
        });
      } else {
        loader.hide();
        submitButton.show();
        alert("请输入正确密码！");
      }
      data = {};
      break;
    case "privacy":
      console.log("privacy");
      var contactInfo = [];
      template.$("#privacy").find(".contactInfo").each(function () {
        if ($(this).val()) {
          contactInfo.push({
            type: $(this).attr("name"),
            value: $(this).val()
          });
        }
      });
      data = {
        "profile.name": template.$("#name").val(),
        "profile.gender": template.$("[name=gender]:checked").val(),
        "profile.contactInformation": contactInfo
      };
      if (isNewUser) {
        data.isNewUser = isNewUser;
      }
      console.log(data);
      Meteor.users.update({_id: uid}, {$set: data}, function ( err, result ) {
        loader.hide();
        var timeId = Meteor.setTimeout(function () {
          submitButton.text("保存").removeClass("text-success").removeClass("text-danger");
          Meteor.clearTimeout(timeId);
        }, 2000);
        if ( !err && result ) {
          submitButton.text("保存成功!").addClass("text-success").show();
        } else {
          console.log(err);
          submitButton.text("保存失败,请重试!").addClass("text-danger").show();
        }
      });
      data = {};
      break;
    case "service-accounts":
      var serviceAccounts = [];
      template.$("#service-accounts").find("input").each(function () {
        if ($(this).val()) {
          serviceAccounts.push({
            service: $(this).attr("id"),
            account: $(this).val()
          });
        }
      });
      Meteor.users.update({_id: uid}, {$set: {"profile.serviceAccounts": serviceAccounts, isNewUser: isNewUser}}, function ( err, result ) {
        loader.hide();
        var timeId = Meteor.setTimeout(function () {
          submitButton.text("保存").removeClass("text-success").removeClass("text-danger");
          Meteor.clearTimeout(timeId);
        }, 2000);
        if ( !err && result ) {
          submitButton.text("保存成功!").addClass("text-success").show();
        } else {
          console.log(err);
          submitButton.text("保存失败,请重试!").addClass("text-danger").show();
        }
      });
      break;
  }
}

Template.userSettings.events({
  "hidden.bs.modal #upload-avatar-modal": function ( event, template ) {
    $("#cropBtn").text("上传").removeClass("text-success");
  },
  "submit #profile form": function ( event, template ) {
    event.preventDefault();
    saveSettings("profile", event, template);
  },
  "submit #changeUsername": function ( event, template ) {
    event.preventDefault();
    saveSettings("changeUsername", event, template);
  },
  "submit #changePassword": function ( event, template ) {
    event.preventDefault();
    saveSettings("changePassword", event, template);
  },
  "submit #privacy form": function ( event, template ) {
    event.preventDefault();
    saveSettings("privacy", event, template);
  },
  "submit #service-accounts form": function ( event, template ) {
    event.preventDefault();
    saveSettings("service-accounts", event, template);
  }
});