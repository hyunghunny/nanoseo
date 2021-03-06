$(function () {

  var firstDayOfThisMonth = new Date(baseDay).setDate(1);
  var firstDayOfLastMonth = new Date(baseDay).setMonth(baseDay.getMonth()-1, 1); // -1 means the last month

  var thisMonth = [];
  var thisMonth_total = [];

  if(dateFormatter(new Date(firstDayOfLastMonth)) != dateFormatter(baseDay)){
    console.log("The baseDay is NOT the fitst day of the month")
    thisMonth_query = 'api/labs/ux/energy/daily.json?day_from=' + dateFormatter(new Date(firstDayOfThisMonth)) + '&day_to=' + dateFormatter(shiftDate(baseDay, -1)) + '&offset=0';
  } else {
    console.log("The baseDay is the FIRST day of the month")
    thisMonth_query = 'api/labs/ux/energy/daily.json?day_from=' + dateFormatter(shiftDate(baseDay, 0)) + '&day_to=' + dateFormatter(shiftDate(baseDay, 0)) + '&offset=0';
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

    console.log(thisMonth_total);
    console.log(thisMonth_total.reduce(add, 0) * 0.32);

    function add(a, b) {
        return a + b;
    }

    var thisMonth_prediction = (thisMonth_total.reduce(add, 0) * 0.32) + (leftDay * dayAvg * 0.32);
    console.log(thisMonth_prediction);

    xAxis_categories = ['03.01~03.25','이번 달 예상']

    ceil_value  = Math.ceil(thisMonth_prediction/100)*100;
    floor_value = Math.floor(thisMonth_prediction/100)*100;

    if(ceil_value - thisMonth_prediction < 50){
      line_y = ceil_value
    } else {
      line_y = floor_value
    }

    stage = Math.ceil(ceil_value/100);

    console.log(stage);

    console.log(calcPrice(stage, 20))

    var chart_month = $('#ux_month').highcharts({
      legend: {
        enabled: false
      },
      chart: {
          type: 'column',
          // type: 'bar'
          height: 250
      },
      title: {
         text: ''
     },
      credits: {
          enabled: false
      },
      exporting: {
          enabled: false
      },
      xAxis: {
          categories: xAxis_categories,
          tickColor: 'rgba(0, 0, 0, 0)'
      },
      yAxis: {
          type: 'bar',
          gridLineWidth: 0,
          //opposite: true,
          title: {
              text: 'kW/h'
          },
          stackLabels: {
              enabled: true,
              style: {
                  fontWeight: 'bold',
                  color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
              }
          },
          plotLines: [{
                    value: line_y,
                    color: 'red',
                    dashStyle: 'solid',
                    width: 2,
                    label: {
                        //text: 'Last quarter maximum'
                    }
                }]
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
            maxPointWidth: 50,
            colorByPoint: true,
            colors: ['#BDD7EE','#5B9BD5']
          }
      },
      series: [{
          data: [Math.round(thisMonth_total.reduce(add, 0) * 0.32), Math.round(thisMonth_prediction)],
          pointWidth: 120
      }]
    });
    $('#seller_text_prediction').prepend('누진 '+'<font color="red">'+stage+'</font>'+'단계를 넘기지 않을 것으로 예상');
    $('#seller_text_predictionValue').prepend(Math.round(thisMonth_prediction)-Math.round(thisMonth_total.reduce(add, 0) * 0.32)+'kWh 여유');
  }
});
