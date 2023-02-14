export const fetchFavicon = (url, size) => {
  return new Promise(function (resolve, reject) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(this, 0, 0);

      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.src = `chrome://favicon2/?size=${
      size || 16
    }&scaleFactor=1x&pageUrl=${url}&allowGoogleServerFallback=0`;
  });
};
