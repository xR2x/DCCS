var base = {
	init:function(){		
		base.set();			
	},
	set:function(){	
		createForm.list.create({
			name:"공정정보"
			,list:true
			,id:"routing"
			,bodyHeight:260
			,target:"form1"
			,columns:[
				{header:'Type Version',name:'tv',resizable: false, type:"input",readonly:true,border:false}
				,{header:'관리',name:'manage',resizable: false,width:70}
			]
		});	

		base.load();
	},
	load:function(){
		var param = {
			tv:$("#tv").val()	
		};		
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/typeVersion/read",
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
		
		base.tableReset("form1");

		for(var i=0;i<json.length;i++){			 
			var data = json[i];

			createForm.list.addRow(data,"form1");

			var tr = $("#form1").find(".tui-grid-rside-area tr.tui-grid-row").eq(i);   
			var td = tr.find("td[data-column-name=manage]");

			if(data.use_count > 0) {
				td.find("div").html("<button class='btn middle disabled' onclick='base.use_info();'>삭제</button>");
			}else {
				td.find("div").html("<button class='btn middle color red' onclick='base.remove(this);' seq='"+data.seq+"'>삭제</button>");
			}
		}

		
	},
	tableReset:function(target){
		var tr = $("#"+target+" .tui-grid-rside-area tr.tui-grid-row");   
		for(var i=0;i<tr.length;i++){			 						  
			var button = tr.eq(i).find("td[data-column-name=manage] button");  
			createForm.list.remove(button);								   
		}																
	},
	use_info:function(){
		parent.$.alert("사용중인 Type Version은 <br>삭제할 수 없습니다.");
	},
	remove:function(obj) {												  
		var seq = $(obj).attr("seq");	

		var param = {
			seq:seq
		};	   	
		$.loading.make({ment:"처리중입니다."}); 						
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/typeVersion/delete",
			data:param,
			success:function(json, status, res){
				try{
					if(json.error) {
						parent.$.alert(json.error);
					}else {
						parent.$.info("삭제되었습니다.");
					 	base.load();
					}
				}catch(e){
					console.log(e);
				}finally{
				  	$.loading.del();
				}
			},
			error:function(e){
				console.log(e);
			}   
		});

	},
	create:function(){	  	
		if($("#tv").val().trim() == "") {
			parent.$.alert("Type Version을 입력후 추가버튼을 클릭해 주세요.");
			return false;											
		}			
		var param = {
			tv:$("#tv").val().trim()	
		};	
		$.loading.make({ment:"처리중입니다."}); 			
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/typeVersion/create",
			data:param,
			success:function(json, status, res){
				try{
					if(json.error) {
						parent.$.alert(json.error);
					}else {
						parent.$.info("추가되었습니다.");
						$("#tv").val("");
					 	base.load();
					}
				}catch(e){
					console.log(e);
				}finally{
				  	$.loading.del();
				}
			},
			error:function(e){
				console.log(e);
			}   
		});
	}
}
$(document).ready(base.init);