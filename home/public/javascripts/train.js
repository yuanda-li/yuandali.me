console.log('log');
$(document).ready(function() {
    console.log('ready');
});

$("#submitButton").on('click', function() {
    var line = $("select option:selected").text();
    var lat = $("#latInput").val();
    var lng = $("#lngInput").val()
    var data = {
        'line': line,
        'lat': lat,
        'lng': lng,
    }
    console.log("Line:", line);
    console.log("Lat:", lat);
    console.log("Lng:", lng);

    $.ajax({
        method: "GET",
        url: "/train/test",
        contentType: "json",
        data: data,
        success: function(result) {
            console.log(result);
            console.log('success');
            $("#info").empty();
            parseResult(result);
        },
        error: function(result) {
            console.log(result);
            console.log('error');
        },
        complete: function(result) {
            console.log('complete');
        }
    });
});

function parseResult(data) {
    console.log('Parsing data');
    console.log("data['info']:", data['info']);
    if (data['info'] == false) {
        $("#info").append("<div>New train added.</div>");
    } else {
        $("#info").append("<div>Existing train. Info updated.</div>");
    }
    $("#info").append("<div>Line:" + data['data']['Line'] + "</div>");
    for (var i = 0; i < data['data']['Trains'].length; i++) {
        var str = "<div>- Lat:" + data['data']['Trains'][i]['Location']['Lat']
                            + ", Lng:" + data['data']['Trains'][i]['Location']['Lng'] + "</div>"
        $("#info").append(str);
    }
    console.log('Parsing data completed.');
}
