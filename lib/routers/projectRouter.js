/**
 *  as what it's name said.
 * Created by cy on 14/12/15.
 */

var projectRouter = FlowRouter.group({
  prefix: "/project",
  name: "project"
});

projectRouter.route("/create", {
  action: function () {
    BlazeLayout.render("layout", {main: "projectCreate"});
  }
});
