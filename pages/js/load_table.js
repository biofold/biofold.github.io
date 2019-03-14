function drawTable () {

readTable();
//document.getElementById('score').addEventListener('change', readTable(3), false);

function readTable() {
// Read ContrastRank OutputTable

var filename = "output.txt";
d3.tsv.parse(filename, function(links) {

columns = [
	    { "title": "chrom"},
	    { "title": "pos"},
	    { "title": "ref/alt"},
            { "title": "prediction" },
            { "title": "score" },
            { "title": "fdr"},
	    { "title": "1-npv"},
	    { "title": "phylop100"},
	    { "title": "avg-phylop100"},
        ];

var getData = function () {
	var data_table = []
	var c = 0
	for (var i = 0; i <links.length; i++){
		//console.log(links[i])
		data_table.push([links[i].CHROM,links[i].POS,
		links[i].REF+"/"+links[i].ALT,links[i].PREDICTION,
		links[i].SCORE,links[i].FDR,links[i].CNPV,
		links[i].PhyloP100,links[i].AvgPhyloP100]);
		c ++
        }
	console.log('Table has been read',data_table)
	return  data_table
}

var data_table = getData()


$(document).ready(function() {
$("#vartable").dataTable(
		{"data" : data_table, 
		"columns" :  columns,
		"order": [],
	        "lengthMenu": [[10, 25, 50, 100, -1],
                        [10, 25, 50, 100, "All"]],
		"stripeClasses": [ 'odd-row', 'even-row' ]
		});
	});
});

}


}
