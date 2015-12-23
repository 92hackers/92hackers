/**
 *  as what it's name said.
 * Created by cy on 14/12/15.
 */

var projectRouter = FlowRouter.group({
  prefix: "/project",
  name: "project"
});

var projectCreate = projectRouter.group({
  prefix: "/create",
  name: "projectCreate"
});

projectCreate.route("/basic", {
  action: function () {
    BlazeLayout.render("layout", {main: "projectCreateBasic"});
  }
});

projectCreate.route("/fullDesc", {
  action: function () {
    BlazeLayout.render("layout", {main: "projectCreateFullDesc"})
  }
});

projectCreate.route("/hr", {
  action: function () {
    BlazeLayout.render("layout", {main: "projectCreateHr"})
  }
});

projectCreate.route("/services", {
  action: function () {
    BlazeLayout.render("layout", {main: "projectCreateServices"})
  }
});
