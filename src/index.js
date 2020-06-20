window.addEventListener("load", (event) => {
  /**
   * 'onchange' not working well when input[type=number]
   * but 'oninput','onpropertychange'(IE) does
   */
  let canvasCtx = null;
  let imgToPaint = null;
  const ParamsStore = {}; //to store ctx.drawImage params
  const imgWidthInput = document.getElementById("img-width");
  const imgHeightInput = document.getElementById("img-height");
  const outputContainer = document.getElementById("output");
  const eventToBind = "oninput" in imgWidthInput ? "input" : "propertychange";

  /** get context */
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    canvasCtx = canvas.getContext("2d");
  } else {
    alert("当前浏览器不支持canvas绘制功能哦");
  }

  /** draw selected image */
  const drawImg = () => {
    const {
      "img-x": x,
      "img-y": y,
      "img-width": width,
      "img-height": height,
      "img-rotate": rotate,
    } = ParamsStore;

    canvasCtx.save();
    canvasCtx.translate(x, y);
    canvasCtx.rotate((rotate * Math.PI) / 180);
    canvasCtx.drawImage(
      imgToPaint,
      0,
      0,
      imgToPaint.width,
      imgToPaint.height,
      0, //x,
      0, //y,
      width,
      height
    );
    canvasCtx.restore();
  };

  /** draw clip stroke */
  const drawClip = (toClip = false) => {
    const {
      "clip-width": clipWidth,
      "clip-height": clipHeight,
      "clip-rotate": clipRotate,
      "clip-x": clipX,
      "clip-y": clipY,
    } = ParamsStore;
    canvasCtx.save();
    canvasCtx.translate(clipX, clipY);
    canvasCtx.rotate((clipRotate * Math.PI) / 180);
    canvasCtx[toClip ? "fillRect" : "strokeRect"](0, 0, clipWidth, clipHeight);
    canvasCtx.restore();
  };

  /** update canvas */
  const paintCanvas = () => {
    if (canvasCtx) {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, 300, 300);
      drawImg();
      drawClip();
      canvasCtx.restore();
    }
  };

  const appendOutput = (data) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = data;
    const results = document.querySelectorAll("#output img");
    outputContainer.insertBefore(img, results[0]);
    if (results.length > 5) {
      outputContainer.removeChild(results[5]);
    }
  };

  const confirmHandler = () => {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, 300, 300);
    drawImg();
    canvasCtx.globalCompositeOperation = "destination-in";
    drawClip(true);
    const data = canvas.toDataURL();
    appendOutput(data);
    canvasCtx.restore();
  };

  const selectImgHandler = (e) => {
    const files = e.target.files;
    ParamsStore["clip-rotate"] = 0;
    ParamsStore["img-rotate"] = 0;
    if (files[0]) {
      let img = new Image();
      img.crossOrigin = "anonymous";
      const reader = new FileReader();
      reader.onload = (function (aImg) {
        return function (e) {
          aImg.addEventListener("load", function () {
            ParamsStore["img-width"] = imgWidthInput.value = aImg.width;
            ParamsStore["img-height"] = imgHeightInput.value = aImg.height;
            imgToPaint = aImg;
            paintCanvas();
          });
          aImg.src = e.target.result;
        };
      })(img);
      reader.readAsDataURL(files[0]);
    }
  };

  /** bind events */
  document.getElementById("confirm").addEventListener("click", confirmHandler);
  document.getElementById("reset").addEventListener("click", paintCanvas);
  document
    .getElementById("imgSelector")
    .addEventListener("change", selectImgHandler);

  /** bind params to a store */
  const bindParams = (nodelist, store) => {
    const rePaintCanvas = function (e) {
      const input = e.target;
      let realValue = isNaN(input.value) ? 0 : input.value;
      //limit rotate value to avoid ui bug
      if (input.id === "img-rotate" || input.id === "clip-rotate") {
        if (realValue > 360000) {
          input.value = realValue = 360000;
        }
        if (realValue < -360000) {
          input.value = realValue = -360000;
        }
      }
      store[e.target.id] = realValue;
      paintCanvas();
    };
    Array.prototype.slice.call(nodelist).forEach((input) => {
      const v = Number(input.value);
      store[input.id] = isNaN(v) ? 0 : v;
      input.addEventListener(eventToBind, rePaintCanvas);
    });
  };

  /** onload, set default image & initial params */
  imgToPaint = new Image();
  imgToPaint.crossOrigin = "anonymous";
  imgToPaint.addEventListener("load", function () {
    imgWidthInput.value = imgToPaint.width;
    imgHeightInput.value = imgToPaint.height;
    //bind params to a store
    const imgParamInputs = document.querySelectorAll(
      ".img-params input,.clip-params input"
    );
    bindParams(imgParamInputs, ParamsStore);
    paintCanvas();
  });
  imgToPaint.src = "/static/img/lisa.jpeg";
});
