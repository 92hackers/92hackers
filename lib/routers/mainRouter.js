/**
 * Created by cy on 20/11/15.
 *    global router.
 *    this file includes routers such as: index page, not found page,
 *    and other site level routers, which are not a specific function module.
 */

// todo: 只有首页需要判断，如果它进入的是其他路由的页面，在 导航栏上面需要给出登陆和注册的按钮。

  "use strict";

FlowRouter.route("/", {
  name: "index",
  action: function () {
    if (Accounts.userId()) {
      BlazeLayout.render("layout", {main: "login"});
    } else {
      BlazeLayout.render("index");
    }
  }
});

FlowRouter.route("/help", {
  name: "help",
  action: function () {
    BlazeLayout.render("layout", {main: "siteHelp"});
  }
});

FlowRouter.route("/all-projects", {
  name: "allProjects",
  action: function () {
    BlazeLayout.render("layout", {main: "allProjects"});
  }
});

FlowRouter.route("/all-users", {
  name: "allUsers",
  action: function () {
    BlazeLayout.render("layout", {main: "allUsers"});
  }
});


// user router
FlowRouter.route("/:uid", {
  name: "userHomepage",
  action: function () {
    BlazeLayout.render("layout" , {main: "userHomepage"});
  }
});


FlowRouter.route("/:uid/subscriptions", {
  name: "userSubscriptions",
  action: function () {
    BlazeLayout.render("layout", {main: "userSubscriptions"});
  }
});

FlowRouter.route("/:uid/settings", {
  name: "userSettings",
  action: function () {
    BlazeLayout.render("layout", {main: "userSettings"});
  }
});

// todo: Is notifications to be a single page or just a modal ?

// TODO: below notFound router do not work. to fix this issuse.

FlowRouter.notFound = {
  action: function () {
    BlazeLayout.render("notFount");
  }
};

FlowRouter.route("/test", {
  name: "test",
  action: function () {
    BlazeLayout.render("test");
  }
});

FlowRouter.route("/load", {
  name: "load",
  action: function () {
    BlazeLayout.render("layout", {main: "loading"});
  }
});