"use strict";

window.addEventListener('load', function (event) {
  /**
   * 'onchange' not working well when input[type=number]
   * but 'oninput','onpropertychange'(IE) does
   */
  var canvasCtx = null;
  var targetImg = null; //selected image

  var imgWidthInput = document.getElementById('img-width');
  var imgHeightInput = document.getElementById('img-height');
  var outputContainer = document.getElementById('output');
  var eventToBind = 'oninput' in imgWidthInput ? 'input' : 'propertychange';
  var ParamsStore = {}; //to store ctx.drawImage params

  /** get context */

  var canvas = document.getElementById('canvas');

  if (canvas.getContext) {
    canvasCtx = canvas.getContext('2d');
  } else {
    alert('当前浏览器不支持canvas绘制功能哦');
  }
  /** draw selected image */


  var drawImg = function drawImg() {
    var x = ParamsStore['img-x'],
        y = ParamsStore['img-y'],
        width = ParamsStore['img-width'],
        height = ParamsStore['img-height'],
        rotate = ParamsStore['img-rotate'];
    canvasCtx.save();
    canvasCtx.translate(x, y);
    canvasCtx.rotate(rotate * Math.PI / 180);
    canvasCtx.drawImage(targetImg, 0, 0, targetImg.width, targetImg.height, 0, //x,
    0, //y,
    width, height);
    canvasCtx.restore();
  };
  /** draw clip stroke */


  var drawClip = function drawClip() {
    var toClip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var clipWidth = ParamsStore['clip-width'],
        clipHeight = ParamsStore['clip-height'],
        clipRotate = ParamsStore['clip-rotate'],
        clipX = ParamsStore['clip-x'],
        clipY = ParamsStore['clip-y'];
    canvasCtx.save();
    canvasCtx.translate(clipX, clipY);
    canvasCtx.rotate(clipRotate * Math.PI / 180);
    canvasCtx[toClip ? 'fillRect' : 'strokeRect'](0, 0, clipWidth, clipHeight);
    canvasCtx.restore();
  };
  /** update canvas */


  var paintCanvas = function paintCanvas() {
    if (canvasCtx) {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, 300, 300);
      drawImg();
      drawClip();
      canvasCtx.restore();
    }
  };

  var appendOutput = function appendOutput(data) {
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = data;
    var results = document.querySelectorAll('#output img');
    outputContainer.insertBefore(img, results[0]);

    if (results.length > 5) {
      outputContainer.removeChild(results[5]);
    }
  };

  var confirmHandler = function confirmHandler() {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, 300, 300);
    drawImg();
    canvasCtx.globalCompositeOperation = 'destination-in';
    drawClip(true);
    var data = canvas.toDataURL();
    appendOutput(data);
    canvasCtx.restore();
  };

  var selectImgHandler = function selectImgHandler(e) {
    var files = e.target.files;
    ParamsStore['clip-rotate'] = 0;
    ParamsStore['img-rotate'] = 0;

    if (files[0]) {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      var reader = new FileReader();

      reader.onload = function (aImg) {
        return function (e) {
          aImg.addEventListener('load', function () {
            ParamsStore['img-width'] = imgWidthInput.value = aImg.width;
            ParamsStore['img-height'] = imgHeightInput.value = aImg.height;
            targetImg = aImg;
            paintCanvas();
          });
          aImg.src = e.target.result;
        };
      }(img);

      reader.readAsDataURL(files[0]);
    }
  };
  /** bind events */


  document.getElementById('confirm').addEventListener('click', confirmHandler);
  document.getElementById('reset').addEventListener('click', paintCanvas);
  document.getElementById('imgSelector').addEventListener('change', selectImgHandler);
  /** bind params to a store */

  var bindParams = function bindParams(nodelist, store) {
    var rePaintCanvas = function rePaintCanvas(e) {
      var v = e.target.value;
      store[e.target.id] = isNaN(v) ? 0 : v;
      paintCanvas();
    };

    Array.prototype.slice.call(nodelist).forEach(function (input) {
      store[input.id] = Number(input.value);
      input.addEventListener(eventToBind, rePaintCanvas);
    });
  };
  /** onload, set default image & initial params */


  targetImg = new Image();
  targetImg.crossOrigin = 'anonymous';
  targetImg.addEventListener('load', function () {
    imgWidthInput.value = targetImg.width;
    imgHeightInput.value = targetImg.height; //bind params to a store

    var imgParamInputs = document.querySelectorAll('.img-params input,.clip-params input');
    bindParams(imgParamInputs, ParamsStore);
    paintCanvas();
  });
  targetImg.src = '/static/img/lisa.jpeg';
});