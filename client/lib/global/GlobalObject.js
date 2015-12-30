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
