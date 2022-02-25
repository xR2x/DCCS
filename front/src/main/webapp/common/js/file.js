var file = {
	rowCount:0,
	count:0,
	fileArray:new Array(),
	delFileArray:new Array(),
	status:null,
	data:null,
	fd:null,
	files:new Array(),
	option:new Array(),
	reject:"asp|aspx|htm|html|asa|phtml|php|php3|php4|php5|inc|htm|html|jsp|jspx|jsw|jsv|jspf|pl|pm|cgi|lib|cfm|cfml|cfc|dbm|exe|bat|sh|class|java|js",
	make:function(option){
		file.option[file.count] = option;
		file.fileArray[file.count] = new Array();
		var sizes = ['Byte', 'KB', 'MB', 'GB'];
		var buttonText = option.buttonText?option.buttonText:"파일찾기";
		var obj = $("#"+option.target).addClass("fuFileUploadArea").attr({"index":file.count});
		var multiple = (option.multiple == false)?false:true;
		var accept = (option.accept)?option.accept:"*.*";
		if(option.makeType != "view"){
			var fileInput = $("<input/>").appendTo(obj).attr({"type":"file","name":"files[]","id":"fuFile"+file.count,"multiple":multiple,"accept":accept,"index":file.count}).addClass("fuFile")
							.change(function(event){
								if(option.startHandler){
									option.startHandler.call(this);
								}
								file.upload(this.files,this,file.option[$(this).attr("index")],$(this).attr("index"));
							});
			var buttonArea = $("<div/>").appendTo(obj).addClass("fuButtonArea");
			var fileButton = $("<button/>").appendTo(buttonArea).addClass("btn");
			var fileLabel = $("<label/>").appendTo(fileButton).attr("for","fuFile"+file.count).addClass("fuButtonLabel").html(buttonText);
			var fileTotalInfo = $("<div/>").appendTo(buttonArea).addClass("totalInfo").html("첨부파일용량 : <span id='fileSizeArea"+file.count+"' class='fileSizeArea' size='0'>0KB</span> / "+file.fileSize(option.maxSize*1024*1024,0));
		}
		var fileWrap = $("<div/>").appendTo(obj).addClass("fuWrap").attr({"id":"fuWrap"+file.count,"index":file.count});
		if(option.makeType != "view"){
			fileWrap.addClass("view");
		}

		if(option.preview == true){
			var previewArea = $("<span/>").appendTo(fileWrap).addClass("fuPreviewWrap");
			$("<div/>").appendTo(previewArea).html("미리보기").addClass("previewTitle");
			var photoArea = $("<div/>").appendTo(previewArea).addClass("photoArea");
		}
		var filelistWrap = $("<span/>").appendTo(fileWrap).addClass("fuFilelistWrap");

		var fileList = $("<div/>").appendTo(filelistWrap).addClass("fuFilelist scrollbar-inner").attr({"id":"fuFilelist"+file.count,"index":file.count})
		$('.scrollbar-inner').scrollbar();
		$("#fuWrap"+file.count+" .fuFilelist").height((option.row?option.row:3)*28);
		var fileMent = $("<div/>").appendTo(fileList).addClass("filement").html("<img src='data:image/png;base64,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'> 첨부파일을 여기로 드래그하거나 파일 찾기를 통하여 등록해 주세요.").height(fileList.height()).css("line-height",fileList.height()+"px");

		$("#fuWrap"+file.count).on('dragenter',function (e){
			e.stopPropagation();
			e.preventDefault();
			$(this).addClass("hover");
		}).on('dragover', function (e){
			e.stopPropagation();
			e.preventDefault();
		}).on('dragleave', function (e){
			$(this).removeClass("hover");
			e.stopPropagation();
			e.preventDefault();
		}).on('drop', function (e){ 
			$(this).removeClass("hover");
			e.preventDefault();
			var files = e.originalEvent.dataTransfer.files; 
			file.upload(files,$("#fuFile"+$(this).attr("index"))[0],file.option[$(this).attr("index")],$(this).attr("index"));
		});
		$(document).on('dragenter', function (e){
			e.stopPropagation();
			e.preventDefault();
		}).on('dragover', function (e){
			e.stopPropagation();
			e.preventDefault();
			obj.removeClass("hover");
		}).on('drop', function (e){
			e.stopPropagation();
			e.preventDefault();
		});
		if(option.onlyButton == true){
			$(".fuButtonArea .totalInfo").hide();
			$(".fuWrap"+file.count).hide();

		}
		file.count++;
	},
	upload:function(files,obj,option,index){
		file.files = files;
		if(!file.sizeCheck(files,index)){
			$.alert("파일용량이 허용치보다 큽니다. <br>(최대 : "+file.fileSize(option.maxSize*1024*1024,0)+")");
			$("#fuFile"+index).val("");
			return false;
		}
		var j,k=0;
		for(var i = 0; i < files.length; i++){
			if(file.rejectCheck(files[i],index,k)){
				var status = new file.createStatusbar(index);
				if(file.repeatCheck(files[i],index,j)){
					file.fd = new FormData();
					file.fd.append('file', files[i]);
					if(option.immediate == true){
//						file.sendServer(file.fd, status, files[i], option, index); //incomplete
					}else{
						file.makeList(file.fd, status, files[i], option, index);
					}
					j++;
				}
			}else{
				k++;
			}
		}
		$("#fuFilelist"+index).scrollTop(20000);
		$("#fuFile"+index).val("");
		$(document).focus();
	},
	send:function(){
		for(var i = 0; i < file.files.length; i++){
			file.sendServer(file.fd,null,file.files[i],file.option);
		}
	},
	makeList:function(formData,status,files,option,index){
		status.setFileNameSize(files,null,index);
		status.statusbar.show("slide",{direction: 'up'}, 200,function(){
		});
		status.setAbort(null,index);
		var sizeTarget = $("#fileSizeArea"+index);
		var totalSize = parseInt(sizeTarget.attr("size"),10)+files.size;
		sizeTarget.html(file.fileSize(totalSize,2)).attr("size",totalSize);
		file.fileArray[index].push({file:files,option:file.option[index]});

	},
	createStatusbar:function(index){
		file.rowCount++;
		if(file.rowCount > 0){
			$("#fuFilelist"+index+" .filement").hide();
		}
		if(!$("#fuFilelist"+index)) return;
		this.statusbar = $("<ul class='statusbar fileul'></ul>").appendTo($("#fuFilelist"+index));
		if(file.option[index].makeType != "view"){
			this.abort = $("<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHNSURBVHjapFPLTsJAFD0tL0mJC9i4MaIhRlnZuHJhQuKWD/AH5DNY+BnwA34AH0DUjTFRExNdCIiBBBZUglLeUO8ZaNOoK53ktLfnnntm5s5UcxwH/xlBPur1up9LC04FWYG54u4FJcGF4MkVJpNJgCuo1Wru+0zMWp1OxxmNRo47GJNjjhp/jcZHpVKh4VkkEikkEglEo9FflzscDmFZFsbjcU4+i6lUCjoTYpLWNO08Ho/jct/A9Y7+o5gcc9RQyxrySjmbzU4Nw9jgzIYw+xHgLqWrJRKMyTGnNKJljWewWCyyQvKNo5cp3qbAVgho7AUUGJNjjpqVNuudwnw+NyeTCQaDAYLBIHYfPvB+uK4KOVhMrtfrcbVKwxq/gRLShI3i0L71gM3jCAQCrgG8LcjHva7rkFNQSetkW+2XMxOMyTFHDbWs8RuUut0uwuEwXo83vT2vXbUV3J4wRw21rPEbXMhFaXML9gJ4HgPbtxZCoZACY3LMUUMta7weSEefJJFvNBqFg5sWYrEYVvdj2Q9Ng/n4iX6/D9HQJO9eafcYYZpm0bbtXLVabTebTUis9kowJsccNdSyRplzlnK5/KefKZPJLA3+M74EGAAPsziX/sfaUwAAAABJRU5ErkJggg==' class='abort fileDelete' progress='0'/>").appendTo(this.statusbar);
		}
		this.filename = $("<strong class='filename'></strong>").appendTo(this.statusbar);
		this.size = $("<u class='filesize'></u>").appendTo(this.statusbar);
		this.setFileNameSize = function(files,error,index){
			this.statusbar.attr("id",files.name.toEncrypt());
			this.filename.html(files.name);
			if(file.option[index].preview == true){
				this.filename.on("click",{files:files},function(e){
					var fr = new FileReader();
					$("#fuWrap"+index+" .photoArea").addClass("loadingPhoto");
					fr.onload = function () {
						$("#fuWrap"+index+" .photoArea").removeClass("loadingPhoto").css({"background-image":"url("+fr.result+")"});
			        }
					fr.readAsDataURL(e.data.files);
				});
			}
			this.size.html(file.fileSize(files.size,2));
			this.statusbar.attr("size",files.size);
			if(error){
				$("#fuFilelist"+index+" .filement").hide();
				this.statusbar.addClass("reject");
			}
		}
		this.setAbort = function(jqxhr,index){
			var sb = this.statusbar;
			if(file.option[index].makeType != "view"){
				this.abort.click(function(){
					if(jqxhr){
						if(parseInt($(this).attr("progress")) >= 100){
							file.fileDelete(this, $(this).attr("file_full_path"),$(this).attr("size"));
						}else{
							jqxhr.abort();
						}
					}
					file.fileDelete(sb,index);
				});
			}
		}
	},
	view:function(data,fileData){
		var target = $("#"+data.id+" .fuWrap");
		var index = target.attr("index");
		for(var i=0;i<fileData.length;i++){
			if(data.targetName == fileData[i].file_target_name){
				var files = {};
				files.name = fileData[i].file_original_name;
				files.size = fileData[i].file_size;
				var status = new file.createStatusbar(index);
				status.setFileNameSize(files,null,index);
				status.statusbar.show("slide",{direction: 'up'}, 200,function(){});
				status.statusbar.attr({"seq":fileData[i].seq});
				status.setAbort(null,index);
				var sizeTarget = $("#fileSizeArea"+index);
				var totalSize = parseInt(sizeTarget.attr("size"),10)+files.size;
				sizeTarget.html(file.fileSize(totalSize,2)).attr("size",totalSize);

			}
		}
	},
	sendServer:function(formData,status,files,option,index) {
		var option = option?option:{};
		if(option.startHandler){
			option.startHandler.call(this);
		}
		var uploadURL ="/front/file/upload";
		var jqXHR=$.ajax({
			xhr: function(){
				var xhrobj = $.ajaxSettings.xhr();
				if(xhrobj.upload){
					xhrobj.upload.addEventListener('progress', function(event) {
						var percent = 0;
						var position = event.loaded || event.position;
						var total = event.total;
						if(event.lengthComputable){
							percent = Math.ceil(position / total * 100);
						}
						if(status){
							//Set progress
							status.setProgress(percent);
						}

						if(option.progress_handler){
							option.progress_handler.call(this,percent);
						}
					}, false);
				}
				return xhrobj;
			},
			url: uploadURL,
			type: "POST",
			contentType:false,
			processData: false,
			cache: false,
			data: formData,
			success: function(json){
				var data = json[0].data;
				if(status){
					status.abort.attr({"file_full_path":data.file_full_path,"fileSize":files.size});
				}
				var fileType = files.name.slice(files.name.lastIndexOf(".")+1).toLowerCase();
				var file_name = files.name.replace(/\,/g,"，");
				var fileArray = new Array();
				fileArray.push(file_name);
				fileArray.push(data.file_name);
				fileArray.push(data.file_path);
				fileArray.push(files.size);
				fileArray.push(fileType);
				fileArray.push("N");
				file.fileArray.push(JSON.stringify(fileArray));
//				file.fileArray.push(file_name+"|"+data.file_name+"|"+data.file_path+"|"+files.size+"|."+fileType+"|N");
				var sizeTarget = $("#fileSizeArea");
				var totalSize = parseInt(sizeTarget.attr("size"),10)+files.size;
				sizeTarget.html(file.fileSize(totalSize,2)).attr("size",totalSize);
				if(option.success_handler){
					option.success_handler.call(this,json);
				}
			},
			error:function(xhr, status, error){
				alert(xhr.responseText);
			}
		});
		if(status){
			status.setAbort(jqXHR);
		}
	},
	fileDelete:function(obj,index){
		$(obj).fadeOut(200,function(){
			var sizeTarget = $("#fileSizeArea"+index);
			var totalSize = parseInt(sizeTarget.attr("size"),10)-$(this).attr("size");
			sizeTarget.html(file.fileSize(totalSize,2)).attr("size",totalSize);
			for(var i=0;i<file.fileArray[index].length;i++){
				if($(this).attr("id") == file.fileArray[index][i].file.name.toEncrypt()){
					file.fileArray[index].splice(i,1);
					break;
				}
			}
			if($(obj).attr("seq") != null){
				file.delFileArray.push($(obj).attr("seq"));
				log(file.delFileArray);
			}
			$("#fuWrap"+index+" .photoArea").css("background-image","none");
			$(obj).remove();
			if($("#fuFilelist"+index+" .fileul").length == 0){
				$("#fuFilelist"+index+" .filement").show();
			}
		});
	},
	fileDeletes:function(obj, filename, filesize, seq){
		if(seq) {
			file.delFileArray.push(seq);
			$("#fuFilelist"+file.count+" ul."+seq).remove();
			if($(".fuFilelist .fileul").length == 0){
				$("#fuFilelist"+file.count).html("<ul class=\"no_file\">등록된 첨부파일이 없습니다.</ul>");
			}
			file.fileArrayDelete(obj);
		} else {
			$.ajax({
				url:"/servlet/",
				type:"POST",
				data:{
					main:"util.Files",
					sub:"delete",
					util:"true",
					file:filename
				},
				success:function(json) {
					var sizeTarget = $("#fileSizeArea");
					var totalSize = parseInt(sizeTarget.attr("size"),10)-filesize;
					sizeTarget.html(file.fileSize(totalSize,2)).attr("size",totalSize);
					file.fileArrayDelete(obj);
				},
				error:function(){
				}
			});
		}

	},
	download:function(name){
		var fileArray = JSON.parse(file.findFilename(name));
		var filename = fileArray[1];
		var filepath = fileArray[2];
		var fileoriginal = fileArray[0];
		var iframe = $("<iframe>").appendTo($("body")).css({"width":"0px","height":"0px"}).attr("id","file_download");
		file_download.location.href = "/servlet/?main=util.Files&sub=download&download_type=direct&util=true&response=true&filename="+filename+"&filepath="+filepath+"&fileoriginal="+encodeURI(encodeURIComponent(fileoriginal));
		iframe.remove();
		return;
	
	    location.href = "/view/core/WINZZ/WINZZ_filedownload.jsp?filename="+data.file_server_name+"&real_filename="+encodeURIComponent(data.file_orginal_name)+"&path="+data.file_path;
	},
	findFilename:function(name){
		for(var i=0;i<file.fileArray.length;i++){
			if(JSON.parse(file.fileArray[i])[0].toEncrypt() == name){
				return file.fileArray[i];
				break;
			}
		}
	},
	fileSize:function(fileSize,fixed){
		var fixed = (fixed)?fixed:0;
		var sizes = ['B', 'KB', 'MB', 'GB'];
		var j = 0;
		while (fileSize >= 1024 && j + 1 < sizes.length) {
			j++;
			fileSize = fileSize / 1024;
		}
		var return_value = "";
		if(fileSize && fileSize > 0){
			if(fileSize.toFixed(fixed) == 1000){
				if(sizes[j] == "KB"){
					return_value = "1MB";
				}else if(sizes[j] == "MB"){
					return_value = "1GB";
				}
			}else{
				return_value = fileSize.toFixed(fixed)+""+sizes[j];
			}
		}else{
			return_value = "0KB";
		}
		return return_value;
	},
	singleUpload:function(files,option){
		var fd = new FormData();
		fd.append('file', files[0]);
		file.sendServerSingle(fd,option);
	},
	sendServerSingle:function(formData,option) {
		var option = option?option:{};
		if(option.startHandler){
			option.startHandler.call(this);
		}
		var param = "?main=util.Files&sub=upload&util=true";
		var uploadURL ="/servlet/"+param; //Upload URL
		var jqXHR=$.ajax({
			xhr: function(){
				var xhrobj = $.ajaxSettings.xhr();
				return xhrobj;
			},
			url: uploadURL,
			type: "POST",
			contentType:false,
			processData: false,
			cache: false,
			data: formData,
			success: function(json){
				if(option.success_handler){
					option.success_handler.call(this,json);
				}
			},
			error:function(xhr, status, error){
			}
		});
	},
	rejectCheck: function(files,index,cnt){
		var fileType = files.name.slice(files.name.lastIndexOf(".")+1).toLowerCase();
		var fileExp = new RegExp('\('+file.reject+')','i');
		if(fileType.match(fileExp)){
			setTimeout(function(){
				$.alert("[."+fileType+"] 파일은 등록하실 수 없습니다. <br><b>"+files.name+"</b>",{time:3000,transition:"plain",stack:30});
			},cnt*100);
			return false;
		}else{
			return true;
		}
	},
	repeatCheck:function(files,index,cnt){
		for(var i=0;i<file.fileArray[index].length;i++){
			if(file.fileArray[index][i].file.name == files.name){
				var lastTarget = $("#"+files.name.toEncrypt());
				$("#fuFilelist"+index).scrollTop(lastTarget.position().top-lastTarget.height());
				var target = "#"+files.name.toEncrypt();
				setTimeout(function(){
					$.alert("동일한 파일이 등록되어 있습니다.<br><b>"+files.name+"</b>",{time:3000,transition:"plain",stack:30,handler:function(){
						$.line_effect({target:target,delay:1000,speed:300,color:"#A94442"});
					}});
				},cnt*100);
				return false;
			}
		}
		return true;
	},
	sizeCheck:function(files,index){
		var size = 0;
		for(var i=0;i<files.length;i++){
			size += parseInt(files[i].size,10);
		}
		var nowSize = parseInt($("#fileSizeArea"+index).attr("size"),10)+size;
		var maxSize = file.option[index].maxSize * 1024 * 1024;
		if(nowSize > maxSize){
			return false;
		}
		return true;
	}

}