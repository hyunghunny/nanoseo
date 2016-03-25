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

    // console.log(thisMonth_total);
    // console.log(thisMonth_total.reduce(add, 0) * 0.45);

    function add(a, b) {
        return a + b;
    }

    var thisMonth_prediction = (thisMonth_total.reduce(add, 0) * 0.32) + (leftDay * dayAvg * 0.32);
    console.log(thisMonth_prediction);

  }
});
