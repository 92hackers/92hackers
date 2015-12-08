/**
 * Created by cy on 20/11/15.
 *    global router.
 */

FlowRouter.route("/", {
    name: "index",
    action: function () {
        if (Meteor.userId()) {
            BlazeLayout.render("layout", {main: "login"});
        } else {
            console.log("nice to meet you.");
            BlazeLayout.render("index");
        }
    }
});