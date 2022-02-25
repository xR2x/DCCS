var base = {
	init:function(){		
		base.set();
		common.getTypeVersion($("#tv"));
	},
	set:function(){	
		createForm.list.create({
			name:"TV/Eff"
			,list:true
			,id:"tveff"
			,bodyHeight:310
			,target:"form1"
			,columns:[
				{header:'TV',name:'tv',resizable: false, width:150,type:"input",readonly:true,border:false,textAlign:"center"}
				,{header:'Eff.(From)',name:'eff_from',resizable: false, width:90, type:"input",readonly:true,border:false,textAlign:"center"}
				,{header:'Eff.(To)',name:'eff_to',resizable: false, width:90, type:"input",readonly:true,border:false,textAlign:"center"}
				,{header:'Remark',name:'remark',resizable: false, type:"input",readonly:true,border:false}
				,{header:'선택',name:'manage',resizable: false,width:70}
			]
		});	

		base.load();
	},
	load:function(){
		var param = {
			material:urlParam.get("material")
			,plant:urlParam.get("plant")
			,tv:$("#tv").val()
			,eff:$("#eff").val()
		};		
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/changeNumber/read",
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
		createForm.list.reset("form1");
		for(var i=0;i<json.length;i++){			 
			var data = json[i];
			createForm.list.addRow(data,"form1");
			var tr = $("#form1").find(".tui-grid-rside-area tr.tui-grid-row").eq(i);   
			var td = tr.find("td[data-column-name=manage]");
			td.find("div").html("<button class='btn middle color blue' onclick=\"base.select('"+data.change_no+"');\">선택</button>");
		}
	},
	select:function(change_no){
		parent.base.changeNoSelect(change_no);
		parent.popup.close();
	}
}
$(document).ready(base.init);