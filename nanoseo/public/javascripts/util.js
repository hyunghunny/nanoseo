
function invokeOpenAPI(url, scb) {
    $.ajax({
        url : 'http://adsl.snu.ac.kr' + url,
        type : "get",
        dataType : "json",
        success : function (data) {
            //console.log('retrieve success:' + data);
            scb(data)
        },
        error : function (request) {
            console.log("failed to retrieve:" + request);
        }
    });
}
