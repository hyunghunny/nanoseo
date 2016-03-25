$(function () {

  var firstDayOfThisMonth = new Date(baseDay).setDate(1);
  var firstDayOfLastMonth = new Date(baseDay).setMonth(baseDay.getMonth()-1, 1); // -1 means the last month

  var thisMonth = [];
  var thisMonth_total = [];

  if(dateFormatter(new Date(firstDayOfLastMonth)) != dateFormatter(baseDay)){
    console.log("The baseDay is NOT the fitst day of the month")
    thisMonth_query = 'api/labs/hcc/energy/daily.json?day_from=' + dateFormatter(new Date(firstDayOfThisMonth)) + '&day_to=' + dateFormatter(shiftDate(baseDay, -1)) + '&offset=0';
  } else {
    console.log("The baseDay is the FIRST day of the month")
    thisMonth_query = 'api/labs/hcc/energy/daily.json?day_from=' + dateFormatter(shiftDate(baseDay, 0)) + '&day_to=' + dateFormatter(shiftDate(baseDay, 0)) + '&offset=0';
  }

  console.log(thisMonth_query);

  invokeOpenAPI(thisMonth_query, thisMonthCB);

  function thisMonthCB(thisMonth_) {
    thisMonth = thisMonth_;
    thisMonth_loading = true;

    for(var index = 0; index < thisMonth.length; index++){
          total = thisMonth[index].sum;
          thisMonth_total.push(Number(total.toFixed(1)));
      }
      showText();
  }

  function showText(){

    var dayAvg = arrayMean(thisMonth_total);
    var leftDay = 31 - baseDay.getDate();

    // console.log(thisMonth_total);
    // console.log(thisMonth_total.reduce(add, 0) * 0.25);

    function add(a, b) {
        return a + b;
    }

    var thisMonth_prediction = (thisMonth_total.reduce(add, 0) * 0.3) + (leftDay * dayAvg * 0.3);
    // console.log((thisMonth_prediction));
    // console.log(Math.ceil(thisMonth_prediction/100)*100);
    // console.log(Math.floor(thisMonth_prediction/100)*100);

    ceil_value  = Math.ceil(thisMonth_prediction/100)*100;
    floor_value = Math.floor(thisMonth_prediction/100)*100;

    if(ceil_value - thisMonth_prediction < 50){
      line_y = ceil_value
    } else {
      line_y = floor_value
    }

    // console.log(line_y)

    stage = Math.ceil(ceil_value/100);

    console.log(stage);

    console.log(calcPrice(stage, 20))

    var chart_month = $('#marg_month').highcharts({
      legend: {
        enabled: false
      },
      chart: {
          type: 'column'
          // type: 'bar'
      },
      title: {
         useHTML: true,
         text: '[ 지난달과 이번달 ]',
         style: {
           color: '#FFFFFF',
           fontWeight: 'bold',
           'background-color': '#8E8989',
           'border-radius': '6px',
           border: '4px solid #8E8989'
         }
     },
      credits: {
          enabled: false
      },
      exporting: {
          enabled: false
      },
      xAxis: {
          //categories: xAxis_categories
      },
      yAxis: {
          type: 'bar',
          opposite: true,
          title: {
              text: '사용량 (kW/h)'
          },
          stackLabels: {
              enabled: true,
              style: {
                  fontWeight: 'bold',
                  color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
              }
          }
      },
      tooltip: {
          headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
          column: {
              stacking: 'normal',
              dataLabels: {
                  enabled: false,
                  color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                  style: {
                      textShadow: '0 0 3px black'
                  }
              },
          },
          series: {
            colorByPoint: true,
            colors: ['#bed1d4','#9ab0b4']
          }
      },
      series: [{
          data: [thisMonth_total.reduce(add, 0) * 0.25, thisMonth_prediction],
          pointWidth: 120
      }]
    });
  }
});
