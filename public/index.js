const axios = require('axios');

//GLOBALS
let blob,
  fileType,
  isUploading = false;
const loader = document.querySelector('.loader');
const formData = document.querySelector('.form');
const uploadButton = document.querySelector('.button');
const percentHandler = document.querySelector('.percent');

const imageContainer = document.querySelector('.image-container');
const image = document.createElement('img');

const newButton = document.querySelector('.new-button');
const inputForm = document.getElementById('input');
const fileText = document.createElement('h2');

const notification = document.querySelector('.notification');
const notificationText = document.querySelector('.notification-text');
const notificationTextPar = document.querySelector('.notification-text-par');
const notificationIcon = document.querySelector('.notification-correct');

newButton.addEventListener('click', (_) => {
  inputForm.click();
});

function readURL(input) {
  const filePlaceholder = document.querySelector('.image-placeholder');
  if (input.files && input.files[0]) {
    const type = input.files[0].type;
    var reader = new FileReader();
    reader.onload = function (e) {
      if (isImage(type.split('/')[1])) {
        document.createElement('h2').innerHTML = '';
        filePlaceholder.style.display = 'none';
        imageContainer.appendChild(image);
        image.setAttribute('src', e.target.result);
        image.setAttribute('class', 'image');
      } else {
        imageContainer.innerHTML = '';
        fileText.textContent = type ? type : 'File extention not found';
        imageContainer.appendChild(filePlaceholder);
        imageContainer.appendChild(fileText);
        imageContainer.appendChild(notification);
        filePlaceholder.style.display = 'block';
      }
    };
    fileType = type;
    blob = new Blob([input.files[0]], { type: input.files[0].type });
    reader.readAsDataURL(input.files[0]);
  }
}

uploadButton.addEventListener('click', () => {
  if (!isUploading) {
    if (blob) {
      const file = new FormData();
      file.append(
        'blob',
        blob,
        `${new Date().getTime()}.${fileType.split('/')[1]}`
      );
      axios({
        method: 'post',
        url: 'http://localhost:4000/upload',
        header: { 'Content-Type': 'multipart/form-data' },
        data: file,
        onUploadProgress: (e) => {
          isUploading = true;
          const percent = Math.round(
            e.lengthComputable ? (e.loaded / e.total) * 100 : 0
          );
          loader.innerHTML = '';
          loader.textContent = `${percent}%`;
          percentHandler.style.width = `${percent}%`;
          if (percent > 0) {
            isUploading = true;
          }
          if (percent >= 100) {
            isUploading = false;
          }
        },
      })
        .then((res) => {
          notification.style.height = '3rem';
          notificationTextPar.textContent = res.data.message;
          notificationText.style.visibility = 'visible';
          notificationIcon.style.visibility = 'visible';

          setTimeout(() => {
            notification.style.height = '0';
            notificationText.style.visibility = 'hidden';
            notificationIcon.style.visibility = 'hidden';
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
});

formData.addEventListener('change', (e) => {
  readURL(e.target);
  //THIS IS WHERE I SHOULD WORK
  percentHandler.style.width = 0;
  loader.innerHTML = '';
});

//ImageFormat
// eslint-disable-next-line complexity
function isImage(fType) {
  if (
    fType === 'jpeg' ||
    fType === 'png' ||
    fType === 'svg+xml' ||
    fType === 'giff' ||
    fType === 'bmp' ||
    fType === 'apng' ||
    fType === 'webp' ||
    fType === 'tiff' ||
    fType === 'x-icon'
  ) {
    return true;
  }
}
