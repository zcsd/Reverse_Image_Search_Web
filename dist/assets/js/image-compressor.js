!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.ImageCompressor=t():e.ImageCompressor=t()}(window,(function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var a=t[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(r,a,function(t){return e[t]}.bind(null,a));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);var r=window,a=/^image\//,i=/\.\w+$/,o={},s={file:null,quality:.8,convertSize:2048e3,loose:!0,redressOrientation:!0},f=function(e){return"function"==typeof e},c=function(e){return a.test(e)};function l(e){e=Object.assign({},s,e),this.options=e,this.file=e.file,this.image=null,this.ParsedOrientationInfo=null,this.init()}var u=l.prototype;for(var h in t.default=l,u.init=function(){var e=this,t=this.file,n=this.options;t&&c(t.type)?(c(n.mimeType)||(n.mimeType=t.type),o.file2Image(t,(function(r){f(e.beforeCompress)&&(e.image=r,t.width=r.naturalWidth,t.height=r.naturalHeight,e.beforeCompress(t)),"image/jpeg"===t.type&&n.redressOrientation?e.getParsedOrientationInfo((function(t){e.parsedOrientationInfo=t,e.rendCanvas()})):(e.parsedOrientationInfo={rotate:0,scaleX:1,scaleY:1},e.rendCanvas())}),e.error)):e.error("请上传图片文件!")},u.rendCanvas=function(){var e=this,t=this.options,n=this.image,r=this.getExpectedEdge(),a=r.dWidth,i=r.dHeight,s=r.width,f=r.height,c=o.image2Canvas(n,a,i,e.beforeDraw.bind(e),e.afterDraw.bind(e),s,f);o.canvas2Blob(c,(function(t){t&&(t.width=c.width,t.height=c.height),e.success(t)}),t.quality,t.mimeType)},u.beforeCompress=function(){f(this.options.beforeCompress)&&this.options.beforeCompress(this.file)},u.getExpectedEdge=function(){var e,t=this.image,n=this.parsedOrientationInfo.rotate,r=this.options,a=t.naturalWidth,i=t.naturalHeight,o=Math.abs(n)%180==90;o&&(e=i,i=a,a=e);var s=a/i,f=Math.max(r.maxWidth,0)||1/0,c=Math.max(r.maxHeight,0)||1/0,l=Math.max(r.minWidth,0)||0,u=Math.max(r.minHeight,0)||0,h=Math.max(r.width,0)||a,d=Math.max(r.height,0)||i;f<1/0&&c<1/0?c*s>f?c=f/s:f=c*s:f<1/0?c=f/s:c<1/0&&(f=c*s),l>0&&u>0?u*s>l?u=l/s:l=u*s:l>0?u=l/s:u>0&&(l=u*s),d*s>h?d=h/s:h=d*s;var g=h=Math.floor(Math.min(Math.max(h,l),f)),p=d=Math.floor(Math.min(Math.max(d,u),c));return o&&(e=p,p=g,g=e),{dWidth:g,dHeight:p,width:h,height:d}},u.getParsedOrientationInfo=function(e){var t=this;this.getOrientation((function(n){f(e)&&e(t.parseOrientation(n))}))},u.getOrientation=function(e){var t=this;o.file2ArrayBuffer(this.file,(function(n){f(e)&&e(t.resetAndGetOrientation(n))}))},u.resetAndGetOrientation=function(e){var t,n=new DataView(e);try{var r,a,i;if(255===n.getUint8(0)&&216===n.getUint8(1))for(var s=n.byteLength,f=2;f+1<s;){if(255===n.getUint8(f)&&225===n.getUint8(f+1)){a=f;break}f+=1}if(a){var c=a+4,l=a+10;if("Exif"===o.getStringFromCharCode(n,c,4)){var u=n.getUint16(l);if(((r=18761===u)||19789===u)&&42===n.getUint16(l+2,r)){var h=n.getUint32(l+4,r);h>=8&&(i=l+h)}}}if(i){var d;s=n.getUint16(i,r);for(d=0;d<s;d+=1)if(f=i+12*d+2,274===n.getUint16(f,r)){f+=8,t=n.getUint16(f,r),n.setUint16(f,1,r);break}}}catch(e){console.error(e),t=1}return t},u.parseOrientation=function(e){var t=0,n=1,r=1;switch(e){case 2:n=-1;break;case 3:t=-180;break;case 4:r=-1;break;case 5:t=90,r=-1;break;case 6:t=90;break;case 7:t=90,n=-1;break;case 8:t=-90}return{rotate:t,scaleX:n,scaleY:r}},u.beforeDraw=function(e,t){var n=this.parsedOrientationInfo,r=n.rotate,a=n.scaleX,i=n.scaleY,o=this.file,s=this.options,c="transparent",l=t.width,u=t.height;switch(o.size>s.convertSize&&"image/png"===s.mimeType&&(c="#fff",s.mimeType="image/jpeg"),e.fillStyle=c,e.fillRect(0,0,l,u),f(s.beforeDraw)&&s.beforeDraw.call(this,e,t),e.save(),r){case 90:e.translate(l,0);break;case-90:e.translate(0,u);break;case-180:e.translate(l,u)}e.rotate(r*Math.PI/180),e.scale(a,i)},u.afterDraw=function(e,t){var n=this.options;f(n.afterDraw)&&n.afterDraw.call(this,e,t)},u.error=function(e){var t=this.options;if(!f(t.error))throw new Error(e);t.error.call(this,e)},u.success=function(e){var t,n,r=this.options,a=this.file,o=this.image,s=this.getExpectedEdge(),l=o.naturalHeight,u=o.naturalWidth;if(e&&e.size)if(!r.loose&&e.size>a.size&&!(s.width>u||s.height>l))console.warn("当前设置的是非宽松模式，压缩结果大于源图片，输出源图片"),e=a;else{var h=new Date;e.lastModified=h.getTime(),e.lastModifiedDate=h,e.name=a.name,e.name&&e.type!==a.type&&(e.name=e.name.replace(i,(t=e.type,"jpeg"===(n=c(t)?t.substr(6):"")&&(n="jpg"),"."+n)))}else console.warn("图片压缩出了点意外，输出源图片"),e=a;f(r.success)&&r.success.call(this,e)},o.file2DataUrl=function(e,t,n){var r=new FileReader;r.onload=function(){t(r.result)},r.onerror=function(){f(n)&&n("读取文件失败！")},r.readAsDataURL(e)},o.file2ArrayBuffer=function(e,t,n){var r=new FileReader;r.onload=function(e){t(e.target.result)},r.onerror=function(){f(n)&&n("读取文件失败！")},r.readAsArrayBuffer(e)},o.getStringFromCharCode=function(e,t,n){var r,a="";for(n+=t,r=t;r<n;r+=1)a+=String.fromCharCode(e.getUint8(r));return a},o.file2Image=function(e,t,n){var a=new Image,i=r.URL||r.webkitURL;if(r.navigator&&/(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(r.navigator.userAgent)&&(a.crossOrigin="anonymous"),a.alt=e.name,a.onerror=function(){f(n)&&n("图片加载错误！")},i){var o=i.createObjectURL(e);a.onload=function(){t(a),i.revokeObjectURL(o)},a.src=o}else this.file2DataUrl(e,(function(e){a.onload=function(){t(a)},a.src=e}),n)},o.url2Image=function(e,t,n){var r=new Image;r.src=e,r.onload=function(){t(r)},r.onerror=function(){f(n)&&n("图片加载错误！")}},o.image2Canvas=function(e,t,n,r,a,i,o){var s=document.createElement("canvas"),c=s.getContext("2d");return s.width=i||e.naturalWidth,s.height=o||e.naturalHeight,f(r)&&r(c,s),c.save(),c.drawImage(e,0,0,t,n),c.restore(),f(a)&&a(c,s),s},o.canvas2DataUrl=function(e,t,n){return e.toDataURL(n||"image/jpeg",t)},o.dataUrl2Image=function(e,t,n){var r=new Image;r.onload=function(){t(r)},r.error=function(){f(n)&&n("图片加载错误！")},r.src=e},o.dataUrl2Blob=function(e,t){for(var n=e.split(",")[1],r=e.match(/^data:(.*?)(;base64)?,/)[1],a=atob(n),i=n.length,o=new Uint8Array(i),s=0;s<i;s++)o[s]=a.charCodeAt(s);return new Blob([o],{type:t||r})},o.blob2DataUrl=function(e,t,n){this.file2DataUrl(e,t,n)},o.blob2Image=function(e,t,n){this.file2Image(e,t,n)},o.canvas2Blob=function(e,t,n,r){var a=this;HTMLCanvasElement.prototype.toBlob||Object.defineProperty(HTMLCanvasElement.prototype,"toBlob",{value:function(e,t,n){var r=this.toDataURL(t,n);e(a.dataUrl2Blob(r))}}),e.toBlob((function(e){t(e)}),r||"image/jpeg",n||.8)},o.upload=function(e,t,n){var r=new XMLHttpRequest,a=new FormData;a.append("file",t),r.onreadystatechange=function(){if(4!==r.readyState||200!==r.status)throw new Error(r);n&&n(r.responseText)},r.open("POST",e,!0),r.send(a)},o)o.hasOwnProperty(h)&&(l[h]=o[h])}]).default}));