var excel = {
	time:null,
	download:function(data,option){
		var option = option?option:{};		
		var param = {
			api:option.api
			,fileName:option.fileName
			,header:JSON.stringify(data)
		};
		excel.time = new Date();
		list.dispatch('LOADING');
		var request = new XMLHttpRequest();
		request.open('POST', "/util/excel/listDown", true);
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.responseType = 'blob';
		request.onload = function(e) {
			if(this.status === 200) {
				var blob = this.response;
				if(blob.size == 0){
					$.alert("다운로드 받을 데이터가 없습니다.");
				}else{
					$.info("정상적으로 엑셀 파일을 생성하였습니다. <br>소요시간 : "+excel.leadTime(),{time:20000});
					saveAs(new Blob([blob],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}), option.fileName+".xlsx");
				}
				try{
					for(var param_key in base.grid){
						base.grid[param_key].dispatch('setLoadingState', 'LOADING');
					}
				}catch(e){
					base.grid.dispatch('setLoadingState', 'LOADING');
				}
				list.dispatch('DONE');
			}
		};
		var searchParam = $(".searchBody").serialize();
		if(base.sort){
			searchParam.push({"sort":base.sort});
		}
		if(base.sortType){
			searchParam.push({"sortType":base.sortType});
		}
		if(option.active_flag) {					   
			searchParam.push({"active_flag":option.active_flag});
		}        
		if(option.standard_flag) {					   
			searchParam.push({"standard_flag":option.standard_flag});
		}     
		var params = "api="+option.api+"&fileName="+option.fileName+"&header="+JSON.stringify(data)+"&search="+JSON.stringify(searchParam);//+"&paging=true&pageSize=3000&page=1";
		if(option.addSheet) {					   
			params += "&addSheet="+JSON.stringify(option.addSheet);
		}	   
		request.send(params);
	},
	set:function(data,option){
		var option = option?option:{};
		var sheetCount = option.sheetCount?option.sheetCount:1;
		return;
		var header = new Array();
		var wscols = new Array();
		var headers = new Array();
		for(var i=0;i<data.length;i++){
			headers.push(data[i].text);
			wscols.push({wpx:data[i].width});
		}
		header.push(headers);		
		var wb = XLSX.utils.book_new();
		XLSX.utils.sheet_add_aoa(wb, header);
		json = [];
		var ws = XLSX.utils.sheet_add_json(wb,json,{origin:'A2',skipHeader: true});
		ws["!cols"] = wscols;
		var ws = XLSX.utils.book_append_sheet(wb, ws, "테스트");
		var excels = XLSX.write(wb, {bookType:'xlsx', type:'binary'});
		saveAs(new Blob([excel.s2ab(excels)],{type:"application/octet-stream"}), "테스트.xlsx");
	},
	leadTime:function(){
		var gap = new Date() - excel.time;
		var hour = String(Math.floor((gap/ (1000 * 60 *60 )) % 24 ));
		var minutes = String(Math.floor((gap  / (1000 * 60 )) % 60 ));
		var second = String(((gap / 1000 ) % 60).toFixed(3));
		var result = "";
		if(hour > 0){
			result += hour+"시간 ";
		}
		if(minutes > 0){
			result += minutes+"분 ";
		}
		result += second+"초 ";
		return result;
	}
}