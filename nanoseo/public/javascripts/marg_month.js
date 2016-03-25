$(function () {
  var firstDayOfThisMonth = new Date(baseDay).setDate(1);
  var firstDayOfLastMonth = new Date(baseDay).setMonth(baseDay.getMonth()-1, 1); // -1 means the last month
  var  lastDayOfLastMonth = shiftDate(firstDayOfThisMonth, -1);

  var xAxis_categories = [(new Date(firstDayOfLastMonth).getMonth()+1) + '월',
                          (new Date(firstDayOfThisMonth).getMonth()+1) + '월'];

  var lastMonth = [];
  var thisMonth = [];

  var lastMonth_loading = false;
  var thisMonth_loading = false;

  var lastMonth_total = [];
  var thisMonth_total = [];

  var savingRate_Month;

  lastMonth_query = 'api/labs/marg/energy/daily.json?day_from=' + dateFormatter(new Date(firstDayOfLastMonth)) + '&day_to=' + dateFormatter(new Date(lastDayOfLastMonth)) + '&offset=0';

  if(dateFormatter(new Date(firstDayOfLastMonth)) != dateFormatter(baseDay)){
    console.log("The baseDay is NOT the fitst day of the month")
    thisMonth_query = 'api/labs/marg/energy/daily.json?day_from=' + dateFormatter(new Date(firstDayOfThisMonth)) + '&day_to=' + dateFormatter(shiftDate(baseDay, -1)) + '&offset=0';
  } else {
    console.log("The baseDay is the FIRST day of the month")
    thisMonth_query = 'api/labs/marg/energy/daily.json?day_from=' + dateFormatter(shiftDate(baseDay, 0)) + '&day_to=' + dateFormatter(shiftDate(baseDay, 0)) + '&offset=0';
  }

    // console.log("firstDayOfThisMonth", dateFormatter(new Date(firstDayOfLastMonth)));
    // console.log("baseDay", dateFormatter(baseDay));

  console.log(lastMonth_query);
  console.log(thisMonth_query);

  invokeOpenAPI(lastMonth_query, lastMonthCB);
  invokeOpenAPI(thisMonth_query, thisMonthCB);

  function lastMonthCB(lastMonth_) {
    lastMonth = lastMonth_;
    lastMonth_loading = true;

    for(var index = 0; index < lastMonth.length; index++){
      total = lastMonth[index].sum;
      lastMonth_total.push(Number(total.toFixed(1)));
    }
    if (thisMonth_loading){
      drawChart();
    }
  }

  function thisMonthCB(thisMonth_) {
    thisMonth = thisMonth_;
    thisMonth_loading = true;

    for(var index = 0; index < thisMonth.length; index++){
          total = thisMonth[index].sum;
          thisMonth_total.push(Number(total.toFixed(1)));
      }
      if (lastMonth_loading){
        drawChart();
      }
  }

  function drawChart(){
    savingRate_Month = ((arrayMean(thisMonth_total) / arrayMean(lastMonth_total)));


    console.log(thisMonth);

    var sign="";
    if (savingRate_Month>=1) {
      sign="+";
    }else {
      sig="-";
    }
    // new dashboard를 위한
    // var title=$("<div>").attr("id","acc_point_title").css({"float": "left","clear":"none","font-size": "18px","font-weight": "bolder","text-align": "center", "padding-top": "5px", "padding-left": "900px", "text-shadow":"1px 1px 5px #A0A0A0"}).text("MARG Electricity Usage Monitor").css('color','black');
    // var titlediv=$("<div>").attr("id","acc_point_title2").css({"float": "right","clear":"none","font-size": "18px","text-align": "right","font-weight": "bolder", "padding-right": "5px", "padding-top": "5px", "text-shadow":"1px 1px 5px #A0A0A0"}).text(year+"."+month+day+dayOfWeek+ampm+hours+":"+minutes+":"+seconds).css('color','black');
    // $('#acc_points').prepend(acc_point_title2).prepend(acc_point_title);
    //

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
         text: '[ 지난달과 이번달 (' +sign+ (savingRate_Month*100 - 100).toFixed(1) + '%) ]',
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
          categories: xAxis_categories
      },
      yAxis: {
          // min: 0.00001,
          // type: 'logarithmic',
          type: 'bar',
          // minorTickInterval: '0.0001',
          // breaks: [{
          //       from: 0,
          //       to: 60,
          //       breakSize: 20
          //   }],
          opposite: true,
          title: {
              text: '하루 평균 사용량 (kW/h)'
          },
          stackLabels: {
              enabled: true,
              style: {
                  fontWeight: 'bold',
                  color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
              }
          }
          // ,
          // labels: {
          //   formatter: function() {
          //       if(this.value === 0.00001){
          //           return 0;
          //       } else {
          //           return this.value;
          //       }
          //   }
          // }

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
          // bar: {
          //   dataLabels: {
          //     enabled: true
          //   }
          // },
          series: {
            colorByPoint: true,
            colors: ['#bed1d4','#9ab0b4']
          }
      },
      series: [{
          //name: '전체사용량',
          data: [arrayMean(lastMonth_total), arrayMean(thisMonth_total)],
          pointWidth: 120
      }]
    });


  }
});
