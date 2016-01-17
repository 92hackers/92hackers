/**
 * Created by Michael on 2015/8/4.
 */
initialImageUpload = function($container, w, h, url, fileInput, imgLoadCallback, imgUnloadCallback) {

  var croppable = false;

  var $picture = $container.find("img").hide()
      .load(function() {
        init();
        if (imgLoadCallback) {
          imgLoadCallback();
        }
      }).attr("src", url);

  var $chooser = fileInput;
  var $zoomin = $container.find(".img-upload-zoomin");
  var $zoomout = $container.find(".img-upload-zoomout");
  var $rotate = $container.find(".img-upload-rotate");

  var tid;

  var canvas = $("<canvas />")
      .attr({
        width: w,
        height: h
      })
      .get(0);

  var canvasContext = canvas.getContext("2d");

  function init() {
    $picture.guillotine({width: w, height: h});
    $picture.guillotine("fit");

    $picture.show();

    $chooser.change(changeImage);

    $zoomin.on({
      mousedown: continuousZoomIn,
      mouseup: stopContinuous,
      mouseleave: stopContinuous,
      touchend: stopContinuous,
      touchcancel: stopContinuous
    });

    $zoomout.on({
      mousedown: continuousZoomOut,
      mouseup: stopContinuous,
      mouseleave: stopContinuous,
      touchend: stopContinuous,
      touchcancel: stopContinuous
    });

    $rotate.click(rotateRight);

    croppable = true;
  }

  function destroy() {
    croppable = false;

    $chooser.off("change", changeImage);

    $zoomin.off({
      mousedown: continuousZoomIn,
      mouseup: stopContinuous,
      mouseleave: stopContinuous,
      touchend: stopContinuous,
      touchcancel: stopContinuous
    });

    $zoomout.off({
      mousedown: continuousZoomOut,
      mouseup: stopContinuous,
      mouseleave: stopContinuous,
      touchend: stopContinuous,
      touchcancel: stopContinuous
    });

    $rotate.off("click", rotateRight);

    $picture.hide();
    $picture.removeAttr("src");

    $picture.guillotine("remove");
  }

  function changeImage() {
    var f = $chooser[0].files[0];
    var imageType = /^image\//;
    if (!imageType.test(f.type)) return;

    if (imgUnloadCallback) imgUnloadCallback();
    destroy();

    var reader = new FileReader();
    reader.onload = function (e) {
      $picture.attr("src", e.target.result);
      $("#upload-avatar-modal").modal("show");			// do something when files selected.
    };
    reader.readAsDataURL(f);
  }

  function continuous(action) {
    var t = 300;

    (function doTimeout() {
      action();
      tid = setTimeout(doTimeout, t);
      if (t > 50) t -= 50;
    })();
  }

  function stopContinuous() {
    if (tid) {
      clearTimeout(tid);
      tid = undefined;
    }
  }

  function continuousZoomIn() {
    continuous(function () {
      $picture.guillotine("zoomIn");
    });
  }

  function continuousZoomOut() {
    continuous(function () {
      $picture.guillotine("zoomOut");
    });
  }

  function rotateRight() {
    $picture.guillotine("rotateRight");
  }

  function crop() {
    canvasContext.save();

    if (!croppable) return "";

    var cropData = $picture.guillotine("getData");

    var ax = cropData.x / cropData.scale;
    var ay = cropData.y / cropData.scale;
    var aw = cropData.w / cropData.scale;
    var ah = cropData.h / cropData.scale;

    var sx, sy, sw, sh, dw, dh;

    switch (cropData.angle) {
      case 0:
        sx = ax;
        sy = ay;
        sw = aw;
        sh = ah;
        dw = w;
        dh = h;
        break;
      case 90:
        canvasContext.translate(w, 0);
        canvasContext.rotate((Math.PI / 180) * 90);
        sx = ay;
        sy = $picture[0].naturalHeight - (ax + aw);
        sw = ah;
        sh = aw;
        dw = h;
        dh = w;
        break;
      case 180:
        canvasContext.translate(w, h);
        canvasContext.rotate((Math.PI / 180) * 180);
        sx = $picture[0].naturalWidth - (ax + aw);
        sy = $picture[0].naturalHeight - (ay + ah);
        sw = aw;
        sh = ah;
        dw = w;
        dh = h;
        break;
      case 270:
        canvasContext.translate(0, h);
        canvasContext.rotate((Math.PI / 180) * 270);
        sx = $picture[0].naturalWidth - (ay + ah);
        sy = ax;
        sw = ah;
        sh = aw;
        dw = h;
        dh = w;
        break;
    }

    canvasContext.drawImage($picture[0], sx, sy, sw, sh, 0, 0, dw, dh);

    var result = canvas.toDataURL("image/jpeg", 0.75);

    clearCanvas();
    canvasContext.restore();

    return result;
  }

  function clearCanvas() {
    canvasContext.save();

    canvasContext.setTransform(1, 0, 0, 1, 0, 0);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    canvasContext.restore();
  }

  return crop;
};
