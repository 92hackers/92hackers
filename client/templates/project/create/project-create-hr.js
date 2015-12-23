/**
 * Created by cy on 15/12/15.
 */

"use strict";

var valuesCollection;

Template.projectCreateHr.onRendered(function () {
  componentHandler.upgradeAllRegistered();
  $.material.init();
});

function getFormValues() {
  var $payOrNot = $("[name='pay-or-not']:checked");
  var $product = $("[name=product]:checked");
  var $tech = $("[name=tech]:checked");
  var $design = $("[name=design]:checked");

  var i, j, k;

  var productChecked = [];
  var techChecked = [];
  var designChecked = [];


  if ($product.size()) {
    for (i = 0; i < $product.size(); i++) {
      productChecked.push({
        category: $product[i].value,
        salary: $($product[i]).siblings(".show-salary").find("input").val()
      });
    }
  }

  if ($tech.size()) {
    for (j = 0; j < $tech.size(); j++) {
      techChecked.push({
        category: $tech[j].value,
        salary: $($tech[j]).siblings(".show-salary").find("input").val()
      });
    }
  }

  if ($design.size()) {
    for (k = 0; k < $design.size(); k++) {
      designChecked.push({
        category: $design[k].value,
        salary: $($design[k]).siblings(".show-salary").find("input").val()
      });
    }
  }

  valuesCollection = {
    payOrNot: $payOrNot.val(),
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
  "click input[name='pay-or-not']": function ( event ) {
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
  "submit": function ( event, template ) {
    event.preventDefault();
    getFormValues();
    _.extend(GlobalObject.projectCreate, valuesCollection);
    console.log(valuesCollection);
    FlowRouter.go("/project/create/services");
  }
});

