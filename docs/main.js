(function($){
	//フラグ関係
	var flag_b = true;

	//画像関連
	var img;
	var img2;
	var stage;

	//画像ロード
	function loadImage (imageData, logoImageData){
		//画像のロード
		//ローカル
		if($('input[name=logo]:checked').val() === 'local'){
			$('#alert').text('ローカルファイルです');
			if(logoImageData !== null) {
				var baseImg = new Image();
				var canvas = document.getElementById('canvas');
				$('#alert').text('キャンバスに書き込んでいます');
				baseImg.src = logoImageData;
				$('#alert').text('URL化しています');
				img = new createjs.Bitmap(baseImg);
				$('#alert').text('Bitmap化しました');
			} else {
				img = null;
			}
		} else if($('input[name=logo]:checked').val() === 'local_white'){
			$('#alert').text('ローカルファイルです');
			if(logoImageData !== null) {
				var baseImg = new Image();
				var canvas = document.getElementById('canvas');
				$('#alert').text('キャンバスに書き込んでいます');
				baseImg.src = canvas.toDataURL();
				$('#alert').text('URL化しています');
				img = new createjs.Bitmap(baseImg);
				$('#alert').text('Bitmap化しました');
			} else {
				img = null;
			}
		} else { // URL
			var baseImg = new Image();
			baseImg.src = $('#logourl').val()
			img = new createjs.Bitmap(baseImg);
		}

		//画像が選択されている時のみ合成
		if(imageData !== null) {
			var baseImg2 = new Image();
			baseImg2.src = imageData;
			img2 = new createjs.Bitmap(baseImg2);
			$('#result').attr({
				'width': baseImg2.width,
				'height': baseImg2.height
			});
		}

		stage = new createjs.Stage('result');
	}

	//ロゴを合成する処理
	function genImage (imageIni){
		$('#alert').text('合成作業開始です ステップ 1');
		//合成画像の設定
		//回転
		img.rotation = imageIni.rotation;
		//回転の中心は、画像の中央
		img.regX = img.getBounds().width / 2;
		img.regY = img.getBounds().height / 2;
		$('#alert').text('合成作業開始です ステップ 2');
	
		//上下は10ピクセルごと移動
		// 中央点からの補正
		//拡縮は10％ずつと過程 = いずれ定数化する必要がある
		img.x = imageIni.xPos * 10 + img.getBounds().width / 2 * (1 + imageIni.Scale / 10);
		img.y = imageIni.yPos * 10 + img.getBounds().height / 2 * (1 + imageIni.Scale / 10);
		$('#alert').text('合成作業開始です ステップ 3');

		//拡縮は10％ずつ
		img.scaleX = img.scaleX * (1 + imageIni.Scale / 10);
		img.scaleY = img.scaleY * (1 + imageIni.Scale / 10);
		$('#alert').text('合成作業開始です ステップ 4');


		//透明化
		img.alpha = imageIni.alpha;	
		$('#alert').text('合成作業開始です ステップ 5');


		//ステージ生成
		stage.addChild(img2);
		stage.addChild(img);
		$('#alert').text('合成作業開始です ステップ 6');


		//ステージ反映
		stage.update();
		$('#alert').text('合成作業開始です ステップ 7');
	}

	$(function(){
		var userAgent = window.navigator.userAgent.toLowerCase();
		console.log(userAgent);
		// IEとEdge判定
		if(userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1)  {
			flag_b = false;
		} else if(userAgent.indexOf('edge') != -1) {
			flag_b = false;
		} else {
			flag_b = true;
			
		}

		// logourlが使えない場合、UIを一部隠す
		//if(!flag_b){
		//	$("#no_ie_edge").hide();
		//}

		//設定のデフォルト値
		//if(flag_b){
			$('#logourl').val('./default.png');
			loadlogocanvas('./default.png', false);
		//}
	
		//ロゴURL変更時の処理
		$(document).on('input', '#logourl', function() {
			$.ajax({
				url: $('#logourl').val()
			}).done(function(data){
				var baseImg = new Image();
				baseImg.src = $('#logourl').val();
				img = new createjs.Bitmap(baseImg);
				$('#alert').text('');
				//URL再生成
				write_settingurl(imageIni);
				loadlogocanvas($('#logourl').val(), false);
			}).fail(function(data){
				$('#alert').text('ロゴのURLが間違っています。ヒント：httpsから始まるURLにしてください。');
			});
		});

		//読込画像のオブジェクト
		var imageIni = {
			xPos : 2,
			yPos : 2,
			Scale : -2,
			rotation : 0,
			alpha : 1.0,
			imageData : null,
			logoImageData : null,
			resetImage : function(){
				this.xPos = 2;
				this.yPos = 2;
				this.Scale = -5;
				this.rotation = 0;
				this.alpha = 1.0;
			},
			makeImage : function(){
				if(this.imageData !== null) {
					$('#alert').text('合成画像読み込み中です。');
					loadImage(this.imageData, this.logoImageData);
					$('#alert').text('合成画像 合成中です。');
					genImage(this);
				}
			}
		};

		//get情報
		var url = location.href;
		var parameters = url.split('?');
		var queries = (parameters[1] || 'dummy=dummy').split('&');
		i = 0;

		for(i; i < queries.length; i ++) {
			var t = queries[i].split('=');
			if(t['0'] == 'logourl'){
				$('#logourl').val(decodeURIComponent(t['1']));
			} else if(t['0'] == 'xpos'){
				imageIni.xPos = parseFloat(t['1']);
			} else if(t['0'] == 'ypos'){
				imageIni.yPos = parseFloat(t['1']);
			} else if(t['0'] == 'scale'){
				imageIni.Scale = parseFloat(t['1']);
			} else if(t['0'] == 'rotation'){
				imageIni.rotation = parseFloat(t['1']);
			} else if(t['0'] == 'alpha'){
				imageIni.alpha = parseFloat(t['1']);
			} else if(t['0'] == 'logo'){
				if(t['1'] == 'local'){
					$('input[name=logo]').val(['local']);
				}
				if(t['1'] == 'local_white'){
					$('input[name=logo]').val(['local_white']);
				}
			} else if(t['0'] == 'title'){
				$('title').text(decodeURIComponent(t['1']));
				$('h1').text(decodeURIComponent(t['1']));
			} else if(t['0'] == 'comment'){
				$('#comment').text(decodeURIComponent(t['1']));
			}
		}

		//イベント関連処理
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

		//ロゴ画像読込
		$('#logogetfile').change(function (){
			//読み込み
			var fileList =$('#logogetfile').prop('files');
			var reader = new FileReader();
			reader.readAsDataURL(fileList[0]);
			//読み込み後
			$(reader).on('load',function(){
				imageIni.logoImageData = reader.result;
				loadlogocanvas(reader.result, false);
			});
		});

		//ロゴ画像読込(白抜き)
		$('#logogetfilealpha').change(function (){
			//読み込み
			var fileList =$('#logogetfilealpha').prop('files');
			var reader = new FileReader();
			reader.readAsDataURL(fileList[0]);
			//読み込み後
			$(reader).on('load',function(){
				imageIni.logoImageData = reader.result;
				loadlogocanvas(reader.result, true);
			});
		});

		function loadlogocanvas(url, flag){
			var image = new Image();
			image.onload = function() {
				$('#canvas').attr({
					'width': image.width,
					'height': image.height
				});
				var canvas = document.getElementById('canvas');
				var context = canvas.getContext('2d');
 				context.drawImage(image, 0, 0);
				var imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
				var data = imageData.data;
				for (var i = 0; i < data.length; i += 4) {
					//各カラーチャンネルで、一番暗い値を取得
					var minLuminance = 255;
					if(data[i] < minLuminance)
						minLuminance = data[i];
					if(data[i + 1] < minLuminance)
						minLuminance = data[i + 1];
					if(data[i + 2] < minLuminance)
						minLuminance = data[i + 2];

					if(flag){
						//一番暗い値を、アルファチャンネルに反映(明るいところほど透明に)
						data[i + 3] = 255 - minLuminance;
					}
				}
				context.putImageData(imageData, 0, 0);
			};
			image.src = url;
		}

		//ボタンイベントまとめ
		var editgenerator_button = "";
		var flag = 0;
		function editgenerator(id){
			if(flag == 0){
				flag = 1;
				return;
			} else {
				flag = 0;
			}
			if (id === 'update'){
			}else if (id === 'up'){
				imageIni.yPos -= 1;
			}else if (id === 'down'){
				imageIni.yPos += 1;
			}else if (id === 'left'){
				imageIni.xPos -= 1;
			}else if (id === 'right') {
				imageIni.xPos += 1;
			}else if (id === 'zoomin') {
				imageIni.Scale += 1;
			}else if (id === 'zoomout') {
				imageIni.Scale -= 1;
			}else if (id === 'rotation_r') {
				imageIni.rotation += 7.5;
			}else if (id === 'rotation_l') {
				imageIni.rotation -= 7.5;
			}else if (id === 'alpha_up') {
				imageIni.alpha += 0.1;
				if(imageIni.alpha >= 0.9){
					imageIni.alpha = 1.0;
					$('#alpha_up').prop("disabled", true);
				}
				$('#alpha_down').prop("disabled", false);
			}else if (id === 'alpha_down') {
				imageIni.alpha -= 0.1;
				if(imageIni.alpha <= 0.1){
					imageIni.alpha = 0.0;
					$('#alpha_down').prop("disabled", true);
				}
				$('#alpha_up').prop("disabled", false);
			}else if (id === 'reset'){
				imageIni.resetImage();
				$('#alpha_up').prop("disabled", true);
				$('#alpha_down').prop("disabled", false);
			}else if (id === 'dl'){
				return;
			}

			//画像操作時は再描画を行う
			if(imageIni.imageData !== null){
				$('#alert').text('合成作業開始中です。');
				imageIni.makeImage();
				$('#alert').text('合成完了です！');
			}else{
				$('#alert').text('スクリーンショットを入力してから画像生成を行ってください');
			}

			//画面操作時はURLを再生成する
			write_settingurl(imageIni);
		}
		//$('.btn').on('click', function(e){
		//	editgenerator_button = e.target.id;
		//	editgenerator(editgenerator_button);
		//});

		var pushing_flag = 0;
		var mouse_push_hold = function(){
			editgenerator(editgenerator_button);
			if( pushing_flag == 1 ){
				setTimeout(mouse_push_hold, 100);
			}
		};

		// PC用
		$(".editgenerator").mousedown(function(e){
			editgenerator_button = e.target.id;
			pushing_flag = 1;
			setTimeout(mouse_push_hold, 1);
			return false;
		}).mouseup(function(){
			pushing_flag = 0;
			clearTimeout(mouse_push_hold);
		}).mouseleave(function(){
			pushing_flag = 0;
			clearTimeout(mouse_push_hold);
		}).mouseover(function(){
			pushing_flag = 0;
			clearTimeout(mouse_push_hold);
		});

		//スマホ用
		$(".editgenerator").bind('touchstart', function(e){
			editgenerator_button = e.target.id;
			pushing_flag = 1;
			setTimeout(mouse_push_hold, 1);
			return false;
		});
		$(".editgenerator").bind('touchend', function(e){
			pushing_flag = 0;
			return false;
		});




		$('input[name=logo]').click(function() {
			//チェックボックス操作時は再描画を行う
			if(imageIni.imageData !== null){
				imageIni.makeImage();
			}else{
				$('#alert').text('スクリーンショットを入力してから画像生成を行ってください');
			}

			//チェックボックス操作時はURLを再生成する
			write_settingurl(imageIni);
		});

		//初回URL生成
		write_settingurl(imageIni);

		//Canvas Download
		$('#btnDownload').on("click", function() {
			$('#alert').text('ダウンロード ボタンクリック');
			//if($('input[name=logo]:checked').val() === 'local'){
				DownloadStart();
			//} else if($('input[name=logo]:checked').val() === 'local_white'){
			//	DownloadStart();
			//} else {
			//	alert('ロゴがURL指定のため、ダウンロードボタンは使用できません。')
			//}
			$('#alert').text('ダウンロード処理終了');
		});
		$('#btnNewWindow').on("click", function() {
			NewWindow();
		});
	});

	//画像先読み込み
	$(window).on('load',function(){
		//画像のロード
		var baseImg = new Image();
		baseImg.src = $('#logourl').val();
		img = new createjs.Bitmap(baseImg);

		loadImage(null, null);
	});

	// URL生成
	function geturl(imageIni) {
		var url;
		var baseurl = location.href.split('?')[0];
		url = baseurl;

		//設定をgetに追加
		//ロゴURL
		url = url + '?logourl=' + encodeURIComponent($('#logourl').val());
		//ロゴ位置・サイズ
		url = url + '&xpos=' + imageIni.xPos;
		url = url + '&ypos=' + imageIni.yPos;
		url = url + '&scale=' + imageIni.Scale;
		//ロゴ回転
		url = url + '&rotation=' + imageIni.rotation;
		//ロゴ透過
		url = url + '&alpha=' + imageIni.alpha;
		//ロゴ読み出し場所
		if($('input[name=logo]:checked').val() === 'local'){
			url = url + '&logo=local';
		}
		if($('input[name=logo]:checked').val() === 'local_white'){
			url = url + '&logo=local_white';
		}
		//タイトル
		url = url + '&title=' + encodeURIComponent($('title').text());
		//コメント
		url = url + '&comment=' + encodeURIComponent($('#comment').text());
		return url;
	}

	// URL書き込み
	function write_settingurl(imageIni) {
		var url = geturl(imageIni);
		$('#settingurl a').text(url);
		$('#settingurl a').attr('href', url);
	}

})($);

function DownloadStart(){
	
	var cve = document.getElementById("result");
	if (cve.getContext) {
		// ダウンロード ファイル名
		var now = new Date();
		var year = now.getYear();
		var month = now.getMonth() + 1;
		var day = now.getDate();
		var hour = now.getHours();
		var min = now.getMinutes();
		var sec = now.getSeconds();

		var filename = 'download_' + year + month + day + hour + min + sec + '.png';

		var ctx = cve.getContext('2d');
		var base64;
		try {
			base64 = cve.toDataURL();
		}catch(e) {
			alert("ロゴが外部URLをしているため、ダウンロードボタンを使用できません。")
			return;
		}
		document.getElementById("newImg").src = base64;

		var blob = Base64toBlob(base64);
		const url = window.URL.createObjectURL(blob);
		document.getElementById("dlImg").href = url;
		document.getElementById("dlImg").download = filename;

		$('#alert').text("ブラウザ判定");
		//  ダウンロード開始
		if (window.navigator.msSaveBlob) {
			// IE
			window.navigator.msSaveBlob(Base64toBlob(base64), filename);
		} else {
			// Chrome, Firefox, Edge
			document.getElementById("dlImg").click();
		}
		window.URL.revokeObjectURL(url);
	}
}

function Base64toBlob(base64)
{
	var tmp = base64.split(',');
	var data = atob(tmp[1]);
	var mime = tmp[0].split(':')[1].split(';')[0];
	var buf = new Uint8Array(data.length);
	for (var i = 0; i < data.length; i++) {
		buf[i] = data.charCodeAt(i);
	}
	var blob = new Blob([buf], { type: mime });
	return blob;
}

function NewWindow(){
	
	var cve = document.getElementById("result");
	if (cve.getContext) {
		var dataUrl;
		try {
			dataUrl = cve.toDataURL();
		}catch(e) {
			alert("ロゴが外部URLをしているため、ダウンロードボタンを使用できません。")
			return;
		}
		var w = window.open('about:blank');
		w.document.write("<img src='" + dataUrl + "'/>");
	} else {
	}
}
