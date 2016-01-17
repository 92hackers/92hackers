var getCroppedImg;
Template.avatarUploader.onRendered(function() {
  var template = this;
  getCroppedImg = initialImageUpload($("#avatar-upload"), 250, 250, "/images/default-avatar.png", $("#upload-avatar-button"));
  template.$(".loader").hide();
  $.material.init();
});

Template.avatarUploader.events({
  'click #cropBtn': function( event, template ) {
    var dataUrl = getCroppedImg();
    var userId = FlowRouter.getParam("uid");
    var $currentElem = template.$(event.currentTarget);
    var $loader = template.$(".loader");
    $currentElem.hide();
    $loader.show();
    Meteor.call('sendAvatarInBase64', dataUrl, userId, function(err, res) {
      if (!res.code) {
        $loader.hide();
        $currentElem.text("上传成功！").addClass("text-success").show();
        var timeId = Meteor.setTimeout(function () {
          $("#upload-avatar-modal").modal("hide");
          Meteor.clearTimeout(timeId);
        }, 2000);
      } else {
        alert('图片上传失败，请重试');
      }
    });
  }
});

