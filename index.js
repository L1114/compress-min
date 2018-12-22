function compress (file, obj) {
  // console.log ('file :', file);
  return new Promise ((resolve, reject) => {
    try {
      let params = Object.assign (
        {
          width: 0,
          height: 0,
          quality: 0,
        },
        obj
      );
      let resolveObj = {
        compress: {
          base64: undefined,
          formData: new FormData (),
        },
        origin: {
          file: file,
          formData: new FormData (),
        },
      },
        img = new Image ();
      let url = window.URL || window.webkitURL;
      img.src = url.createObjectURL (file);
      // 缩放图片需要的canvas
      var canvas = document.createElement ('canvas');
      var context = canvas.getContext ('2d');
      img.onload = function () {
        let scale = this.width / this.height;
        let width = this.width, height = this.height;
        if (params.width && params.height) {
          width = params.width;
          height = params.height;
        } else if (params.width && !params.height) {
          width = params.width;
          height = width / scale;
        } else if (!params.width && params.height) {
          height = params.height;
          width = height * scale;
        } else if (params.quality) {
          let quality=Math.min(1,Math.abs(params.quality))
          width = this.width*quality;
          height = this.height*quality;
        }
        resolveObj.compress.width = width;
        resolveObj.origin.width = this.width;
        resolveObj.compress.height = height;
        resolveObj.origin.height = this.height;
        canvas.width = width;
        canvas.height = height;
        context.clearRect (0, 0, width, height);
        context.drawImage (img, 0, 0, width, height);
        canvas.toBlob (function (blob) {
          resolveObj.compress.file = blob;
          resolveObj.compress.formData.append ('file', blob);
          resolveObj.origin.file = file;
          resolveObj.origin.formData.append ('file', file);
          let freader = new FileReader ();
          freader.onload = function (e) {
            resolveObj.compress.base64 = e.target.result;
            
          };
          freader.readAsDataURL (blob);
        }, file.type||'image/jpeg');
      };
      setTimeout (() => {
        resolve (resolveObj);
      }, 100);
    } catch (error) {
      reject (error);
    }
    // //图片转base64
    // let freader = new FileReader ();
    // freader.onload = function (e) {
    //   // resolveObj.base64 = e.target.result;
    //   console.log ('e.target.result---:', e.target.result.length);
    // };
    // freader.readAsDataURL (file);
  });
}
// window.compress=compress
module.exports = compress;
