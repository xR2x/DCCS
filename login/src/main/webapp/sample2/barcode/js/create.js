var base = {
	type:"w",
	cnt:0,
	init:function(){
		$(".addTabArea .tab").click(function(){
			base.tabChange($(this).attr("type"));
		});
		$("#userInput").on("input",function(){
			base.makeBarcode({target:$("#tmpBarcode"),height:36,margin:0.1});
		});
		$("#height").on("input",function(){
			$(this).val($(this).val().replace(/[^0-9]/g,''));
		});
		$("#userInput").on("keypress",function(e){
			if(e.which == 13){
				base.check();
			}
		});
		$("#userInput").focus();
		$('.scrollbar-inner').scrollbar();
	},
	tabChange:function(type){
		$(".addTabArea button.tab").removeClass("on");
		$(".tab[type="+type+"]").addClass("on");
		base.type = type;
		if(type == "w"){
			$("#userInput").prop("placeholder","작업장 코드를 입력해주세요.");
		}else if(type == "u"){
			$("#userInput").prop("placeholder","작업자 사번을 입력해주세요.");
		}else if(type == "n"){
			$("#userInput").prop("placeholder","바코드를 생성할 키워드를 입력해주세요.");
		}
		$("#userInput").focus();
	},
	keyInput:function(obj){
		if(obj.value.search(/[^a-zA-Z0-9]/g, '') == 0){
			$.alert("한글은 입력하실 수 없습니다.");
		}
		obj.value = obj.value.replace(/[^a-zA-Z0-9]/g, '').replace(/(\..*)\./g, '$1');
	},
	check:function(){
		if($("#userInput").val().replace(/ /g,"") == ""){
			$.alert("바코드를 생성할 코드를 입력해주세요.");
			$("#userInput").focus();
			return;
		}
		var param = {
			type:base.type			
		};
		if(base.type == "w"){
			param.workcenter = $("#userInput").val();
		}else if(base.type == "u"){
			param.worker = $("#userInput").val();
		}else if(base.type == "n"){
			base.add();
			return;
		}
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/pop/so/barcodeCheck",
			data:param,
			success:function(json, status, res){
				try{
					if(json.data == 0){
						if(base.type == "w"){
							$.alert("작업장 <strong>["+$("#userInput").val()+"]</strong>는 없는 작업장입니다. <br>대소문자를 구분하여 입력하여 주시기 바랍니다.");
						}else if(base.type == "u"){
							$.alert("사번 <strong>["+$("#userInput").val()+"]</strong>는 없는 사번입니다. <br>대소문자를 구분하여 입력하여 주시기 바랍니다.");
						}
						$("#userInput").select();
					}else{
						base.add();
					}
				}catch(e){
					console.log(e);
				}finally{
				}
			},
			error:function(e){
				console.log(e);
			}   
		});
	},
	add:function(){
		$(".alertArea").hide();
		var wrap = $("<div/>").appendTo($(".canvasArea .scroll-content")).addClass("barcodeWrap");
		var barcode = $("<img/>").appendTo(wrap).attr("id","barcode"+base.cnt).addClass("barcodeImage").hide();
		var height = ($("#height").val().replace(/ /g,"") == "")?80:$("#height").val();
		var showText = ($("#showText").prop("checked") == true)?true:false;
		base.makeBarcode({target:$("#barcode"+base.cnt),showText:showText,height:height});
		$("#userInput").val("");
		$("#tmpBarcode").hide();
		base.cnt++;
		$("#userInput").focus();
		$(".canvasArea .scroll-content").scrollTop($(".canvasArea .scroll-content").height());
		$.lineEffect({target:$(wrap)});
		barcode.fadeIn();
		$(".canvasArea .scroll-content").sortable({
			handle: ".barcodeImage"
		}).disableSelection();
		wrap.dblclick(function(){
			$(this).remove();
			if($(".barcodeWrap").length == 0){
				$(".alertArea").show();
			}
		});
	},
	deleteAll:function(){
		$(".barcodeWrap").remove();
		$(".alertArea").show();
	},
	print:function(){
		if($(".barcodeWrap").length == 0){
			$.alert("출력할 바코드가 없습니다.");
			return;
		}
		window.print();
	},
	makeBarcode:function(option){
		var option = option?option:{};
		var showText = option.showText?option.showText:false;
        var text = $("#userInput").val();
		var height = option.height?option.height:80;
		var margin = option.margin?option.margin:10;
        text = text.replace(/\\F/gi, String.fromCodePoint(29));
		var barcodeText = (base.type == "w")?"w::"+text:(base.type == "u")?"u::"+text:(base.type == "n")?text:"";
		if(text.length == 0){
			$("#tmpBarcode").hide();
		}else{
			$("#tmpBarcode").show();
			$(option.target).JsBarcode(
				barcodeText,{
					"format": "CODE128",
					"background": "#FFFFFF",
					"lineColor": "#000000",
					"fontSize": 20,
					"height": height,
					"width": 2,
					"margin": margin,
					"textMargin": 0,
					"displayValue": showText,
					"font": "sans-serif",
					"textAlign": "center",
					"text":text
				}
			);
		}
	}
}

$(document).ready(base.init);