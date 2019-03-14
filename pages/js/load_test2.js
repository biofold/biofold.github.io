function drawTable () {

var job = $('#queue_job').val();
var wdir = $('#work_dir').val();
var loc = window.location.pathname;
var dir =loc.substring(0,loc.lastIndexOf('/'));
var server = "http://snps.biofold.org/";
var outweb = server+"/phd-snpg/www-data/phd-snpg-"+wdir+"/output.txt";
var err_file = server+"/phd-snpg/www-data/phd-snpg-"+wdir+"/"+wdir+".stderr";
var err_file=server+"/phd-snpg/www-data/phd-snpg-"+wdir+"/phd-snpg-"+wdir+".stderr";
//console.log(job,wdir,dir);

if (dir  == '/cgi-bin') {
    //window.history.go(-1);
    //console.log(dir);
    var job_status = function (output) {
	 //console.log(output)
         var vout = output.split("\n")
         var pos = vout[1].split(" ")[2]
         var stat = vout[3].split(" ")[1]
	
         return [pos, stat]
     };
     var rstatus;
     $.ajax( {
        'type': 'get',
	//'data': "njob="+ job + '&wdir=phd-snpg-' + wdir + "&txt=True" ,
	'data': "njob="+ job,
	'url': "/cgi-bin/findjob.cgi",
        'async': false,
        'success': function( result ) {rstatus = result;}
    });
    var data_out = job_status (rstatus);
    //console.log(data_out)
    
    if (data_out[1] == 'Terminated') {
       $.ajax( {
        'type': 'get',
        'data': "njob="+ job + '&wdir=phd-snpg-' + wdir ,
        'url': "/cgi-bin/findjob.cgi",
        'async': false,
        'success': function( result ) {rstatus = result;}
       });
       //console.log(rstatus)
       readTable(); 
    }
    else
    {
       server="http://snps.biofold.org/";
       file_action = "/cgi-bin/findjob.cgi?njob="+job+'&wdir=phd-snpg-'+wdir;
       $("#out_text").html("<p class='text' ><b>Queue Position:</b> "+data_out[0]+"&nbsp;&nbsp;&nbsp;&nbsp;<b>Status:</b> "+data_out[1]+"<br><br>"+
       "<b>Please click the link below.</b> The webpage will be refreshed every 20s:<br><br>"+
       "<a href=\""+file_action+"\">"+file_action+"</a></p>");
    }
    return;
}
else{
    readTable();
    //console.log(job,wdir)
}




//document.getElementById('score').addEventListener('change', readTable(3), false);

function readTable() {
// Read ContrastRank OutputTable

type_input = $('#type_input').val();


// d3.text("output.txt", function(text) {

columns = [
	    { "title": "chrom"},
	    { "title": "pos"},
	    { "title": "ref/alt"},
            { "title": "prediction" },
            { "title": "score" },
            { "title": "fdr"},
	    { "title": "phylop100"},
	    { "title": "avg-phylop100"},
        ];

var getData = function (filename) {
	var data_table = []
	var c = 0
	var filename = $('#load_table').attr("table_data");
	//console.log(filename);
	//var links = d3.tsv.parseRows(filename)
	if (filename != "__table_data__") {
		var links = filename.split("\n");
		for (var i = 1; i <links.length; i++){
			//console.log(links[i])
			//var data = links[i];
			var data = links[i].split("\t")
			rlen=data.length;
			//console.log(rlen,data);
			if (type_input == 'vcf') {
			data_table.push([data[0],data[1],
			data[3]+'/'+data[4],data[rlen-5],
                	data[rlen-4],data[rlen-3],data[rlen-2],data[rlen-1]]);	
			}
			else {
			data_table.push([data[0],data[1],
			data[2]+'/'+data[3],data[4],data[5],
			data[6],data[7],data[8]]);

			}
			c ++
        	}
	};
	//console.log('Table has been read',data_table)
	return  data_table
}

$.ajax({
    //url:outweb,
    type:'HEAD',
    error: function()
    {
        console.log(err_file)
	var err_msg = '<b>ERROR:</b> Prediction output not found. Please check your input data and the <a href=\"'+err_file+'\" target=blank>error file</a>.'
    	$("#out_text").html("<p class='text'><b>JobID: </b>"+wdir+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+err_msg);
    },
    success: function()
    {
	var out_link = "/cgi-bin/findjob.cgi?njob="+job+'&wdir=phd-snpg-'+wdir+'&txt=True';
	var data_table = getData();
	var pred_len = data_table.length;
	if ( pred_len>0 )
	{
	$(document).ready(function() {
	$("#out_text").html("<p class='text' ><b>JobID:</b> "+wdir+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b> Output File:</b>&nbsp;<a href=\""+out_link+" \" target=blank>output.txt</a><br><br><br>");
	$("#vartable").dataTable(
		{"data" : data_table, 
		"columns" :  columns,
		"order": [],
	        "lengthMenu": [[10, 25, 50, 100, -1],
                        [10, 25, 50, 100, "All"]],
		"stripeClasses": [ 'odd-row', 'even-row' ],
		rowCallback: function(row, data, index) {
		     var pred = $(row).find('td:eq(3)')[0].textContent;
		     //console.log(pred);
		     if (pred == "Pathogenic"){
		     $(row).find('td:eq(3)').addClass('pathogenic')
                        }
	             if (pred == "Benign"){
                     $(row).find('td:eq(3)').addClass('benign')
                        }
   		     }
		});
	});
	}
	else
	{
	//console.log(err_file);
	var err_txt = $('#error_msg').val();
	var err_msg = '<b>ERROR:</b> No predictions found in the output file. Please check your input data and the <a href=\"'+err_file+'\" target=blank>error file</a>.'
	$("#out_text").html("<p class='text'><b>JobID: </b>"+wdir+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+err_msg);	
	}
     }
     });


// });

}


}

var main  = function () {
	var job = $('#queue_job').val();
	var wdir = $('#work_dir').val();
	var loc = window.location.pathname;
	var dir =loc.substring(0,loc.lastIndexOf('/'));
    	    
        var job_status = function (output) {
        var vout = output.split("\n")
        var pos = vout[1].split(" ")[2]
        var stat = vout[3].split(" ")[1]
        return [pos, stat]
        };

        var rstatus;
        $.ajax( {
        'type': 'get',
        'data': "njob="+ job,
        'url': "/cgi-bin/findjob.cgi",
        'async': false,
        'success': function( result ) {rstatus = result;}
        });
	 
        var data_out = job_status (rstatus);
	//console.log(data_out)
	if (data_out[1] == "Terminated" ) 
	{
	     drawTable ();
	}
	else if (data_out[0] >= 1 )
	{
	    $(document).ready(function() {
	    server="http://snps.biofold.org/";
       	    file_action = server+"/cgi-bin/findjob.cgi?njob="+job+'&wdir=phd-snpg-'+wdir;
              $("#out_text").html("<p class='text' ><b>Queue Position:</b> "+data_out[0]+"&nbsp;&nbsp;&nbsp;&nbsp;<b>Status:</b> "+data_out[1]+"<br><br>"+
            "<b>Please click the link below.</b> The webpage will be refreshed every 20s:<br><br>"+
            "<b>JobID: </b><a href=\""+file_action+"\">phd-snpg-"+wdir+"</a></p>"); 
	    });
	}
	else 
        {
            console.log(data_out)
        }
}
