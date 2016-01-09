/**
 * Created by cy on 23/12/15.
 */

"use strict";

var isApplySuccess = false;
var projectApplications = new ReactiveVar(null);
var readyForDelete = false;

Template.projectHomepage.onCreated(function () {
  var template = this;
  template.ready = new ReactiveVar();
  template.isProjectOwner = new ReactiveVar(false);

  template.autorun(function () {
    var currentProject = Project.findOne();
    if ( !!Meteor.user() ) {
      if (currentProject && currentProject.owner === Meteor.userId()) {
        template.isProjectOwner.set(true);
        template.isEditState = false;
        template.isUpdated = false;
      }
    }
  });

});

Template.projectHomepage.onRendered(function () {

  var projectId = FlowRouter.getParam("pid");
  var template = this;

/*  template.autorun(function () {
    GlobalObject.subscribeCache.subscribe("singleProject", projectId, function () {
      Tracker.afterFlush(function () {
        console.log("message from after flush");
        var project = Project.findOne({_id: projectId});
        SEO.set({ title: "92hackers - " + project.name });
        console.log( $("#join-button"));
        $.material.init();
      });
    });
    template.ready.set(GlobalObject.subscribeCache.ready());
  });*/

  template.autorun(function () {
    GlobalObject.subscribeCache.subscribe("singleProject", projectId, {
      onReady: function () {
        var project = Project.findOne({_id: projectId});
        SEO.set({ title: "92hackers - " + project.name });
      }
    });
    //TODO: 说明：　这个地方暂时可以工作，　还需要发布到服务器上进行调试，
    //　我不能理解 subscribition ready 的真正意思，到底是刚开始subscribe还是数据已经都拿到了，
    //　但是这里本机上没有延时的结果是 ready的时候，数据已经取好了，所以设置一个 1ms 的延时，
    //　如果不行的话，还是要用 afterflush ，上面的代码，确实，本机上面数据的延时不太好测试。

    projectApplications = ProjectApplications.find({projectId: projectId});

    template.ready.set(GlobalObject.subscribeCache.ready());
    if (template.ready.get()) {
      var timeId = Meteor.setTimeout(function () {
        $.material.init();
        Meteor.clearTimeout(timeId);
      }, 1);
    }
  });

  // when project owner logged out, remove edit trace.
  template.autorun(function () {
    if ( !Meteor.user() ) {         // when log out, clean variable settings.
      template.isProjectOwner.set(false);
    }
    if (!Meteor.user() && template.isProjectOwner.get() && template.isEditState) {
      logOutFromEditState(template);
    }
  });
  // todo:  beyond above, there needs to remove trace of editting services and hire positions.
  //   but, there exists much more important works to deal, so, remain it to be fixed in the version 2.0


/*  template.autorun(function () {
    var ownResource = $("#own-resource");
    var clone = $("#own-resource-clone");
    console.log("autorun in oncreated function");
    if (template.projectUpdated.get() && template.isProjectOwner) {
      console.log("from element text replace trigger");
      ownResource.text(clone.text());
      template.projectUpdated.set(false);
    }
  });*/
});

Template.projectHomepage.helpers({
  projectReady: function () {
    return Template.instance().ready.get();
  },
  singleProject: function () {
    var projectId = FlowRouter.getParam("pid");
    return Project.findOne({_id: projectId}) || {};
  },
  hasProductPositions: function () {
    return this.productHire.length > 0;
  },
  hasTechPositions: function () {
    return this.techHire.length > 0;
  },
  hasDesignPositions: function () {
    return this.designHire.length > 0;
  },
  productPositionsRest: function () {
    var positionsInList = this.productHire;
    var positionsSelected = [];
    _.each(positionsInList, function ( item, index ) {
      positionsSelected.push(item.category);
    });
    return _.difference(GlobalObject.positionsList.product, positionsSelected);
  },
  techPositionsRest: function () {
    var positionsList = this.techHire;
    var positionsSelected = [];
    _.each(positionsList, function ( item, index ) {
      positionsSelected.push(item.category);
    });
    return _.difference(GlobalObject.positionsList.tech, positionsSelected);
  },
  designPositionsRest: function () {
    var positionsList = this.designHire;
    var positionsSelected = [];
    _.each(positionsList, function ( item, index ) {
      positionsSelected.push(item.category);
    });
    return _.difference(GlobalObject.positionsList.design, positionsSelected);
  },
  isPay: function (parentContext) {
    return parentContext.payOrNot === "pay";
  },
  coopToolsRest: function () {
    return _.difference(GlobalObject.servicesList.cooperationTools, this.cooperationTools);
  },
  comToolsRest: function () {
    return _.difference(GlobalObject.servicesList.communicationTools, this.communicationTools);
  },
  fileToolsRest: function () {
    return _.difference(GlobalObject.servicesList.fileTools, this.fileTools);
  },
  projectOwnerProfile: function () {
    return Meteor.users.findOne({_id: this.owner}, {limit: 1, fields: {username: 1, profile: 1}}) || {};
  },
  publishDate: function () {
    if (this) {
      var createdAt = this.createdAt;
    }
    var publishDate = {
      fullYear: createdAt.getFullYear(),
      month: createdAt.getMonth() + 1,      // month count from 0.
      date: createdAt.getDate()
    };
    return publishDate || {};
  },
  isProjectOwner: function (parentContext) {
    var projectOwner = parentContext || this;
    return Meteor.userId() === projectOwner.owner;
  },
  hasApplied: function () {
    var hasApplied = false;
    projectApplications.forEach(function ( project ) {
      console.log(project.userId);
      if (project.userId === Meteor.userId()) {
        hasApplied = true;
      }
    });
    return hasApplied;
  }
});

function getFormValues() {

  // basic info
  var demoUrlText = $("#demo-url").text().trim();
  var httpSchemaPattern = /^http.*$/;
  if ( !httpSchemaPattern.test(demoUrlText) ) {
    demoUrlText = "http://" + demoUrlText;
  }

  var ownResource = $("#own-resource").text().trim();

  // full description
  var fullDescription = {
    initialMind: $("#initial-mind").text().trim(),
    problemsToSolve: $("#problems-to-solve").text().trim(),
    howToSolve: $("#how-to-solve").text().trim(),
    usageScene: $("#usage-scene").text().trim(),
    futureVision: $("#future-vision").text().trim(),
    aboutMyself: $("#about-myself").text().trim()
  };

  var productHire = [];
  var techHire = [];
  var designHire = [];

  function getCategory(element) {
    return $(element).children(".hire-category").text();
  }

  function getSalary(element) {
    var salaryElem = $(element).children(".hire-salary");
    return salaryElem.size() ? salaryElem.text().replace("￥", "") : 0;
  }

  $(".product-position").each(function () {
    var self = this;
    productHire.push({
      category: getCategory(self),
      salary: getSalary(self)
    });
  });

  $(".tech-position").each(function () {
    var self = this;
    techHire.push({
      category: getCategory(self),
      salary: getSalary(self)
    });
  });

  $(".design-position").each(function () {
    var self = this;
    designHire.push({
      category: getCategory(self),
      salary: getSalary(self)
    });
  });

  var cooperationTools = [],
      communicationTools = [],
      fileTools = [];

  $(".coop-tool").each(function () {
    cooperationTools.push($(this).text().trim());
  });
  $(".com-tool").each(function () {
    communicationTools.push($(this).text().trim());
  });
  $(".file-tool").each(function () {
    fileTools.push($(this).text().trim());
  });

  return {
    demoUrl: demoUrlText,
    ownResource: ownResource,
    fullDescription: fullDescription,
    productHire: productHire,
    techHire: techHire,
    designHire: designHire,
    cooperationTools: cooperationTools,
    communicationTools: communicationTools,
    fileTools: fileTools
  };

  // do not log update time now, because there is no idea where to use that data.
}

function replaceContentWithClone(template) {
  template.$(".editable").each(function () {
    var elemId = $(this).attr("id");
    template.$(this).text(template.$("#" + elemId + "-clone").text());
  });

  template.$("#demo-url").html(template.$("#demo-url-clone").html());

  $.material.init();
  template.$(".updated-item").remove();
}

function logOutFromEditState( template, isSave ) {

  var isSave = isSave;
  var editButton = template.$("#edit-button");
  var saveButton = template.$("#save-button");
  var cancelButton = template.$("#cancel-button");
  var demoUrlHelp = template.$("#demo-url-help");

  var checkboxes = template.$(".checkbox");
  var checkIcon = template.$(".fa-check");

  var loader = template.$(".loader");
  var dangerZone = template.$("#danger-zone");

  dangerZone.hide();

  template.isEditState = false;

  if (isSave) {
    loader.hide();
  }

  var editableElems = template.$(".editable");
  var editableDemoUrl = template.$(".editable-item");

  var plusIcon = template.$(".fa-plus");
  var minusIcon = template.$(".fa-minus");

  var tempArray = [saveButton, cancelButton, demoUrlHelp, plusIcon, minusIcon, checkboxes, checkIcon];

  _.each(editableElems, function ( item, index ) {
    var elemsId = item.id;
    var currentElem = $("#" + elemsId);
    if (!isSave) {
      currentElem.text($("#" + elemsId + "-clone").text());
    }
    currentElem.removeClass("site-inline-edit-wrap").attr("contenteditable", false);
  });

  if (!isSave) {
    editableDemoUrl.html($("#demo-url-clone").html());
  }
  editableDemoUrl.removeClass("site-inline-edit-item-wrap").attr("contenteditable", false);

  // hide plus and minus icon.

  if (editButton.size()) {editButton.show();}

  _.each(tempArray, function ( item, index ) {
    if (item.size() && (item.css("display") === "block" || item.css("display") === "inline-block" || item.css("display") === "inline")) { item.hide(); }
  });
}

Template.projectHomepage.events({
  "focus #demo-url": function ( event, template ) {
    if (template.isEditState) {
      $("#demo-url-help").css("visibility", "visible");
    }
  },
  "blur #demo-url": function ( event, tempalte ) {
    if (tempalte.isEditState) {
      $("#demo-url-help").css("visibility", "hidden");
    }
  },
  "keyup .editable-item, keyup .editable": function ( event, template ) {
    var currentElem = template.$(event.currentTarget);
    if (currentElem.text() === "") {
      currentElem.addClass("site-inline-edit-error-wrap");
    } else {
      currentElem.removeClass("site-inline-edit-error-wrap");
    }
  },
  "click #edit-button": function ( event, template ) {
    var editableElems = template.$(".editable");
    var editableDemoUrl = template.$(".editable-item");

    var editButton = template.$("#edit-button");
    var saveButton = template.$("#save-button");
    var cancelButton = template.$("#cancel-button");
    var demoHelp = template.$("#demo-url-help");
    var dangerZone = template.$("#danger-zone");

    editableElems.addClass("site-inline-edit-wrap").attr("contenteditable", true);
    editableDemoUrl.addClass("site-inline-edit-item-wrap").attr("contenteditable", true);

    // show plus and minus icon.
    $(".fa-plus").show();
    $(".fa-minus").show();

    template.isEditState = true;

    editButton.hide();
    demoHelp.show();
    saveButton.show();
    cancelButton.show();
    dangerZone.show();
  },
  "click #cancel-button": function ( event, template ) {
    logOutFromEditState(template);
  },
  "click #save-button": function ( event, template ) {
    // update current project.
    var projectId = FlowRouter.getParam("pid");
    var updatedFields = getFormValues();
    var saveButton = $("#save-button");
    var loader = $(".loader");
    console.log(updatedFields);

    var urlPattern = /^http:\/\/(www\.)?[0-9a-zA-Z]+\.[0-9a-zA-Z]+$/;
    if (!urlPattern.test(updatedFields.demoUrl)) {
      alert("请输入正确格式的网址");
      $("#demo-url").focus();
      return ;
    }
    if ( !updatedFields.ownResource.length ) {
      alert("请介绍自己能做什么。");
      $("#own-resource").focus();
      return ;
    }
    _.each(updatedFields.fullDescription, function ( value, key ) {
      var pattern = /[A-Z]/g;
      if ( !value.length ) {
        alert("请完整介绍自己的创意。");
        $("#" + key.replace(pattern, function ( char ) {
              return "-" + char.toLowerCase();
            })).focus();
        return ;
      }
    });

    saveButton.hide();
    loader.show();

    template.isUpdated = true;

    Project.update({_id: projectId}, {$set: updatedFields}, function ( err, result ) {
      if (err) {
        console.log(err);
        template.isUpdated = false;
        loader.hide();
        saveButton.show();
      } else {
        replaceContentWithClone(template);
        template.isUpdated = false;
        console.log(result);
        logOutFromEditState(template, true);
      }
    });
  },
  "click .hide-on-edit": function ( event, template ) {
    var currentElem = template.$(event.currentTarget);
    currentElem.hide();
    currentElem.next(".show-on-edit").show();
    currentElem.parent().next(".checkbox").show();
  },
  "click .show-on-edit": function ( event, template ) {

    var currentElem = template.$(event.currentTarget);
    var positionsContainer = currentElem.parent().next(".checkbox");
    var parentNode = currentElem.parent().nextAll("ul")[0];
    var elemToBeInsertedTo = currentElem.parent().nextAll("ul").eq(0);
    var positions = positionsContainer.find("input[type=checkbox]:checked");
    var dataPositions = [];
    var data = {};

    if (elemToBeInsertedTo.hasClass("services-list")) {
      if (positions.size()) {
        positions.each(function () {
          dataPositions.push({
            serviceCategory: positionsContainer.attr("id").split("-")[0] + "-tool",
            service: $(this).val()
          });
        });
      }

      data = {
        services: dataPositions
      };
      Blaze.renderWithData(Template.serviceSelected, data, parentNode);
    } else if (elemToBeInsertedTo.hasClass("hire-list")) {

      var salaryElem = positionsContainer.find("input[type=text]");
      var isPay = salaryElem.size() ? true : false;

      try {
        if (positions.size()) {
          _.each(positions, function ( item, index ) {
            var salary;
            if (isPay) {
              salary = $(item).nextAll(".salary").children("input[type=text]").val().trim();
              if (!salary) {
                throw Meteor.Error("请输入月薪数额");
              }
            } else {
              salary = 0;
            }
            dataPositions.push({
              positionCategory: positionsContainer.attr("id").split("-")[0] + "-position",
              position: $(item).val(),
              salary: salary
            });
          });
        }
      } catch (err)  {
        alert(err.error);
        positions.nextAll(".salary").find("input[type=text]").each(function () {
          if ($(this).val() === "") {
            $(this).focus();
          }
        });
        return ;
      }
      data = {
        isPay: isPay,
        positions: dataPositions
      };
      Blaze.renderWithData(Template.selectedItem, data, parentNode);
    }

    currentElem.hide();
    currentElem.prev(".hide-on-edit").show();
    positionsContainer.hide();

    // display the new rendered minus icon.
    $(".fa-minus").show();
    // remove the checked label from rest list.
    positions.parent().remove();
  },
  "click .fa-minus": function ( event, template ) {
    var currentElem = template.$(event.currentTarget);
    var parentNode = currentElem.parents("ul").prev(".checkbox")[0];
    var currentElemParent = currentElem.parents("ul").eq(0);
    var data = {};

    if (currentElemParent.hasClass("services-list")) {
      data = {
        service: currentElem.parent().text().trim()
      };
      Blaze.renderWithData(Template.serviceCheckable, data, parentNode);
    } else if (currentElemParent.hasClass("hire-list")) {

      var position = currentElem.next(".hire-category").text();
      var salaryElem = currentElem.nextAll(".hire-salary");
      var isPay = salaryElem.size() ? true : false;
      data = {
        position: position,
        isPay: isPay
      };

      Blaze.renderWithData(Template.checkableItem, data, parentNode);
    }

    currentElem.closest("li").remove();

    $.material.init();
  },
  "change .salary input[type=text]": function ( event, template ) {

    var currentElem = template.$(event.currentTarget);
    var value = currentElem.val();
    var numberPattern = /^[1-9][0-9]+$/;
    if ( !numberPattern.test(value) ) {
      alert("请输入数字!");
      currentElem.focus();
    }
  },
  "click .checkbox label": function ( event, template ) {
    var currentElem = template.$(event.currentTarget);
    var target = currentElem.find("input[type=text]");
    if (target.size()) {
      if (currentElem.find("input[type=checkbox]").is($(":checked"))) {
        target.focus();
      } else {
        target.blur();
      }
    }
  },
  "shown.bs.modal #delete-project-modal": function ( event, template ) {
    $("#password").focus();
  },
  "hidden.bs.modal #delete-project-modal": function ( event, template ) {
    // TODO: 这里除了需要删除项目本身以外，还需要删除跟该项目有关的其他方面内容，比如：申请。
    var projectId = FlowRouter.getParam("pid");
    if (readyForDelete && Meteor.userId()) {
      Project.remove({_id: projectId}, function ( err, result ) {
        readyForDelete = false;
        if (!err && result) {
          FlowRouter.go("userHomepage", {uid: Meteor.userId()});
        } else {
          console.log(err);
          alert("删除项目失败，请再次尝试");
        }
      });
    }
  },
  "submit #delete-project-modal form": function ( event, template ) {
    event.preventDefault();
    var target = $("#password");
    var digest = Package.sha.SHA256(target.val());
    Meteor.call("checkPassword", digest, function ( err, result ) {
      if (!err && result) {
        readyForDelete = true;
        template.$("#delete-forever").text("删除成功!").addClass("text-success");
        var timeId = Meteor.setTimeout(function () {
          $("#delete-project-modal").modal("hide");
          Meteor.clearTimeout(timeId);
        }, 2000);
      } else {
        alert("密码错误, 请重新输入");
        target.focus();
      }
    });
  },
  "click #join-button": function ( event, template ) {
   if (!Meteor.user()) {
     alert("请先登陆或者注册 !");
     return ;
   } else {
     // TODO: when click join button, some thing to be happen.
   }
  },
  "submit #join-modal form": function ( event, template ) {
    event.preventDefault();
    var positionApplyFor = template.$("[name='select-position']:checked").val();
    var projectId = FlowRouter.getParam("pid");
    if (!positionApplyFor) {
      alert("请先选择职位！");
      return ;
    }
    if (!Meteor.user()) {
      alert("请先登陆或者注册!");
      return ;
    } else {
      var data = {
        projectId: projectId,
        userId: Meteor.userId(),
        positionApplyFor: positionApplyFor
      };
      //这里需要用Methods, 因为需要根据 projectid userid 判断是否该用户的该申请是重复的。
      // here need to be changed into Meteor.methods, insert and update is not secure.
      ProjectApplications.insert(data, function ( err, result ) {
        if (!err && result) {
          template.$(event.currentTarget).find("[type=submit]").text("申请成功！").addClass("text-success");
          isApplySuccess = true;
          var timeId = Meteor.setTimeout(function () {
            template.$("#join-modal").modal("hide");
            Meteor.clearTimeout(timeId);
          }, 2000);
        } else {
          alert("申请加入失败, 请重试!");
          return ;
        }
      });
    }
  }
/*  "hidden.bs.modal #join-modal": function ( event, template ) {
    var target = template.$("#join-button");
    // TODO: secure issuse: somebody could submit application multi times.
    // 是否在 join modal 影藏之后再　reactive. ???????
    if (isApplySuccess) {
      target.removeClass("btn-raised").text("申请加入成功！").addClass("text-success").attr("readable", "readable");
    }
  }*/
});

Template.projectHomepage.onDestroyed(function () {
// nothing
  console.log("from template project homepage destoryed");
  console.log("nihao");
});
