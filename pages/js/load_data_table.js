function drawTable () {

var job = $('#queue_job').val();
var wdir = $('#work_dir').val();
var loc = window.location.pathname;
var dir =loc.substring(0,loc.lastIndexOf('/'));
var server = "http://snps.biofold.org/";
var outweb = server+"/cgi-bin/findjob.cgi?njob="+job+"&wdir=phd-snpg-"+wdir;
var err_file = server+"/phd-snpg/www-data/phd-snpg-"+wdir+"/"+wdir+".stderr";
var err_file=server+"/phd-snpg/www-data/phd-snpg-"+wdir+"/phd-snpg-"+wdir+".stderr";
var uniprot='http://www.uniprot.org/uniprot'
var hgnc='http://www.genenames.org/cgi-bin/gene_symbol_report';
var nuccore='http://www.ncbi.nlm.nih.gov/nuccore/';

function addNewlines(str) {  
	var result = '';  
	while (str.length > 0) {    
	result += str.substring(0, 50) + '<br>';    
	str = str.substring(50);  }  
	return result;
}

readTable();





//document.getElementById('score').addEventListener('change', readTable(3), false);

function readTable() {
// Read ContrastRank OutputTable

type_input = $('#type_input').val();
// Added for annotation process
type_input = 'vcf';

// d3.text("output.txt", function(text) {

columns = [
	    {
                "className": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": ''
		
            },
	    { "title": "chrom"},
	    { "title": "pos"},
	    { "title": "ref/alt"},
	    { "title": "coding"},
            { "title": "prediction" },
            { "title": "score" },
            { "title": "fdr"},
	    { "title": "phylop100"},
	    { "title": "avg-phylop100"},
        ];

var getData = function (filename) {
	var c = 0
	var filename = $('#load_table').attr("table_data");
	//console.log(filename);
	//var links = d3.tsv.parseRows(filename)
	if (filename != "__table_data__") {
		var data_table = []
		var links = filename.split("\n");
		for (var i = 1; i <links.length; i++){
			//console.log(links[i])
			//var data = links[i];
			var data = links[i].split("\t")
			rlen=data.length;
			//console.log(rlen,data);
			if (type_input == 'vcf') {
			//Added for annotation
			data_table.push(['',data[0],data[1],
			data[3]+'/'+data[4],data[5],data[rlen-11],
                	data[rlen-10],data[rlen-9],data[rlen-8],data[rlen-7],
			data[rlen-6],data[rlen-5],data[rlen-4],data[rlen-3]]);
			}
			else {
			data_table.push(['',data[0],data[1],
			data[2]+'/'+data[3],data[4],data[5],
			data[6],data[7],data[8],data[9]]);

			}
			c ++
        	}
	};
	//console.log('Table has been read',data_table)
	return  data_table
}

$.ajax({
    url:outweb,
    type:'HEAD',
    error: function()
    {
        console.log(err_file)
	var err_msg = '<b>ERROR:</b> Prediction output not found. Please check your input data and the <a href=\"'+err_file+'\" target=blank>error file</a>.'
    	$("#out_text").html("<p class='text'><b>JobID: </b>"+wdir+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+err_msg);
    },
    success: function()
    {
	var out_link = "/cgi-bin/findjob.cgi?njob="+job+'&wdir=phd-snpg-'+wdir;
	var data_table = getData();
	
	if (data_table == null) {
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
		server="http://snps.biofold.org/";
	        file_action = server+"/cgi-bin/findjob.cgi?njob="+job+'&wdir=phd-snpg-'+wdir;
                $("#out_text").html("<p class='text' ><b>Queue Position:</b> "+data_out[0]+"&nbsp;&nbsp;&nbsp;&nbsp;<b>Status:</b> "+data_out[1]+"<br><br>"+
                "<b>Please click the link below.</b> The webpage will be refreshed every 20s:<br><br>"+
                "<b>JobID: </b><a href=\""+file_action+"\">phd-snpg-"+wdir+"</a></p>");		
	}
	else
        {
	var pred_len = data_table.length;
	//console.log(data_table,out_link)
	if ( pred_len>0 )
	{
	
	function format ( d ) {
		var trans = d[10];
		var gene = d[11];
		var strand = d[12];
		var reg = d[13].split('/')
		if (trans == '.') {
			trans = "None"
		}
		else {
			var vtrans = trans.split(' ');
			trans = '<a href="'+nuccore+'/?term='+vtrans[0]+'" target=blank>'+trans+'</a>'
		}
		if (gene == '.') {
			lgene = "None"
		}
		else {
			/*
 			var swiss = $.ajax({
      			url: uniprot+'/?query=organism:9606+AND+gene:'+gene+'&limit=1&format=list',
      			crossDomain: true,
	      		dataType: 'jsonp',
			success: function(response){
                	console.log(response);
			}
			});
			*/
			var swiss = $.ajax({
                	url: uniprot+'/?query=organism:9606+AND+gene:'+gene+'&limit=1&format=list',
                	async: false,
			});
			console.log(swiss)
                	//}).responseText.trim();
			// new search
			uni_url = uniprot+'/?query=organism:9606+AND+gene:'+gene+'&limit=1';
			if (swiss != "" ) {
			var lgene = '<a href="'+uni_url+'" target=blank>'+gene+'</a>';
                	//var lgene = '<a href="'+uniprot+'/'+swiss+'" target=blank>'+gene+'(UniProt:'+swiss+')</a>'
                	}
			else {
			lgene = "None";
			}
		//var lgene = '<a href="'+hgnc+'?match='+gene+'" target=blank>'+gene+'</a>'
		}
	
		if (strand == '.') {strand = "None"}
		for (var i = 0; i <reg.length; i++){ 
			if (reg[i] == '.') {reg[i] = "None"}
		}

		
    		return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        	'<tr >'+            
		'<td class="vertical"><div class="child_title">Transcript:</div></td>'+
            	'<td class="vertical"><div class="child_seq">'+trans+'</div></td>'+
        	'</tr>'+        
		'<tr>'+
            	'<td class="vertical"><div class="child_title">Gene:</div></td>'+
            	'<td class="vertical"><div class="child_seq">'+lgene+'</div></td>'+        
		'</tr>'+
        	'<tr>'+            
		'<td class="vertical"><div class="child_title">Strand:</div></td>'+
            	'<td class="vertical"><div class="child_seq">'+strand+'</div></td>'+
        	'</tr>'+
        	'<tr>'+
            	'<td class="vertical"><div class="child_title">Region:</div></td>'+
            	'<td class="vertical"><div class="child_seq">'+reg.join(' - ')+'</div></td>'+
        	'</tr>'+
	        '</table>';
        }


	$(document).ready(function() {
	$("#out_text").html("<p class='text' ><b>JobID:</b> "+wdir+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b> Output File:</b>&nbsp;<a href=\""+out_link+"&txt=True \" target=blank>output.txt</a><br><br><br>");
	var oTable = $("#vartable").dataTable(
		{"data" : data_table,
		 "columnDefs": [ 
		 { className:  "dt-head-center", "targets": [ 0 ] },
                 { className: "dt-head-center", "targets": [ 1 ] },
                 { className: "dt-head-center", "targets": [ 2 ] },
                 { className: "dt-head-center", "targets": [ 3 ] },
                 { className: "dt-head-center", "targets": [ 4 ] },
                 { className: "dt-head-center", "targets": [ 5 ] },
                 { className: "dt-head-center", "targets": [ 6 ] },
                 { className: "dt-head-center", "targets": [ 7 ] },
		 { className: "dt-head-center", "targets": [ 8 ] },
                 { className: "dt-head-center", "targets": [ 9 ] }
                 ], 
		"columns" :  columns,
		"order": [],
	        "lengthMenu": [[10, 25, 50, 100, -1],
                        [10, 25, 50, 100, "All"]],
		"stripeClasses": [ 'odd-row', 'even-row' ],
		rowCallback: function(row, data, index) {
		     var pred = $(row).find('td:eq(5)')[0].textContent;
		     console.log(pred);
		     if (pred == "Pathogenic"){
		     $(row).find('td:eq(5)').addClass('pathogenic')
                        }
	             if (pred == "Benign"){
                     $(row).find('td:eq(5)').addClass('benign')
                        }
   		     }
		});

	   $('#vartable tbody').on('click', 'td.details-control', function () {
		var tr = $(this).closest('tr');
		//console.log(oTable.api().row( tr ))
	        var row = oTable.api().row( tr );

        	if ( row.child.isShown() ) {
            	row.child.hide();
            	tr.removeClass('shown');
        	}
        	else {
            	//console.log(row.data())
             	row.child( format(row.data()) ).show();
             	tr.addClass('shown');
            	}
            	});

	});
	}
	else
	{
	//console.log(err_file);
	//var err_txt = $('#error_msg').val();
	var err_txt = '/cgi-bin/findjob.cgi?njob='+job+'&wdir=phd-snpg-'+wdir+'&txt=True'
	var spx = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	var err_msg = '<b>ERROR:</b> No predictions found in the output file. Please check your input data and the <a href=\"'+err_txt+'\" target=blank>error file</a>.'
	$("#out_text").html("<p class='text'><table><tr><td><b>JobID: </b>"+wdir+spx+"</td><td>"+err_msg+"</td></tr></table>");	
	}
     }
     }
     });


// });

}
}

var main  = function () {
	var job = $('#queue_job').val();
	var wdir = $('#work_dir').val();
	//console.log(job,wdir)
	var loc = window.location.pathname;
	var dir =loc.substring(0,loc.lastIndexOf('/'));
    	
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
        'data': "njob="+ job,
        'url': "/cgi-bin/findjob.cgi",
        'async': false,
        'success': function( result ) {rstatus = result;}
        });
	 
        var data_out = job_status (rstatus);
	//console.log(data_out)
	if (data_out[1] == "Terminated" || data_out[1] == "Unknown") 
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
