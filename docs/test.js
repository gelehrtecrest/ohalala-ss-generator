var $canvas = document.getElementById("canvas"), //Canvas要素の取得
    $ctx = $canvas.getContext("2d"), //canvasのコンテキストの設定
    $img = new Image(); //イメージオブジェクトの呼び出し
$img.src = "https://pbs.twimg.com/media/DQF_by-V4AAY5w1.jpg"; //イメージオブジェクトに画像を読み込み
$img.onload = function() {
  $ctx.drawImage($img, 0, 0); //Canvasに読み込んだ画像を表示
  var $originalImageData = $ctx.getImageData(0, 0, 320, 320), //オリジナルの画像DATAを確保
      $transmittedImageData = $ctx.getImageData(0, 0, 320, 320), //透過用の画像DATAを確保
      $originalData = $originalImageData.data, //オリジナルのdataを保存する場所
      $transmittedData = $transmittedImageData.data, //透過用のdataを保存する場所
      isClicked = false; //クリックのトグルのためのフラグを準備
  //透過用のdataを作成
  for(var i = 0; i < $transmittedData.length; i += 4){
    //各カラーチャンネルで、一番暗い値を取得
    var minLuminance = 255;
    if($transmittedData[i] < minLuminance)
      minLuminance = $transmittedData[i];
    if($transmittedData[i + 1] < minLuminance)
      minLuminance = $transmittedData[i + 1];
    if($transmittedData[i + 2] < minLuminance)
      minLuminance = $transmittedData[i + 2];
 
    //一番暗い値を、アルファチャンネルに反映(明るいところほど透明に)
    $transmittedData[i + 3] = 255 - minLuminance;
  }
  //クリックしたときに、トグルでオリジナル画像と透過画像を切り替え
  $canvas.addEventListener("click", function() {
    if(isClicked) {
      //オリジナル画像をCanvasに表示
      $originalImageData.data.set($originalData);
      $ctx.putImageData($originalImageData,0,0);
      isClicked = false;
    } else {
      //透過画像をCanvasに表示
      $transmittedImageData.data.set($transmittedData);
      $ctx.putImageData($transmittedImageData,0,0);
      isClicked = true;
    }
  });
}
