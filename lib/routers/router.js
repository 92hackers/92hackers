/**
 * Created by cy on 20/11/15.
 *    global router.
 */

// todo: 只有首页需要判断，如果它进入的是其他路由的页面，在 导航栏上面需要给出登陆和注册的按钮。

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