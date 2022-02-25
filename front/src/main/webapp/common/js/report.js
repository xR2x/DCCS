var base = {
	init:function(){
		base.load();
	},
	load:function() {
		var file = parent.base.reportBlob;		
		var fileURL = URL.createObjectURL(file);
//		var fils = new File([file],"asdasd.text");
        PDFObject.embed(fileURL, $('div.pdfForm'));	
	}	
}

$(document).ready(base.init);
