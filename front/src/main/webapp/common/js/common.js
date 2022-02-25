var urlParam = {
	get:function(key){
		key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]"); 
		var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
		var results = regex.exec(location.search); 
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	},
	set:function(key,value){
		var results = "?";
		var href = location.search.replace(/\?/g,"");
		href = href.split("&");
		var regex = new RegExp("([^&#]*)=([^&#]*)");
		var k = 0;
		for(var i=0;i<href.length;i++){
			var result = regex.exec(href[i]);
			if(result[0]){
				if(result[1] == key){
					results += result[1]+"="+value+"&";
					k++;
				}else{
					results += result[1]+"="+result[2]+"&";
				}
			}
		}
		if(k == 0){
			results += key+"="+value+"&";
		}
		return results.slice(0,-1);
	}
}

var hash = {
	get:function(key){
		var hashs = decodeURIComponent(window.location.hash.substr(1));
		var obj = hashs.replace("#","");
		var result = []; 
		var val = obj.split("&");
		for(var i=0;i<val.length;i++){
			var tmp = val[i].split("=");
			if(tmp[0] == key){
				return result[tmp[0]] = tmp[1];
				break;
			}
			result[tmp[0]] = tmp[1];
		}
		if(key){
			return "";
		}else{
			return result;
		}
	},
	set:function(option){
		var hashs = decodeURIComponent(window.location.hash.substr(1));
		var str = "";
		var param = this.array();
		for(var param_key in param){
			var param_value = param[param_key];
			var cnt = 0;
			for(var key in option){
				if(key == param_key){
					cnt++;
				}
			}
		}
		for(var key in option){
			var value = option[key];
			str += "&"+key+"="+value;
		}
		if(str.charAt( 0 ) === '&'){
			str = str.slice(1);
		}
		if(hashs != str){
			window.location.hash = "#"+encodeURIComponent(str);
		}else{
			return false;
		}
	},
	add:function(option){
		var hashs = decodeURIComponent(window.location.hash.substr(1));
		var str = "";
		var param = this.array();
		for(var param_key in param){
			var param_value = param[param_key];
			var cnt = 0;
			for(var key in option){
				if(key == param_key){
					cnt++;
				}
			}
			if(cnt == 0){
				if(param_key){
					str += "&"+param_key+"="+param_value;
				}
			}
		}
		for(var key in option){
			var value = option[key];
			str += "&"+key+"="+value;
		}
		if(str.charAt( 0 ) === '&'){
			str = str.slice(1);
		}
		window.location.hash = "#"+encodeURIComponent(str);
	},
	array:function(){
		var hashs = decodeURIComponent(window.location.hash.substr(1));
		var obj = hashs.replace("#","");
		var result = []; 
		var val = obj.split("&");
		for(var i=0;i<val.length;i++){
			var tmp = val[i].split("=");
			result[tmp[0]] = tmp[1];
		}
		if($(".searchBody").length > 0){
			result = $(".searchBody").serialize(result,{type:"hashmap"});
		}
		if(hash.get("multiSearch")){
			var multi = JSON.parse(hash.get("multiSearch"));
			for(key in multi){
				delete result[key];
			}
		}
		return result;
	},
	change:function(handler){
		handler.call(this);
	}
}

$.datepicker.setDefaults({
	dateFormat: 'yy/mm/dd',
	prevText: '이전 달',
	nextText: '다음 달',
	monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
	monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
	dayNames: ['일', '월', '화', '수', '목', '금', '토'],
	dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
	dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
	showMonthAfterYear: true,
	yearSuffix: '년',
	weekHeader: '주'
});

function Comma(val){
	while (/(\d+)(\d{3})/.test(val.toString())){
		val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	}
	return val;
}

function isEndWithConsonant(str) {
	var finalChrCode = str.charCodeAt(str.length - 1)
    // 0 = 받침 없음, 그 외 = 받침 있음
	var finalConsonantCode = (finalChrCode - 44032) % 28
    return finalConsonantCode !== 0
};

function attrToArray(obj){
	var param = {};
	for(var i=0;i<obj[0].attributes.length;i++){
		param[obj[0].attributes[i].name] = obj[0].attributes[i].nodeValue;
	}
	return param;
}

function loadCss(url,id){
	removeCss(id);
    var head = document.getElementsByTagName('head')[0];
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = url+"?date="+Date.now();
	css.id = id;
    head.appendChild(css);
}

function removeCss(id){
	var allsuspects = document.getElementsByTagName("link");
	for(var i=0;i<allsuspects.length;i++){
		if(allsuspects[i].id == id){
			$(allsuspects[i]).remove();
		}
	}
}

function stripTags(str){
	try{
		return str.replace(/(<([^>]+)>)/ig,"");
	}catch(e){
	}
}

function loadJs(url, callback, id){
	removeJs(id);
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url+"?date="+Date.now();
	script.id = id;

    script.onreadystatechange = callback;
    script.onload = callback;
    head.appendChild(script);
}

function removeJs(id){
	var allsuspects = document.getElementsByTagName("script");
	for(var i=0;i<allsuspects.length;i++){
		if(allsuspects[i].id == id){
			$(allsuspects[i]).remove();
		}
	}
}

String.prototype.toEncrypt = function(){
	var result = "";
	for(var i=0;i<this.length;i++){
		result += (this[i].charCodeAt(0).toString(16)).substr(-4);
	}
	return result;
}

function selectText(obj) {
    if (document.selection) { // IE
        var range = document.body.createTextRange();
        range.moveToElementText(obj);
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(obj);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
}

function unSelectText() {
    if (document.selection) { // IE
        var range = document.body.createTextRange();
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        window.getSelection().removeAllRanges();
    }
}


function log(str){
	try{
		if(str.toString() == "[object FormData]"){
			for(var pair of str.entries()){
				console.log(pair[0]+':'+pair[1]);
			}
		}else{
			console.log(str);
		}
	}catch(e){
	}
}

$.fn.serialize = function(results,option){	
	var results = (results)?results:[];
	var option = (option)?option:{};
	$(this).find("input,textarea,select").each(function(i){
		var id = $(this).attr("id");
		var name = $(this).attr("name");
		if($(this).val()){
			if(option.type == "hashmap"){
				var array = results;
			}else{
				var array = {};
			}
			if($(this).attr("type") == "checkbox"){
//				log($(this).prop("checked"));
				if($(this).prop("checked") == true){
					array[id] = $(this).val();
				}
			}else if($(this).attr("type") == "radio"){
				if($(this).prop("checked") == true){
					array[name] = $(this).val();
				}
			}else{
				if(!id && name){
					array[name] = $(this).val();
				}else{
					array[id] = $(this).val();
				}
			}
			if(option.type == "hashmap"){
			}else{
				results.push(array);
			}
		}
	});
	return results;
}

var common = {
	makeParam:function(dataParam){
		var param = {};
		if(dataParam){
			dataParam = $.makeArray(dataParam);
			for(var i=0;i<dataParam.length;i++){
				var keys = $.map(dataParam[i],function(value,key){return key;});
				for(var j=0;j<keys.length;j++){
					param[keys[j]] = dataParam[i][keys[j]];
				}
			}
		}
		return param;
	},
	getToday:function(type,date,diff){
		if(date){
			date = date.replace("-","/");
			var today = new Date(date);
		}else{
			var today = new Date();
		}
		if(diff){
			today.setDate(today.getDate() + diff);
		}
		var year = today.getFullYear();
		var month = ((today.getMonth()+1) < 10)?"0"+(today.getMonth()+1):(today.getMonth()+1);
		var day = (today.getDate() < 10)?"0"+today.getDate():today.getDate();
		var hour = (today.getHours() < 10)?"0"+today.getHours():today.getHours();
		var minute = (today.getMinutes() < 10)?"0"+today.getMinutes():today.getMinutes();
		var second = (today.getSeconds() < 10)?"0"+today.getSeconds():today.getSeconds();
		if(type == "1"){
			return year+"/"+month+"/"+day+" "+hour+":"+minute+":"+second;
		}else if(type == "2"){
			return year+"-"+month+"-"+day;
		}else if(type == "3"){
			return year+"."+month+"."+day;
		}else if(type == "4"){
			return year+"/"+month+"/"+day;
		}else if(type == "5"){
			return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
		}else if(type == "6"){
			return year+"/"+month+"/"+day+" "+hour+":"+minute;
		}else{
			return year+""+month+""+day;
		}
	},  
	getPlant:function(obj,dataParam){
		var param = common.makeParam(dataParam);
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/plant/read",
			data:param,
			success:function(json, status, res){
				try{
					$(obj).html("<option value=''></option>");
					for(var i=0;i<json.data.length;i++){
						var data = json.data[i];
						$(obj).append($("<option value='"+data.plant+"' title='"+(data.plant_name?data.plant_name:"")+"'>"+data.plant+"</option>"));
					}
					if(param.value){
						setTimeout(function(){
							$(obj).val(param.value);
						},10);
					}
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}   

		});
	},
	getProject:function(obj,dataParam){
		var param = common.makeParam(dataParam);
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/project/read",
			data:param,
			success:function(json, status, res){
				try{
					$(obj).html("<option value=''></option>");
					for(var i=0;i<json.data.length;i++){
						var data = json.data[i];
						$(obj).append($("<option value='"+data.project_code+"'>"+(data.project_name?data.project_name:"")+"</option>"));
					}
					if(param.value){
						setTimeout(function(){
							$(obj).val(param.value);
						},10);
					}
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}   

		});
	},
	getWorkCenter:function(obj,dataParam,handler){
		var param = common.makeParam(dataParam);
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/workcenter/read",
			data:param,
			success:function(json, status, res){
				try{
					$(obj).html("<option value=''></option>");
					for(var i=0;i<json.data.length;i++){
						var data = json.data[i];
						if(data.ccr_flag == 'X') {
							$(obj).append($("<option value='"+data.workcenter+"' seq='"+data.seq+"'>[CCR] "+data.workcenter+" - "+(data.name?data.name:"")+"</option>"));
						} else {
							$(obj).append($("<option value='"+data.workcenter+"' seq='"+data.seq+"'>"+data.workcenter+" - "+(data.name?data.name:"")+"</option>"));
						}
					}
					if(param.value){
						setTimeout(function(){
							$(obj).val(param.value);
						},10);
					}
					if(handler){
						handler.call(this);
					}
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}
		});
	},
	getCommonCode:function(obj,dataParam){
		var param = common.makeParam(dataParam);
		var viewType = (param.viewType)?param.viewType:"name";
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/common/getCommonCode",
			data:param,
			success:function(json, status, res){
				try{
					$(obj).html("<option value=''></option>");
					for(var i=0;i<json.data.length;i++){
						var data = json.data[i];
						if(viewType == "value"){
							$(obj).append($("<option value='"+data.code+"' title='"+(data.code_name?data.code_name:"")+"'>"+data.code+"</option>"));
						}else if(viewType == "name"){
							$(obj).append($("<option value='"+data.code+"' title='"+(data.code_name?data.code_name:"")+"'>"+(data.code_name?data.code_name:"")+"</option>"));
						}
					}
					if(param.value){
						setTimeout(function(){
							$(obj).val(param.value);
						},10);
					}
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}   

		});
	},
	getShiftCode:function(obj,dataParam){
		var param = common.makeParam(dataParam);
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/shift/read",
			data:param,
			success:function(json, status, res){
				try{
					$(obj).html("<option value=''></option>");
					for(var i=0;i<json.data.length;i++){
						var data = json.data[i];
						$(obj).append($("<option value='"+data.code+"'>"+(data.name?data.name:"")+"</option>"));
					}
					if(param.value){
						setTimeout(function(){
							$(obj).val(param.value);
						},10);
					}
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}
		});
	},
	getUomCode:function(obj,dataParam){
		var param = common.makeParam(dataParam);
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/common/getUomCode",
			data:param,
			success:function(json, status, res){
				try{
					$(obj).html("<option value=''></option>");
					for(var i=0;i<json.data.length;i++){
						var data = json.data[i];
						var selected = "";
						$(obj).append("<option value='"+data.uom+"' "+selected+">"+(data.uom?data.uom:"")+"</option>");
					}
					if(param.value){
						setTimeout(function(){
							$(obj).val(param.value);
						},10);
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
	getOrderCategory:function(obj,dataParam){
		var param = common.makeParam(dataParam);
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/orderCategory/read",
			data:param,
			success:function(json, status, res){
				try{
					$(obj).html("<option value=''></option>");
					for(var i=0;i<json.data.length;i++){
						var data = json.data[i];
						var selected = "";
						$(obj).append("<option value='"+data.category+"' "+selected+">"+(data.name?data.name:"")+"</option>");
					}
					if(param.value){
						setTimeout(function(){
							$(obj).val(param.value);
						},10);
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
	getEquipment:function(obj,dataParam,handler){
		var param = common.makeParam(dataParam);
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/equipment/read",
			data:param,
			success:function(json, status, res){
				try{
					$(obj).html("<option value=''></option>");
					for(var i=0;i<json.data.length;i++){
						var data = json.data[i];
						var selected = "";
						$(obj).append("<option value='"+data.seq+"' "+selected+" spindle='"+data.spindle+"'>"+(data.equipment_name?data.equipment_name:"")+"</option>");
					}
					if(param.value){
						setTimeout(function(){
							$(obj).val(param.value);
						},10);
					}
					if(handler){
						handler.call(this);
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
	getDepartment:function(obj,dataParam,handler){
		var param = common.makeParam(dataParam);
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/user/getDepartment",
			data:param,
			success:function(json, status, res){
				try{
					$(obj).html("<option value=''></option>");
					for(var i=0;i<json.data.length;i++){
						var data = json.data[i];
						var selected = "";
						$(obj).append("<option value='"+data.department+"' "+selected+">"+(data.department)+"</option>");
					}
					if(param.value){
						setTimeout(function(){
							$(obj).val(param.value);
						},10);
					}
					if(handler){
						handler.call(this);
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
	getBreakType:function(obj,dataParam,handler){
		var param = common.makeParam(dataParam);
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/breakType/list",
			data:param,
			success:function(json, status, res){
				try{
					$(obj).html("<option value=''></option>");
					for(var i=0;i<json.data.length;i++){
						var data = json.data[i];
						var selected = "";
						$(obj).append("<option value='"+data.break_type+"' "+selected+">"+(data.break_type)+"</option>");
					}
					if(param.value){
						setTimeout(function(){
							$(obj).val(param.value);
						},10);
					}
					if(handler){
						handler.call(this);
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
	getTypeVersion:function(obj,dataParam,handler){
		var param = common.makeParam(dataParam);
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/typeVersion/read",
			data:param,
			success:function(json, status, res){
				try{
					$(obj).html("<option value=''></option>");
					for(var i=0;i<json.data.length;i++){
						var data = json.data[i];
						$(obj).append("<option value='"+data.tv+"'>"+(data.tv)+"</option>");
					}
					if(param.value){
						setTimeout(function(){
							$(obj).val(param.value);
						},10);
					}
					if(handler){
						handler.call(this);
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