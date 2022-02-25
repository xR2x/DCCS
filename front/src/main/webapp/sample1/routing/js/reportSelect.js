var base = {
	init:function(){		
		base.set();			
	},
	set:function(){	
		createForm.list.create({
			name:"출력 목록"
			,list:true
			,id:"routing"
			,bodyHeight:260
			,target:"form1"
			,columns:[
				{header:'Material',name:'material',resizable: false, type:"input",readonly:true,border:false,align:"center",attr:["seq","tv_eff_flag"]}
				,{header:'Plant',name:'plant',resizable: false, type:"input",readonly:true,border:false, width:80,align:"center"}
				,{header:'Revision',name:'revision',resizable: false, type:"input",readonly:true,border:false, width:80,align:"center"}
				,{header:'Type Version',name:'tv',resizable: false, type:"select",width:200,data:common.getTypeVersion}
				,{header:'Effectivity',name:'eff',resizable: false, type:"input", width:80,dataType:"int"}
				,{header:'관리',name:'manage',resizable: false,width:70}
			]
		});	

		base.load();
	},
	load:function(){

		var array = Array();

		if(parent.base.reportTarget) {					 			
			var targetObj = $(parent.base.reportTarget).closest("span");			
			array.push(targetObj.attr("seq"));																 
		}else {
			var list = parent.base.grid.getCheckedRows();
			if(list.length > 0) {			  			 	
				for(var i=0;i<list.length;i++) {  
					if(list[i].routing_count > 0) {
						array.push(list[i].seq);
					}
				}
			}									  
		}				 
		var param = {
			array:JSON.stringify(array)
		};		
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/routing/reportSelect",
			data:param,
			success:function(json, status, res){
				try{
					base.makeData(json.data);					
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}   
		});
	},
	makeData:function(json){		  	
		for(var i=0;i<json.length;i++){			 
			var data = json[i];				   
			createForm.list.addRow(data,"form1");			
			var tr = $("#form1").find(".tui-grid-rside-area tr.tui-grid-row").eq(i);   
			var td = tr.find("td[data-column-name=manage]");
			td.find("div").html("<button class='btn middle color red' onclick='createForm.list.remove(this);'>삭제</button>");
			if(data.tv_eff_flag != "X") {									  
				tr.find("td[data-column-name=tv] select").attr("disabled", true);
				tr.find("td[data-column-name=eff] input").attr("disabled", true);
			}	 
		}		 		
	},
	report:function(obj) {			

		var target = $("#form1 .tui-grid-rside-area tr.tui-grid-row");   
								
		var array = new Array();
		 
		for(var i=0;i<target.length;i++){

			var tr = target.eq(i);

			var material = tr.find("td[data-column-name=material]");

			var plant = tr.find("td[data-column-name=plant] input");

			var revision = tr.find("td[data-column-name=revision] input");

			var tv = tr.find("td[data-column-name=tv] select");

			var eff = tr.find("td[data-column-name=eff] input");

			if(material.attr("tv_eff_flag")) {
				if(tv.val() == "") {	 
					parent.$.alert("호기자재는 Type Version을 입력하셔야 합니다.");
					tv.focus();	
					return;
				}							  
				if(eff.val() == "") {	 
					parent.$.alert("호기자재는 Effectivity을 입력하셔야 합니다.");
					eff.focus();			 
					return;
				}                        	  
			}

			array[i] = {
			 	seq:material.attr("seq")
				,material:material.find("input").val()
				,plant:plant.val()
				,revision:revision.val()
			}
			if(material.attr("tv_eff_flag")) {
				array[i].tv_eff_flag = material.attr("tv_eff_flag");
				array[i].tv = tv.val();
				array[i].eff = eff.val();
			}            
		}

		if(array.length == 0) {		 
			parent.$.alert("출력할 항목이 존재하지 않습니다.");
		}else {
			parent.base.report(array);
		}

		parent.popup.close();
	}
}
$(document).ready(base.init);