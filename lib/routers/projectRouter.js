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
  },
  name: "projectCreateBasic"
});

projectCreate.route("/fullDesc", {
  action: function () {
    BlazeLayout.render("layout", {main: "projectCreateFullDesc"})
  },
  name: "projectCreateFullDesc"
});

projectCreate.route("/hr", {
  action: function () {
    BlazeLayout.render("layout", {main: "projectCreateHr"})
  },
  name: "projectCreateHr"
});

projectCreate.route("/services", {
  action: function () {
    BlazeLayout.render("layout", {main: "projectCreateServices"})
  },
  name: "projectCreateServices"
});

var projectFamilyRouter = FlowRouter.group({
  prefix: "/projects",
  name: "projects"
});

projectFamilyRouter.route("/:pid", {
  action: function () {
    "use strict";
    BlazeLayout.render("layout", {main: "projectHomepage"});
  },
  name: "projectHomepage"
});
