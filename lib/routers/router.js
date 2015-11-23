/**
 * Created by cy on 20/11/15.
 *    global router.
 */

FlowRouter.route("/", {
    name: "index",
    action: function () {
        BlazeLayout.render("index");
    }
});