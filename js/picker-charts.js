google.load('visualization', '1.0', {'packages':['gauge']});

google.setOnLoadCallback(drawChart);

function drawChart(arg) {
			var data = google.visualization.arrayToDataTable([
				["Label", "Value"],
				["Match", parseFloat(state.greens[arg].score.toFixed(0))]
			]);
			
			var options = {
				redFrom: 90, redTo: 100,
				yellowFrom: 75, yellowTo: 90,
				minorTicks: 5
			};
			
			var chart = new google.visualization.Gauge(document.getElementById("chart-div"));
			chart.draw(data, options);
};