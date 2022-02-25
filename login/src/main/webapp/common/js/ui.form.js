var form = {
	make:{
		input:function(target,data){
			var input = null;
			if(data.checkbox == true || data.radio == true){
				var type = (data.checkbox)?"checkbox":"radio";
				var radio = (data.radio)?" radio":"";
				var labelLength = (data.labels)?data.labels.length:1;
				for(r=0;r<labelLength;r++){
					var checkBoxArea = $("<label/>").appendTo(target).addClass("checkboxArea");
					var checkboxWrap = $("<label/>").appendTo(checkBoxArea).addClass("checkboxWrap"+radio);
					input = $("<input/>").appendTo(checkboxWrap).attr({"type":type,"id":data.id+"_"+r,"name":data.id}).addClass("checkboxInput"+radio).val(data.values[r]);
					$("<span/>").appendTo(checkboxWrap).addClass("checkboxLabel"+radio);
					var radioLabel = $("<label/>").appendTo(checkBoxArea).addClass("inputLabel").html(data.labels[r]).prop("for",data.id+"_"+r);
					if(data.checkbox == true){
						input.attr("id",data.ids[r]);
						radioLabel.prop("for",data.ids[r]);
					}
				}
			}else if(data.switch == true){
				var width = (data.width)?data.width-6:60-6;
				width = (data.switchWidth)?data.switchWidth:width;
				var labelWrap = $("<label/>").appendTo(target).addClass("switchWrap").width(width);
				input = $("<input/>").appendTo(labelWrap).attr({"type":"checkbox","id":data.id,"name":data.id}).addClass("switchInput");
				var label = $("<span/>").appendTo(labelWrap).addClass("switchLabel").attr({"dataOn":"ON","dataOff":"OFF"});
				var handle = $("<span/>").appendTo(labelWrap).addClass("switchHandle");
				if(data.checked == true){
					input.prop("checked",true);
				}
				if(data.readonly == true){
					input.prop("disabled",true);
				}
			}else{
				var wrap = $("<div/>").appendTo(target).css("position","relative");
				input = $("<input/>").appendTo(wrap).attr({"type":"text","id":data.id,"name":data.name,"autocomplete":"off","dataType":data.dataType,"must":data.must,"title":data.title}).prop("maxLength",data.maxLength);
				if(data.password == true){
					input.attr("type","password");
				}
				if(data.upper == true){
					input.css("text-transform","uppercase");							   	
					input.bind("keyup",function(){$(this).val($(this).val().toUpperCase());});
				}			  
				if(data.notKor == true){
					input.on("input",function(){
						$(this).val($(this).val().replace(/[^a-z0-9]/gi,''));
					});
				}     
				var underline = $("<div/>").appendTo(wrap).addClass("underline");
			}
			if(data.dataType == "int"){
				input.on("input",function(){
					$(this).val($(this).val().replace(/[^0-9]/g,''));
				});
			}
			if(data.dataType == "decimal"){
				input.on("input",{point:data.point},function(e){
					var value = $(this).val().replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
					if(e.data.point){
						var values = value.split(".");
						if(values.length > 1){
							value = values[0]+"."+values[1].substring(0,e.data.point);
						}
					}
					$(this).val(value);
				});
			}        
			if(input != null){
				input.attr({"must":data.must,"title":data.title});
				if(data.value){
					input.val(data.value);
				}
			}
			if(data.disable == true){
				input.prop("disabled",true);
			}
			if(data.data){
				if(data.value){
					data.dataParam.value = data.value;
				}
				data.data.call(this,input,data.dataParam);
			}
			if(data.margin){
				target.css("margin",data.margin);
			}
			if(data.onChange){
				input.change(function(){
					data.onChange.call(this);
				});
			}
			if(data.onInput){
				input.on("input",function(){
					data.onInput.call(this);
				});
			}

			return input;
		},
		textarea:function(target,data){
			var wrap = $("<div/>").appendTo(target).css({"position":"relative","height":"100%"});
			var input = $("<textarea/>").appendTo(wrap).attr({"id":data.id,"name":data.name,"must":data.must,"title":data.title}).val(data.value);
			var underline = $("<div/>").appendTo(wrap).addClass("underline");
			if(data.disable == true){
				input.prop("disabled",true);
			}
			return input;
		},
		text:function(target,data){
			var input = $("<div/>").appendTo(target).addClass("textLayer").html(data.value);
			return input;
		},
		select:function(target,data){
			var wrap = $("<div/>").appendTo(target).css("position","relative");
			if(data.readonly == true){
				var input = $("<input/>").appendTo(wrap).attr({"type":"text","id":data.id,"name":data.name,"autocomplete":"off","dataType":data.dataType,"must":data.must,"title":data.title}).prop("maxLength",data.maxLength);
				if(data.dataParam.value){
					input.val(data.dataParam.value);
				}
			}else{
				var input = $("<select/>").appendTo(wrap).addClass("customize").attr({"id":data.id,"name":data.name,"must":data.must,"title":data.title}).val(data.value);
				var underline = $("<div/>").appendTo(wrap).addClass("underline");
				if(data.value){
					input.val(data.value);
				}
				if(data.data){
					var dataParam = (data.dataParam)?data.dataParam:{};
					if(data.value){
						dataParam["value"] = data.value;
					}else {
						if(!input.attr("id")) dataParam["value"] = "";
					}
					data.data.call(this,input,dataParam);
				}
				if(data.disable == true){
					input.prop("disabled",true);
				}
				if(data.onChange){
					input.change(function(){
						data.onChange.call(this);
					});
				}
			}
			return input;
		},
		date:function(target,data){
			var dateWrap = $("<span/>").appendTo(target).css({"display":"inline-block"});
			var input = $("<input/>").appendTo(dateWrap).attr({"type":"text","id":data.id,"name":data.name,"autocomplete":"off","dataType":data.dataType,"readonly":true,"must":data.must,"title":data.title});
			var underline = $("<div/>").appendTo(dateWrap).addClass("underline");
			var calendar = dateWrap.after("<img src='/front/common/img/icon/calendar_icon.png' class='calendarIcon' target='"+data.id+"'>");
			$(input).datepicker({
				showButtonPanel: true,
				showOtherMonths: true,
				selectOtherMonths: true,
				numberOfMonths: 1,
				changeMonth: true,
				changeYear: true
			});
			if(data.format){
				$(input).datepicker("option","dateFormat",data.format);
			}
			if(data.disable == true){
				input.prop("disabled",true);
			}
			if(data.value){
				input.val(data.value);
			}
			input.on("dblclick",function(){
				$(this).val("");
			});

			$("img.calendarIcon").click(function(){
				$("#"+$(this).attr("target")).focus();
			});
			return input;
		},
		customize:function(target,data){
			target.html(data.html);
		},
		must:function(target,type){
			var title = target.parents(".inputArea").find(".inputTitle");
			if(type == true){
				target.attr("must",true);
				title.html("<span class='must'>*</span>"+title.html());
			}else{
				target.attr("must",null);
				title.find("span.must").remove();
			}
		},
		attach:function(target,data){
			var attachArea = $("<div/>").appendTo(target).addClass("attachArea").attr({"id":data.id,"name":data.name});
			var maxSize = (data.maxSize)?data.maxSize:200;
			file.make({
				target:data.id
				,buttonText:"내 PC에서 파일 찾기"
				,accept:data.accept
				,multiple:data.multiple
				,maxSize:maxSize
				,row:data.row
				,path:data.path
				,makeType:data.makeType
				,targetName:data.targetName
				,preview:data.preview
				,startHandler:function(){
					$("#fu_wrap").show();
				}
			});
		}
	}
};