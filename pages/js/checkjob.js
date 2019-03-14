var main  = function () {

var job = $('#queue_job').val()
var dir = $('#work_dir').val()
var err = $('#error_msg').val()
console.log("Job number: "+job);
console.log("Job directory: phd-snpg-"+dir);
console.log("Error status: "+err);


if (err == 1){
	var out_text = document.getElementById('out_text');
	console.log('1');
	}
else if (job == ""){
	$("#out_text").html("<p class=\"text\"><b>Queue Position: </b> Unknown"+
	"&nbsp;&nbsp;&nbsp;&nbsp;<b>Status:</b> Unknown<br><br><br><br>"+
	"<b>Warning:</b> Possible error in PhD-SNPg server</p>")
}
else {
     $(document).ready(function () {
		server="http://snps.biofold.org/";
      		form_contents = "njob="+ job;
      		form_action = server+"/cgi-bin/checkjob.cgi";
		if (dir=="example1"){
		file_action = server+"/phd-snpg/example/phd-snpg-45673/output.html";
		}
		else if (dir=="example2") {
		file_action = server+"/phd-snpg/example/phd-snpg-45631/output.html";
		}
		else {
		file_action = server+"/phd-snpg/www-data/phd-snpg-"+dir+"/output.html";
		}

		var job_status = function (output) {
				var vout = output.split("\n")
				var pos = vout[1].split(" ")[2]
				var stat = vout[3].split(" ")[1]
				return [pos, stat]
			};
		
		var rstatus;

    	  	$.ajax( {
 		        'type': 'get',
		        'data': form_contents,
			'async': false,
		       	'url':  form_action,
		        'success': function( result ) {rstatus = result;}
			});

		var dstatus;

		$.ajax( {
                        'url':  file_action,
			'async': false,
			'success': function( result ) {  dstatus = result;}
                        });

		//console.log(rstatus);
		//console.log(dstatus);
		if (dir!="example1" && dir!="example2") {
			data_out = job_status (rstatus);
		}
		else {
			//  Selecting the output of the examples
			var data_out = [0, "Terminated"]
		}
			if (data_out[1]=="Wait" || data_out[1]=="Running") {
				$("#out_text").html("<p class='text' ><b>Queue Position:</b> "+data_out[0]+"&nbsp;&nbsp;&nbsp;&nbsp;<b>Status:</b> Running<br><br>"+
				"<b>Please click the link below.</b> The webpage will be refreshed every 20s:<br><br>"+
				"<a href=\""+file_action+"\">"+file_action+"</a></p>");
				/*$("#out_text").html("<table width='100%'><tr><td>"+
 					"<span class=\"title_span\"><b>Queue Position:</b> "+data_out[0]+"</span>"+
        				"<span class=\"title_span\">&nbsp;&nbsp;&nbsp;&nbsp;<b>Status:</b> Running</span><br><br></td></tr>"+
					"<tr><td><span class=\"title_span\"><b>Please click the link below.</b>"+
					" The webpage will be refreshed every 20s:</span><br><br></td></tr>"+
					"<tr><td></td></tr>"+
					"<tr><td><span class=\"title_span\"><a href=\""+file_action+"\">"+file_action+"</a></span>"+
					"</td><td></td></tr></table>");
				*/
			}
			else if (data_out[1]=="Terminated") {
		
				if (job!="NULL" && dir!="NULL"){
					drawTable();
				}
				else{
					window.location.replace("http://snps.biofold.org/phd-snpg");
				}
				
			}
			else{
				$("#out_text").html("<table ><tr><td>"+
                                        "<span class=\"title_span\"><b>Queue Position:</b> "+data_out[0]+"</span></td>"+
                                        "<span class=\"title_span\"><b><strong>Status:</b> "+data_out[1]+"</td></tr>"+
                                        "<tr><td></td><td></td></tr>"+
                                        "<tr><td><span class=\"title_span\"><b>Warning:</b>&nbsp;"+
                                        "Possible input error to PhD-SNPg server</td><td></td></tr>"+
                                        "<tr><td></td><td></td></tr>"+
                                        "<tr><td></a></td><td></td></tr></table>")
			}
  	});

}
}
