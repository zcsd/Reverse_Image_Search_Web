//========================================================================
// Drag and drop image handling
//========================================================================

var fileDrag = document.getElementById("file-drag");
var fileSelect = document.getElementById("file-upload");

// Add event listeners
fileDrag.addEventListener("dragover", fileDragHover, false);
fileDrag.addEventListener("dragleave", fileDragHover, false);
fileDrag.addEventListener("drop", fileSelectHandler, false);
fileSelect.addEventListener("change", fileSelectHandler, false);

function fileDragHover(e) {
  // prevent default behaviour
  e.preventDefault();
  e.stopPropagation();

  fileDrag.className = e.type === "dragover" ? "upload-box dragover" : "upload-box";
}

function fileSelectHandler(e) {
  // handle file selecting
  var files = e.target.files || e.dataTransfer.files;
  fileDragHover(e);
  for (var i = 0, f; (f = files[i]); i++) {
    previewFile(f);
  }
}

//========================================================================
// Web page elements for functions to use
//========================================================================

var imagePreview = document.getElementById("image-preview");
var imageResult = document.getElementById("image-result");
var uploadCaption = document.getElementById("upload-caption");
var predResult = document.getElementById("pred-result");

var imgResult1, imgResult2, imgResult3, imgResult4, imgResult5;

//========================================================================
// Main button events
//========================================================================

function submitImage() {
  // action for the submit button
  console.log("submit");

  if (!imagePreview.src || !imagePreview.src.startsWith("data")) {
    window.alert("请在提交前上传一张图片");
    return;
  }

  // call the predict function of the backend
  predictImage(imagePreview.src);
}

function clearImage() {
  // reset selected files
  fileSelect.value = "";

  // remove image sources and hide them
  imagePreview.src = "";
  predResult.innerHTML = "";
  document.getElementById("img-result1").removeChild(imgResult1);
  document.getElementById("img-result2").removeChild(imgResult2);
  document.getElementById("img-result3").removeChild(imgResult3);

  hide(imagePreview);
  show(uploadCaption);
  checkStatus();
}

function previewFile(file) {
  // show the preview of the image
  console.log(file.name);
  var fileName = encodeURI(file.name);

  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    imagePreview.src = URL.createObjectURL(file);

    show(imagePreview);
    hide(uploadCaption);

    // reset
    predResult.innerHTML = "";

    displayImage(reader.result, "image-preview");
  };
}

//========================================================================
// Helper functions
//========================================================================

function predictImage(image) {
  fetch("https://ai.best360.tech/cbir/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(image)
  })
    .then(resp => {
      if (resp.ok)
        resp.json().then(data => {
          displayResult(data);
        });
    })
    .catch(err => {
      console.log("An error occured", err.message);
      window.alert("Oops! Something went wrong.");
    });
}

function displayImage(image, id) {
  // display image on given id <img> element
  let display = document.getElementById(id);
  display.src = image;
  show(display);
}

function displayResult(data) {
  // display the result
  predResult.innerHTML = data.result;
  //show(predResult);
  imgResult1 = new Image();
  imgResult1.src = data.link1;
  document.getElementById("img-result1").appendChild(imgResult1);

  imgResult2 = new Image();
  imgResult2.src = data.link2;
  document.getElementById("img-result2").appendChild(imgResult2);

  imgResult3 = new Image();
  imgResult3.src = data.link3;
  document.getElementById("img-result3").appendChild(imgResult3);
}

function hide(el) {
  // hide an element
  el.classList.add("hidden");
}

function show(el) {
  // show an element
  el.classList.remove("hidden");
}

//========================================================================
// Check AI server status
//========================================================================
checkStatus();

function checkStatus() {
  fetch("https://ai.best360.tech/", {method: "GET"})
  .then(resp => {
    if (resp.ok) {
      document.getElementById("server-status").innerHTML = "<span style='color: green;'>AI服务器状态正常</span>";
    } else {
      document.getElementById("server-status").innerHTML = "<span style='color: red;'>AI服务器已下线，请联系管理员</span>";
    }
  })
  .catch(err => {
    console.log("An error occured", err);
    document.getElementById("server-status").innerHTML = "<span style='color: red;'>AI服务器已下线，请联系管理员</span>";
  });
}
