var main = {
	menuData:null,
	nowMenu:null,
	socket:null,
	rowHeight: 35,
	init:function(){
		$('.scrollbar-inner').scrollbar();
		main.set();
		if(hash.get("service")){
			main.makeMenu();
		}else{
			hash.set({"service":"master/material/list"});
		}
		main.socketInit();
//		main.checkLoginSession();
	},
	set:function(){
		$( "#datepicker" ).datepicker({
			inline: true,
			showWeek: true,
			showOtherMonths: true,
			selectOtherMonths: true
		});
		$("#mainHistoryArea .tab.on").prev().children().css("border-right","none");
		$(".menu-trigger").click(function(e){
			e.preventDefault();
		    $(this).toggleClass('active');
			$("#wrap").toggleClass('hideMainMenu');
			try{
				if(base.grid){
					setTimeout(function(){
					base.grid.refreshLayout();
					},150);
				}
			}catch(e){
			}
		});
	},
	checkLoginSession:function(){
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/front/checkLoginSession",
			data:{},
			success:function(json, status, res){
				try{
				}catch(e){
					console.log(e);
				}finally{
				}
			},
			error:function(e){
//				console.log(e);
			}   
		});
		setTimeout(main.checkLoginSession,60000);
	},
	socketInit:function(){
		return;
		if (window.location.protocol == 'http:') {
			main.socketConnect('ws://192.168.168.2:9090/front/ws');
		} else {
			main.socketConnect('wss://192.168.168.2:9090/front/ws');
		}
	},
	socketConnect:function(host){
		main.socket = new WebSocket(host);
		main.socket.onopen = function () {
		};

		main.socket.onclose = function () {
		};

		main.socket.onmessage = function (message) {
			var data = JSON.parse(message.data);
			if(data.handler == "logout"){
				main.logout("popup");
			}else if(data.handler == "sessionDestroyed"){
				main.loginPop();
			}
		};

		main.socket.onerror = function (evt) {
		};
	},
	test:function(){
		var param = {
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/front/kill",
			data:param,
			success:function(json, status, res){
				try{
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
	hashChange:function(){
		main.makeMenu();
	},
	makeMenu:function(){
		var param = {
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/front/menu",
			data:param,
			success:function(json, status, res){
				try{
					$(".subMenuInner").html("");
//					$("#mainMenuArea").removeClass("active");
					$(".menuDropDown").html("").hide();

					if(hash.get("service")){
						var service = hash.get("service").split("/")[0];
					}else{
						var service = json.data[0].service;
					}
					main.menuData = json.data;
					for(var i=0;i<json.data.length;i++){
						var data = json.data[i];
						if(data.depth == 0){
							var menu = $("<ul/>").appendTo($(".menuDropDown")).html("<img src='/front/common/img/icon/"+data.icon+"'></span>"+data.name).attr({"service":data.service});							
							menu.click(function(){
								hash.set({"service":$(this).attr("service")})
//								location.href = "?service="+$(this).attr("service");
							});
							if(data.service == service){
								$("#mainMenuArea .menuName").html("<img src='/front/common/img/icon/"+data.icon+"'>"+data.name+"");
							}
						}else{
							if(data.service == service){
								var child = (data.child_count > 0)?"child":"";
								var target = $(".childArea."+data.parent).length > 0?$(".childArea."+data.parent):$(".subMenuArea .subMenuInner");
								if(data.main_menu_flag == "X"){		 								
									var subMenu = $("<div/>").appendTo(target).addClass("subMenu").addClass(child).html(data.name).attr({"service":data.service,"code":data.code,"parent":data.parent,"path":data.path,"name":data.name,"size":data.size});
									var icon = $("<span/>").prependTo(subMenu).addClass("subMenuIcon").css({"margin-left":((data.depth-1)*15)+"px"});
									if(data.child_count > 0){											   
										subMenu.addClass("arrowWrap");
										$("<span/>").appendTo(subMenu).addClass("arrow").addClass("small");
										subMenu.click(function(){
											if($(this).attr("class").indexOf("active") > -1){
												$(this).find(".subMenuIcon").removeClass("open");
												$(this).removeClass("active");
												$(".childArea."+$(this).attr("code")).slideUp(100);
											}else{
												$(this).find(".subMenuIcon").addClass("open");
												$(this).addClass("active");
												$(".childArea."+$(this).attr("code")).css({"margin-top":"-15px"}).animate({marginTop:"0px",opacity:"show"},{duration: 300, easing: 'easeOutBounce'})
											}
										});
									}
								}
								if(hash.get("service") == service+""+data.path){
									$(".subMenu.child[code="+data.parent+"]").addClass("active");
									$(".subMenu.child[code="+data.parent+"] .subMenuIcon").addClass("open");
									$(".childArea."+data.parent).show();
									main.nowMenu = data;				
								}
								if(data.path){	
									if(data.menu_type == "popup") {
										if(data.main_menu_flag == "X") {
											subMenu.click(function(){
												popup.create({title:$(this).attr("name"),width:($(this).attr("size")).split("x")[0],height:($(this).attr("size")).split("x")[1],type:"content",href:"/front/"+$(this).attr("service")+$(this).attr("path")+".html"});
											});                   
										}
									}else {
										subMenu.click(function(){
											hash.set({"service":$(this).attr("service")+$(this).attr("path")});
										});
									}	   
								}
								if(data.child_count > 0){
									var childArea = $("<div/>").appendTo($(".subMenuArea .subMenuInner")).addClass("childArea "+data.code);
								}
							}
						}
					}
					$("#mainMenuArea").off().on("click", function(e){
						if($(this).attr("class").indexOf("active") < 0){						
							$(this).addClass("active");
							$(".menuDropDown").stop().slideDown(200,'swing');
							return false;
						}else{
							$(".menuDropDown").stop().slideUp(100);
							$(this).removeClass("active");
							return false;
						}
					}).mouseleave(function(){
						$(".menuDropDown").stop().slideUp(100);
						$(this).removeClass("active");
					});
					main.getPage();
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
	getPage:function(){
		try{
			if(main.nowMenu){
				var split = main.splitService();
				if(!split.service) return;
				$("#mainTitleArea").html("<h1></h1>");
				$("#mainTitleArea h1").html(main.nowMenu.name);
				main.findNavigation(main.nowMenu.parent);
				main.createHistory();
				$("#mainContent").html("");
				$("#searchArea").hide("slide", { direction: "right" }, 100);
				loadCss("/front/"+split.service+"css/"+split.page+".css","mainPageCss");
				loadJs("/front/"+split.service+"js/"+split.page+".js",null,"mainPageJs");
				try{
					$(document).scannerDetection(false);
					if(base){
						base = null;
					}
				}catch(e){
				}
				if(main.nowMenu.menu_type == "list"){
					var grid = $("<div/>").appendTo($("#mainContent")).attr({"id":"grid"});
					var page = $("<div/>").appendTo($("#mainContent")).attr({"id":"pageArea"});
				}else if(main.nowMenu.menu_type == "create"){
					$("#searchArea").remove();
					var wrap = $("<div/>").appendTo($("#mainContent")).attr({"id":"createWrap"});
				}else if(main.nowMenu.menu_type == "update" || main.nowMenu.menu_type == "view"){
					$("#searchArea").remove();
					if(!hash.get("seq")){
						$.alert("잘못된 접근입니다.");
						return false;
					}
					var wrap = $("<div/>").appendTo($("#mainContent")).attr({"id":"createWrap"});
				}else{
					var param = {};
					$.ajax({
						url: "/front/"+hash.get("service")+".html",
						dataType: "html",
						data:param,
						success:function(data){
							try{
								$("#mainContent").html(data);
							}catch(e){
							}finally{
							}
						},
						error:function(request,status,error){
						}
					});
				}
			}
		}catch(e){
			log(e);
			setTimeout(main.getPage,100);
		}
	},
	splitService:function(){
		var services = hash.get("service").split("/");
		var service = "";
		var page = "";
		for(var i=0;i<services.length;i++){
			if(i < services.length - 1){
				service += services[i]+"/";
			}else{
				page = services[i];
			}
		}
		return {service,page};
	},
	findNavigation:function(parent){
		for(var i=0;i<main.menuData.length;i++){
			var data = main.menuData[i];
			if(data.code == parent){
				$("#mainTitleArea h1").html("<span class='naviParent'>"+data.name+"</span>"+$("#mainTitleArea h1").html());
				if(data.parent){
					main.findNavigation(data.parent);
				}else{
					$("#mainTitleArea h1").html("<img src='/front/common/img/icon/"+data.icon+"'>"+$("#mainTitleArea h1").html())
				}
			}
		}
	},
	createHistory:function(){
		$("#mainHistoryArea .tab").mousedown(function(e){
			if(e.which == 2){
				if($(this).attr("class").indexOf(" on") > -1){
					$(this).next().addClass("on");
				}
				$(this).fadeOut(200);
			}
		});
	},
	makeContent:function(){
	},
	loginPop:function(){
		popup.create({title:"로그인",width:500,height:440,type:"content",href:"/front/front/loginPopup.html"});
	},
	logout:function(type){
		var param = {
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/front/logout",
			data:param,
			success:function(json, status, res){
				try{
					if(type == "popup"){
						popup.create({title:"로그인",width:500,height:440,type:"content",href:"/front/front/loginPopup.html"});
					}else{
						$("#leftMenuArea").animate({width:"100%"},200);
						$(".leftMenuWrap").animate({marginLeft:"30px"},{duration: 200}).animate({marginLeft:"-270px",opacity:"hide"},300,function(){
							location.href = "/";
						});
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
	}
}

$(document).ready(main.init);
$(window).on('hashchange',function(){hash.change(main.hashChange);});
$(window).resize(function(){
	try{
		if(base.grid){
			for(var param_key in base.grid){
				base.grid[param_key].refreshLayout();
			}
		}
	}catch(e){
		if(base.grid){
			base.grid.refreshLayout();
		}
	}
});