/**
 *  this file defines the website level variable GlobalObject and Sessions.
 * Created by cy on 14/12/15.
 */

    // website level unique namespace, if you need some data to be
    // used across files, just attach the data to this object.

GlobalObject = {};

GlobalObject.website = {
  version: "0.0.1",
  founder: "ChenYuan"
};

// used to collect project-create values
GlobalObject.projectCreate = {};

// global Subscription Manager.

GlobalObject.subscribeCache = new SubsManager();

// when log in and out, reload current page.
Session.setDefault("reloadAble", false);

// log in default, there is no need signinup modal.
Session.setDefault("loggedIn", true);

// positions full list:
GlobalObject.positionsList = {
  product: ["产品经理", "产品设计师", "移动产品经理", "网页产品经理", "电商产品经理", "游戏策划"],
  tech: ["全栈开发", "后台开发", "ios端开发", "android端开发", "前端开发", "自动化测试"],
  design: ["网页设计师", "APP设计师", "UI设计师"]
};

GlobalObject.servicesList = {
  cooperationTools: ["Trello", "Asana", "Tower.im", "Teambition", "Worktile"],
  codeTools: ["github"],
  communicationTools: ["微信", "Skype", "电话"],
  fileTools: ["百度云盘", "Dropbox", "Google Drive"]
};
