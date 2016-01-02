/**
 * Created by cy on 15/12/15.
 */

"use strict";

var valuesCollection;

Template.projectCreateHr.onCreated(function () {
  SEO.set({ title: "92hackers - 创建新项目"});
});

Template.projectCreateHr.onRendered(function () {
  componentHandler.upgradeAllRegistered();
  $.material.init();
});

function getFormValues() {
  var $payOrNot = $("[name='pay-or-not']:checked");
  var $product = $("[name=product]:checked");
  var $tech = $("[name=tech]:checked");
  var $design = $("[name=design]:checked");

  var productChecked = [];
  var techChecked = [];
  var designChecked = [];


  if ($product.size()) {
    $product.each(function () {
      productChecked.push({
        category: $(this).val(),
        salary: $payOrNot.val() === "pay" ? $(this).nextAll(".show-salary")
            .children("input[type=text]").val() : 0
      });
    });
  }

  if ($tech.size()) {
    $tech.each(function () {
      techChecked.push({
        category: $(this).val(),
        salary: $payOrNot.val() === "pay" ? $(this).nextAll(".show-salary")
            .children("input[type=text]").val() : 0
      });
    });
  }

  if ($design.size()) {
    $design.each(function () {
      designChecked.push({
        category: $(this).val(),
        salary: $payOrNot.val() === "pay" ? $(this).nextAll(".show-salary")
            .children("input[type=text]").val() : 0
      });
    });
  }

  valuesCollection = {
    payOrNot: $payOrNot.val() || "no-pay",      // set no pay default.
    productHire: productChecked,
    techHire: techChecked,
    designHire: designChecked
  }
}

Template.projectCreateHr.events({
  "click input[type=checkbox]": function ( event ) {

    event.stopPropagation();

    var pay = $("[name='pay-or-not']:checked").val();
    var $target = $(event.currentTarget).siblings(".salary");

    if (pay === "pay") {
      if ($(event.currentTarget).is($(":checked"))) {
        $target.fadeIn().addClass("show-salary").find("input").focus();
      } else {
        $target.fadeOut().removeClass("show-salary");
      }
    }
  },
  "click input[name='pay-or-not']": function ( event ) {      //  correct show and hide salary box when toggle between pay and no pay.
    var pay = $(event.currentTarget).val();
    var checkboxs = $("[type=checkbox]:checked");
    if (pay === "pay") {
      if (checkboxs.size()) {
        for (var i = 0; i < checkboxs.size(); i++) {
          var checkboxElem = checkboxs[i];
          var salaryElem = $(checkboxElem).siblings(".salary");
          if ( !salaryElem.hasClass("show-salary") ) {
            salaryElem.fadeIn().addClass("show-salary");
          }
        }
      }
    } else if (pay === "no-pay") {
      $(".show-salary").fadeOut().removeClass("show-salary");
    }
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
  "submit .project-create-hr-wrap form": function ( event, template ) {
    event.preventDefault();
    getFormValues();
    _.extend(GlobalObject.projectCreate, valuesCollection);
    console.log(valuesCollection);
    FlowRouter.go("projectCreateServices");
  }
});

