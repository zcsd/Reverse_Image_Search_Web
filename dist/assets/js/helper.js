//========================================================================
// Language Setup
//========================================================================

var language = navigator.language || navigator.userLanguage

language = language.substr(0, 2);

if (language != "zh") {
    language = "en";
}

displayText = {
  "zh": {title: "以图搜图(功能展示)",
         statusCheck: "正在检查AI服务器状态...",
         uploadCaption: "拖拽图片到这里或者点击选择",
         submitButton: "提交",
         clearButton: "清除",
         keyInput: "请输入密钥",
         imageUploadAlert: "请在提交前上传一张图片",
         keyInputAlert: "请在提交前输入密钥",
         keyLengthAlert: "密钥长度不能超过10个字符",
         serverStatusOK: "AI服务器状态正常",
         serverStatusError: "AI服务器已下线, 请联系管理员",
         fetchError: "服务器错误，请再次尝试或联系管理员",
         embeddingTime: "特征提取时间: ",
         searchTime: "搜索时间: ",
        },
  "en": {title: "Image Search (Demo)",
         statusCheck: "Checking AI Server Status...",
         uploadCaption: "Drag image here or click to select",
         submitButton: "Submit",
         clearButton: "Clear",
         keyInput: "Enter Key",
         imageUploadAlert: "Please upload an image before submitting",
         keyInputAlert: "Please enter a key before submitting",
         keyLengthAlert: "Key length cannot exceed 10 characters",
         serverStatusOK: "AI Server Status OK",
         serverStatusError: "AI Server is offline, please contact administrator",
         fetchError: "Server error, please try again or contact administrator",
         embeddingTime: "Embedding Time: ",
         searchTime: "Search Time: ",
        },
}

document.getElementById("title").innerHTML = displayText[language].title;
document.getElementById("status-check").innerHTML = displayText[language].statusCheck;
document.getElementById("upload-caption").innerHTML = displayText[language].uploadCaption;
document.getElementById("submit-button").value = displayText[language].submitButton;
document.getElementById("clear-button").value = displayText[language].clearButton;
document.getElementById("key-input").placeholder = displayText[language].keyInput;

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

var keyInput = document.getElementById("key-input");
var imageInput = document.getElementById("image-input");
var uploadCaption = document.getElementById("upload-caption");
var textResult = document.getElementById("text-result");
var imageOutput1 = document.getElementById("image-output1");
var imageOutput2 = document.getElementById("image-output2");
var imageOutput3 = document.getElementById("image-output3");
var imageOutput4 = document.getElementById("image-output4");
var imageOutput5 = document.getElementById("image-output5");

//========================================================================
// Main button events
//========================================================================

function submitImage() {
  // action for the submit button

  if (!imageInput.src || !imageInput.src.startsWith("data")) {
    window.alert(displayText[language].imageUploadAlert);
    return;
  }

  if (!keyInput.value) {
    window.alert(displayText[language].keyInputAlert);
    return;
  } 

  if (keyInput.value.length > 10) {
    keyInput.value = "";
    window.alert(displayText[language].keyLengthAlert);
    return;
  }
  // call the retrieve function of the backend
  retrieveImage(imageInput.src);
  fetch("/api/abc", {method: 'GET'});
}

function clearImage() {
  // reset selected files
  fileSelect.value = "";

  // remove image sources and hide them
  imageInput.src = "";
  textResult.innerHTML = "";
  imageOutput1.src = "";
  imageOutput2.src = "";
  imageOutput3.src = "";
  imageOutput4.src = "";
  imageOutput5.src = "";

  hide(imageInput);
  hide(imageOutput1);
  hide(imageOutput2);
  hide(imageOutput3);
  hide(imageOutput4);
  hide(imageOutput5);
  show(uploadCaption);
}

function previewFile(file) {
  // show the preview of the image
  //console.log(file.name);
  //var fileName = encodeURI(file.name);
  compressImage(file);
}

//========================================================================
// Helper functions
//========================================================================

function retrieveImage(image) {
  fetch(baseURL+"cbir/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({"key": keyInput.value, "image": image})
  })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        displayResult(data);
      } else {
        textResult.innerHTML = data.result;
        keyInput.value = "";
      }
    })
      .catch(err => {
        console.log("An error occured", err.message);
        window.alert(displayText[language].fetchError);
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
  textResult.innerHTML = displayText[language].embeddingTime + data.embedding_time + "ms   " + displayText[language].searchTime + data.search_time + "ms";

  show(imageOutput1);
  show(imageOutput2);
  show(imageOutput3);
  show(imageOutput4);
  show(imageOutput5);

  imageOutput1.src = data.image1;
  imageOutput2.src = data.image2;
  imageOutput3.src = data.image3;
  imageOutput4.src = data.image4;
  imageOutput5.src = data.image5;
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
var baseURL = "";

checkServer();

function checkServer(){
  if (document.getElementById("server").value == "server_wo_gpu") {
      baseURL = "https://ai-hk.best360.tech/"; // gcp hk withoug gpu //
  } else if (document.getElementById("server").value == "server_w_gpu") {
      baseURL = "https://ai-ly.best360.tech/"; // ly sg with gpu
  } else if (document.getElementById("server").value == "dev_server") {
      baseURL = "https://ai-zz.best360.tech/"; // my dev server
  }
  clearImage();
  document.getElementById("server-status").innerHTML = "<span style='color: green;'>" + displayText[language].statusCheck + "</span>";
  checkServerStatus();
}

function checkServerStatus() {
  fetch(baseURL, {method: "GET"})
  .then(response => response.json())
  .then(data => {
    if (data.ok) {
      document.getElementById("server-status").innerHTML = "<span style='color: #fcda5e;'>" + displayText[language].serverStatusOK + "<br>CPU: "
       + data.cpu + "<br>RAM: " + data.memory + "<br>GPU: " + data.gpu + "<br>Number of Images: " +  data.entities_num + "</span>";
    } else {
      document.getElementById("server-status").innerHTML = "<span style='color: red;'>" + displayText[language].serverStatusError + "</span>";
    }
  })
  .catch(err => {
    console.log("An error occured", err);
    document.getElementById("server-status").innerHTML = "<span style='color: red;'>" + displayText[language].serverStatusError + "</span>";
  });
}

//========================================================================
// Compress input image
//========================================================================

function compressImage (file) {
  var options = {
    file: file,
    quality: 0.6,
    mimeType: 'image/jpeg',
    maxWidth: 600,
    maxHeight: 600,
    width: this.width,
    height: this.height,
    minWidth: 100,
    minHeight: 100,
    convertSize: this.convertSize,
    loose: this.loose,
    redressOrientation: this.redressOrientation,

    beforeCompress: function (result) {
      //console.log('Original file size:', (result.size/1024).toFixed(1), 'KB');
    },

    success: function (result) {
      //console.log('Compressed file size:', (result.size/1024).toFixed(1), 'KB');
      //console.log('Compress ratio： ', ((file.size - result.size) / file.size * 100).toFixed(2) + '%');
      var reader = new FileReader();
      reader.readAsDataURL(result);
      reader.onloadend = () => {
        imageInput.src = URL.createObjectURL(result);
        
        show(imageInput);
        hide(uploadCaption);
    
        // reset
        textResult.innerHTML = "";
    
        displayImage(reader.result, "image-input");
      };
    },

    error: function (msg) {
      console.error(msg);
    }
  };

  new ImageCompressor(options);
}
