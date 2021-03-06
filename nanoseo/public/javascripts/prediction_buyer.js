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

    console.log(thisMonth_total);
    console.log(thisMonth_total.reduce(add, 0) * 0.3);

    function add(a, b) {
        return a + b;
    }

    thisMonth_prediction = (thisMonth_total.reduce(add, 0) * 0.3) + (leftDay * dayAvg * 0.3);
    // console.log(thisMonth_prediction);

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

    window.updateComplete(stage, thisMonth_prediction, thisMonth_total);

  }
});
