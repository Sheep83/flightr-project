var PieChart = function(title, data){
  var container = document.getElementById("pieChart");

  var chart = new Highcharts.Chart({
    chart: {
      backgroundColor: null,
      type: 'pie',
      renderTo: container
    },
    title: { 
      text: title 
    },
    series: [
    {
      data: data
    }
    ]
  });
}