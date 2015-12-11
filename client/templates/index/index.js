/**
 *
 * Created by cy on 30/11/15.
 */

Template.index.onRendered(function () {

    // full-page.js initialisation.

    $("#full-page").fullpage({
        loopTop: true,
        loopBottom: true,
        navigation: true,
        navigationPosition: "right"
    });

    // material design plugin initialisation.

    $.material.init();
});
