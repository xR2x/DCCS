var popup = {
	scroll_y:0,
	cnt:0,
	loading:null,
	back:function(option){
		option = (option)?option:{};
		var target = option.target?option.target:$("body");
		var backLayer = $("<div class='backLayer' id='backLayer"+this.cnt+"'/>").appendTo(target);
		return backLayer
	},
	del:function(obj){
		$(obj).remove();
	},
	create:function(option){
		var tmp = $("<input/>").appendTo($("body")).focus();
		tmp.remove();
		var option = option?option:{};
		var backLayer = this.back(option);
		backLayer.css("zIndex",9998+this.cnt);
		var fullSize = (option.fullSize)?option.fullSize:false;
		var height = (option.height)?option.height:700;
		var width = (option.width)?(option.width):600;
		var type = (option.type)?(option.type):"content";
		var title = (option.title)?option.title:"";
		var animation = (option.animation)?option.animation:true;
		if(fullSize){
			width = $(window).width()-10;
			height = $(window).height()-10;
			animation = false;
		}
		var popLayer = $("<div class='popLayer' id='popLayer"+this.cnt+"'/>").hide().appendTo("body");
		popLayer
			.css("width",width+"px")
			.css("height",height+"px")
			.css("margin-left","-"+(width/2)+"px")
			.css("margin-top","-"+(height/2)+"px")
			.css("zIndex",9999+this.cnt)
			.attr("width",width)
			.attr("height",height);
		if(animation){
			popLayer
				.animate({marginTop:-((height/2)+10),opacity:"show"},300)
				.animate({marginTop:-(height/2)},300);
		}else{
			popLayer.css("display","block");
		}

		var headerHeight = (option.headerHeight)?option.headerHeight:35;
		var header = $("<div class='header "+option.header_class+"'></div>").appendTo(popLayer).attr("id","popHeader"+this.cnt);
		var headerTitle = $("<span/>").appendTo(header).html(title).addClass("title");
		var headerClose = $("<span/>").appendTo(header).addClass("close").click(function(){popup.close()});
		var headerExtra = $("<span/>").appendTo(header).addClass("extra_area");
		var headerLoading = $("<span/>").appendTo(header).addClass("loading").attr("id","popLoading"+this.cnt);
		header.height(headerHeight).css("line-height",headerHeight+"px");
		headerTitle.height(headerHeight).css("line-height",headerHeight+"px");
		headerLoading.height(headerHeight).css("line-height",headerHeight+"px");
		headerClose.height(headerHeight).css("line-height",headerHeight+"px");
		
		if(type == "content"){
			//alert(this.cnt);
			var iframe = $("<iframe/>").appendTo(popLayer).css("height",(height-headerHeight)+"px").attr("id","pop_iframe"+this.cnt);
			iframe.attr("src",option.href);
			if(fullSize){
			}else{
				header.mousedown(function(e){
					var src = e.target;
					if(src.className.indexOf("no_drag") > -1){
					}else{
						iframe.css("visibility","hidden");
					}
				}).mouseup(function(e){
					var src = e.target;
					if(src.className.indexOf("no_drag") > -1){
					}else{
						iframe.css("visibility","visible");
					}
				});
			}
		}else if(type == "alert"){
			var message = (option.message)?(option.message):null;
			$("<div/>").appendTo(popLayer).attr("id","confirm_area");
			if(message){
				$("<div/>").appendTo($("#confirm_area")).attr("id","confirm_content");
				$("#confirm_content").html(message);
			}
			$("<div/>").appendTo($("#confirm_area")).attr("id","confirm_btn_area");
			$("<button type='button' class='button light_blue middle' id='confirmYesButton'>OK</button>").appendTo($("#confirm_btn_area"));
			$("#confirmYesButton").focus().click(function(){
				option.yesHandler.call(this);
			});
		}else if(type == "confirm"){
			var message = (option.message)?(option.message):null;
			$("<div/>").appendTo(popLayer).attr("id","confirm_area").focus();;
			if(message){
				$("<div/>").appendTo($("#confirm_area")).attr("id","confirm_content");
				$("#confirm_content").html(message);
			}
			$("<div/>").appendTo($("#confirm_area")).attr("id","confirm_btn_area");
			if(option.button){
				for(var i=0;i<option.button.length;i++){
					var button = $("<button/>").appendTo($("#confirm_btn_area")).html(option.button[i].title).addClass(option.button[i].cssClass);
					if(option.button[i].keyCode){
						$(document).keydown({keyCode:option.button[i].keyCode,handler:option.button[i].handler},function(e) {
							if (e.keyCode == e.data.keyCode) {
								$(document).off("keydown");
								e.data.handler.call(this);
								e.stopPropagation();
								return false;
							}
						});
					}
					button.click(option.button[i].handler);
				}
				/*
				for(var i=0;i<option.button.length;i++){
					$button = $("<button type='button' class='btn "+option.button[i][1]+"' id='confirmYesButton' style='"+option.button[i][3]+"'>"+option.button[i][0]+"</button>").appendTo($("#confirm_btn_area"));
					if(option.button[i][2]){
						$button.click(option.button[i][2]);
					}
				}
				*/
			}else{
				$("<button type='button' class='button light_blue middle' id='confirmYesButton'>네</button>").appendTo($("#confirm_btn_area"));
				$("<button type='button' class='button light_red middle' onclick='popup.close()'>아니오</button>").appendTo($("#confirm_btn_area"));
				$("#confirmYesButton").focus().click(function(){
					option.yesHandler.call(this);
					popup.close();
				});

			}
		}else if(type == "preview"){
			var image = (option.image)?option.image:"/view/core/img/blank.gif";
			$("<div/>").appendTo(popLayer).attr("id","preview_area");
			
			if(image){
				$("#preview_area").html("<img src='/view/core/img/blank.gif' id='preview_layer_image'>");
				$("#preview_layer_image")
					.css("width",(width-12)+"px")
					.css("height",(height-60)+"px")
					.css("border","1px solid #EAEAEA")
					.attr("src",image);
			}
		}else if(type == "layer"){
			var layer = $("<div/>").appendTo(popLayer).attr("id","pop_inner_layer");
			layer.html(option.html);
		}
		if(fullSize){
			header.css("cursor","default");
		}else{
			popLayer.draggable({
				appendTo:"body",
				iFrameFix:true,
				opacity:0.8,
				revert:false,
				zIndex:10001,
				scrollSpeed:0,
				snap:false,
				scrollSensitivity:0,
				obstacle:"#top_menu",
				preventCollision: false
			});
		}
		$(function(){
			$(window).resize(function(){
				if(fullSize){
					width = $(window).width()-10;
					height = $(window).height()-10;
				}
				popLayer
					.css("width",width+"px")
					.css("height",height+"px")
					.css("margin-left","-"+(width/2)+"px")
					.css("margin-top","-"+(height/2)+"px");
			});
		});
		this.cnt++;
	},
	print:function(){		
		window.frames["pop_iframe"+(popup.cnt-1)].focus();
		window.frames["pop_iframe"+(popup.cnt-1)].document.execCommand('print', false, null);
	},
	pdf_download:function(){
		/*
		window.frames["pop_iframe"+(popup.cnt-1)].focus();
		var iframe = $("#pop_iframe"+(popup.cnt-1))[0].contentWindow;
		html2canvas(document.body).then(function(canvas) {
			document.body.appendChild(canvas);
		});
		*/
		/*
		html2canvas(iframe.$("body"), {
		  onrendered: function(canvas) {
			var img = canvas.toDataURL();
			// img 데이터 : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAALnCAYAAACncBEoAAAgAElEQ…GgcaASBzQgt/fw3lcJZgPTONA40DjQOLALONCXYfjy/w8Gd/MrFODziAAAAABJRU5ErkJggg==" 
//			$("#section").html('<img src=' + img + '>');    // section2 영역에 section1 을 이미지 capture 내용이 보여짐			
			window.open(img);   // 이미지를 윈도우 팝업으로..

		  }
		});
		*/
		/*
		var doc = new jsPDF();
		var specialElementHandlers = {
			'body': function (element, renderer) {
				return true;
			}
		};
		doc.fromHTML(iframe.$("body").html(), 15, 15, {
			'width': 170,
			'elementHandlers': specialElementHandlers
		});
		doc.save('111sample-file.pdf');
		*/
	},
	loading_start:function(option){
		popup.loading = new Loader().make("popLoading"+(this.cnt-1),{size:option.size,color:option.color,position:"relative"});
	},
	inner_header:function(str,cnt,clear){
		var cnt = (cnt)?cnt:parent.popup.cnt-1;
		if(clear == true){
			$("#popHeader"+cnt+" span.extra_area").html("");
		}
		$("#popHeader"+cnt+" span.extra_area").append("<span>"+str+"</span>");
		
	},
	loading_end:function(){
		try{
			$("#popLoading"+(this.cnt-1)).html("");
			popup.loading.stop();
		}catch(e){
		}
	},
	fullscreen:function(){
		var width = $(window).width()-10;
		var height = $(window).height()-10;
		popLayer = $("#popLayer"+(this.cnt-1));
		header = $("#popHeader"+(this.cnt-1));
		header.css("cursor","default");
		$("#popHeader"+(this.cnt-1)+" .fullscreen").removeClass("fullscreen").addClass("smallscreen").click(function(){popup.smallscreen()});;
		popLayer
			.css("width",width+"px")
			.css("height",height+"px")
			.css("left","50%")
			.css("top","50%")
			.css("margin-left","-"+(width/2)+"px")
			.css("margin-top","-"+(height/2)+"px");
		popLayer.draggable("disable");
	},
	smallscreen:function(){
		popLayer = $("#popLayer"+(this.cnt-1));
		var width = popLayer.attr("width");
		var height = popLayer.attr("height");
		$("#popHeader"+(this.cnt-1)+" .smallscreen").removeClass("smallscreen").addClass("fullscreen").click(function(){popup.fullscreen()});;
		header.css("cursor","move");
		popLayer
			.css("width",width+"px")
			.css("height",height+"px")
			.css("margin-left","-"+(width/2)+"px")
			.css("margin-top","-"+(height/2)+"px");
		popLayer.draggable("enable");
	},
	resize:function(){
		for(var i=0;i<this.cnt;i++){
			popLayer = $("#popLayer"+(i));
			var width = popLayer.attr("width");
			var height = popLayer.attr("height");
			if(height > $(window).height()){
				popLayer.css("height","100px");
			}
		}
	},
	close:function(count){
		if(count){
			for(var i=0; i<count; i++){
				$("#backLayer"+(this.cnt-1)).remove();
				$("#popLayer"+(this.cnt-1)).remove();
				this.cnt--;
			}
		}else{
			$("#backLayer"+(this.cnt-1)).remove();
			$("#popLayer"+(this.cnt-1)).remove();
			this.cnt--;
		}
		if($("#message_area").length > 0){
			$("#message_area").remove();
		}
	}
}
$(function(){
	$(document).keydown(function(event){
		try{
			if(event.which == 27){
				if(parent.popup){
					parent.popup.close();
				}else{
					popup.close();
				}
			}
		}catch(e){
		}
	});
	$(window).resize(function(){
		if(popup.cnt > 0){
			popup.resize();
		}
	});
});
