/**
 * Created by cy on 20/11/15.
 *    global router.
 */

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