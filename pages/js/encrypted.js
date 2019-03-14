var base64Key = "DpiA4l0gvb7biWZtiN6Vjg==";
var key = CryptoJS.enc.Base64.parse(base64Key);

var aesOptions = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
};

var encryptedFilename = "https://dl.dropboxusercontent.com/u/30823828/myFile_encrypted.txt";

var oReq = new XMLHttpRequest();
oReq.open("GET", encryptedFilename, true);
oReq.responseType = "arraybuffer";

oReq.onload = function (oEvent) {
   var data = oReq.response;
   if (data) {
      encodedData = base64ArrayBuffer(data);
      var decryptedData = CryptoJS.AES.decrypt( encodedData, key, aesOptions);
      var decryptedText = decryptedData.toString( CryptoJS.enc.Utf8 );
      console.log( "decryptedText = " + decryptedText );
      console.log("file decrypt successful: ", "A string in a file" === decryptedText);
   }
};

oReq.send(null);
