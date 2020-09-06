const axios = require('axios');

//GLOBALS
let blob, imageType;
const loader = document.querySelector('.loader');
const formData = document.querySelector('.form');
const uploadButton = document.querySelector('.button');
const percentHandler = document.querySelector('.percent');
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      const image = document.querySelector('.image-container');
      const imageTag = document.createElement('img');

      image.appendChild(imageTag);
      imageTag.setAttribute('src', e.target.result);
      imageTag.setAttribute('class', 'image');

      //drawCanvasImage(imageTag, input.files[0].type);
    };
    imageType = input.files[0].type;
    blob = new Blob([input.files[0]], { type: input.files[0].type });
    reader.readAsDataURL(input.files[0]);
  }
}
// const getBase64 = (file) =>
//   new Promise(function (resolve) {
//     let reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//   });

uploadButton.addEventListener('click', () => {
  if (blob) {
    // getBase64(blob).then((res) => {
    //const blobData = res.split(',')[1];
    // let size = Math.round(blob.size * 1.4);
    const file = new FormData();
    file.append(
      'blob',
      blob,
      `${new Date().getTime()}.${imageType.split('/')[1]}`
    );
    axios({
      method: 'post',
      url: 'http://localhost:4000/upload',
      header: { 'Content-Type': 'multipart/form-data' },
      data: file,
      onUploadProgress: (e) => {
        const percent = Math.round(
          e.lengthComputable ? (e.loaded / e.total) * 100 : 0
        );
        loader.innerHTML = '';
        loader.textContent = `${percent}%`;
        percentHandler.style.width = `${percent}%`;
      },
    });
    // });
  }
});

formData.addEventListener('change', (e) => {
  readURL(e.target);
});

// function drawCanvasImage(imageObj, type) {
//   const canvas = document.createElement('canvas');
//   const context = canvas.getContext('2d');
//   imageObj.onload = function () {
//     let imgWidth = imageObj.naturalWidth;
//     let screenWidth = canvas.width;
//     let scaleX = 1;
//     if (imgWidth > screenWidth) scaleX = screenWidth / imgWidth;
//     let imgHeight = imageObj.naturalHeight;
//     let screenHeight = canvas.height;
//     let scaleY = 1;
//     if (imgHeight > screenHeight) scaleY = screenHeight / imgHeight;
//     let scale = scaleY;
//     if (scaleX < scaleY) scale = scaleX;
//     if (scale < 1) {
//       imgHeight = imgHeight * scale;
//       imgWidth = imgWidth * scale;
//     }

//     canvas.height = imgHeight;
//     canvas.width = imgWidth;

//     context.drawImage(
//       imageObj,
//       0,
//       0,
//       imageObj.naturalWidth,
//       imageObj.naturalHeight,
//       0,
//       0,
//       imgWidth,
//       imgHeight
//     );

//     canvas.toBlob(
//       (blobObject) => {
//         blob = blobObject;
//         imageType = type.split('/')[1];
//       },
//       type,
//       1
//     );
//   };
// }
