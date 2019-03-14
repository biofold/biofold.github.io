function drawAccuracy () {

//document.getElementById('score').addEventListener('change', readTable(3), false);

readAccuracy();

function readAccuracy() {
// Read ContrastRank OutputTable

var filename = "pages/data/performance_table.tsv";
//console.log(filename);

d3.tsv(filename, function(links) {

columns = [
	    { "title": "Dataset"},
	    { "title": "SNVs"},
	    { "title": "ACC"},
            { "title": "TPR" },
            { "title": "PPV" },
            { "title": "TNR"},
	    { "title": "NPV"},
	    { "title": "MCC"},
	    { "title": "AUC"},
        ];

//console.log(columns)
var getData = function () {
	var data_table = []
	var c = 0
	for (var i = 0; i <links.length; i++){
		//console.log(links[i])
		data_table.push([links[i].Dataset,links[i].SNVs,
		links[i].Acc,links[i].TPR,
		links[i].PPV,links[i].TNR,links[i].NPV,
		links[i].MCC,links[i].AUC]);
		c ++
        }
	//console.log('Table has been read',data_table)
	return  data_table
}

var data_table = getData();
//console.log(data_table)

$(document).ready(function() {
$("#acctable").dataTable(
		{"data" : data_table,
		 "columnDefs": [
                 { className: "dt-body-left dt-head-center", "targets": [ 0 ] },
		 { className: "dt-head-center", "targets": [ 1 ] },
		 { className: "dt-head-center", "targets": [ 2 ] },
		 { className: "dt-head-center", "targets": [ 3 ] },
		 { className: "dt-head-center", "targets": [ 4 ] },
		 { className: "dt-head-center", "targets": [ 5 ] },
		 { className: "dt-head-center", "targets": [ 6 ] },
		 { className: "dt-head-center", "targets": [ 7 ] },
		 { className: "dt-head-center", "targets": [ 8 ] }
                 ],
		 "columns" :  columns,
		 "bFilter": false, "bInfo": false,
		 "paging":   false,
		 "sort": false,
		 "order": [],
		 "stripeClasses": [ 'odd-row', 'even-row' ]
		});
	});
});

}

}
