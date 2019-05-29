
Chart.defaults.global.defaultFontColor = 'black';
Chart.defaults.global.defaultFontSize = '11';
function makeGraph(keys,dataSets,start,end){
    console.log(start)
    if(myChart)
        myChart.destroy()
        
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: keys,
            datasets: dataSets
        },
        options: {
            scales: {
                xAxes: [{
                    stacked: true,
                    ticks: {
                        max: 1,       
                        maxRotation: 0,
                        minRotation: 0,
                        autoSkip: false
                    }
                }],
                yAxes: [{
                    stacked: true,
                    ticks: { 
                        min: parseFloat(start),
                        max: parseFloat(end),
                        maxRotation: 0,
                        minRotation: 0
                    }
                }]
            },
            legend: {
                display: false,
                labels: {
                    fontColor: 'white'
                }
            },
            tooltips: {
                callbacks: {
                   label: function(tooltipItem) {
                          return tooltipItem.yLabel;
                   }
                }
            }
            
        }
    });
    
   
}



