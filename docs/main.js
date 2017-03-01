(function($){
	//画像関連
	var img;
	var img2;
	var stage;

	//画像ロード
	function loadImage (imageData){
		//画像のロード
		var baseImg = new Image();
		baseImg.src = $('#logourl').val();
		img = new createjs.Bitmap(baseImg);

		//画像が選択されている時のみ合成
		if(imageData !== null) {
			var baseImg2 = new Image();
			baseImg2.src = imageData;
			img2 = new createjs.Bitmap(baseImg2);
			$("#result").attr({
				'width': baseImg2.width,
				'height': baseImg2.height
			});
		}

		stage = new createjs.Stage('result');
	}

	//ロゴと文字を合成する処理
	function genImage (imageIni){
		//合成画像の設定
		//上下は10ピクセルごと移動
		img.x = imageIni.xPos * 10;
		img.y = imageIni.yPos * 10;
		//拡縮は10％ずつ
		img.scaleX = img.scaleX * (1 + imageIni.Scale / 10);
		img.scaleY = img.scaleY * (1 + imageIni.Scale / 10);

		//ステージ生成
		stage.addChild(img2);
		stage.addChild(img);

		//ステージ反映
		stage.update();
	}

	$(function(){
		//設定のデフォルト値
		$('#logourl').val('https://pbs.twimg.com/media/C2CtwVgUsAAaz86.png');

		$('#logourl').keyup(function() {
			$.ajax({
				url: $('#logourl').val()
			}).done(function(data){
				var baseImg = new Image();
				baseImg.src = $('#logourl').val();
				img = new createjs.Bitmap(baseImg);
				$("#alert").text("");
			}).fail(function(data){
				$("#alert").text("ロゴのURLが間違っています。ヒント：httpsから始まるURLにしてください。");
			});
		});

		//読込画像のオブジェクト
		var imageIni = {
			xPos : 2,
			yPos : 2,
			Scale : -5,
			imageData : null,
			resetImage : function(){
				this.xPos = 2;
				this.yPos = 2;
				this.Scale = -5;
			},
			makeImage : function(){
				if(this.imageData !== null) {
					loadImage(this.imageData);
					genImage(this);
				}
			}
		};

		//イベント関連処理
		//初回のみCanvasを作成しておく
		$(window).on('load',function(){
			loadImage(null);
		});

		//画像読込
		$('#getfile').change(function (){
			//読み込み
			var fileList =$('#getfile').prop('files');
			var reader = new FileReader();
			reader.readAsDataURL(fileList[0]);

			//読み込み後
			$(reader).on('load',function(){
				$('#preview').prop('src',reader.result);
				imageIni.imageData = reader.result;
			});
		});


		//ボタンイベントまとめ
		$('.btn').on('click',function(e){
			if (e.target.id === "update"){
			}else if (e.target.id === "up"){
				imageIni.yPos -= 1;
			}else if (e.target.id === "down"){
				imageIni.yPos += 1;
			}else if (e.target.id === "left"){
				imageIni.xPos -= 1;
			}else if (e.target.id === "right") {
				imageIni.xPos += 1;
			}else if (e.target.id === "zoomin") {
				imageIni.Scale += 1;
			}else if (e.target.id === "zoomout") {
				imageIni.Scale -= 1;
			}else if (e.target.id === "reset"){
				imageIni.resetImage();
			}else if (e.target.id === "dl"){
				return;
			}

			//画像操作時は再描画を行う
			if(imageIni.imageData !== null){
				imageIni.makeImage();
			}else{
				$("#alert").text("スクリーンショットを入力してから画像生成を行ってください");
			}
		});
	});
})($);
