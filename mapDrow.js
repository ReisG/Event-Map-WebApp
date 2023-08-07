var map = L.map('map').setView([53.354675, 83.740977], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


var sanitizeHTML = function (str) {
	var temp = document.createElement('div');
	temp.textContent = str;
	return temp.innerHTML;
};

function moreInfo(eventId)
{
    var data = {
        "web_app_name" : "event_map",
        "chosen_event_id" : sanitizeHTML(eventId),
    };
    tg.sendData(JSON.stringify(data));
    tg.close();
}

function drawEvent(event)
{
    var marker = L.marker([Number(event.latitude), Number(event.longitude)]).addTo(map);
    let start_time = Date(Number(event.start_time));
    let end_time = Date(Number(event.end_time));
    let start_time_string = start_time.getHours() + ":" + start_time.setMinutes() + " " + start_time.getDate() + "/" + start_time.getMonth() + "/" + start_time.getFullYear();
    let end_time_string = end_time.getHours() + ":" + end_time.setMinutes() + " " + end_time.getDate() + "/" + end_time.getMonth() + "/" + end_time.getFullYear();
    marker.bindPopup(
        "<b>" + sanitizeHTML(event.name) + "</b><br>"
        + "Организатор: " + sanitizeHTML(event.creator_name) + "<br>" 
        + "Начало: " + start_time_string + "<br>"
        + "Конец: " + end_time_string + "<br>"
        + "<button onclick='moreInfo("+sanitizeHTML(event.id)+")'>Подробнее</button>"
    )
}

let params = new URLSearchParams(location.search);
var dataGot = params.get("data");
var parsedDataGot = JSON.parse(dataGot);
for (var i in parsedDataGot)
{
    drawEvent(parsedDataGot[i]);
}

/*
Query Example:
https://..?data={%22N1%22:{%22name%22:%22Hello%22,%20%22latitude%22:%2253.354675%22,%20%22longitude%22:%2283.740977%22,%20%22creator_name%22:%22Bob%22,%20%22start_time%22:%221%22,%20%22end_time%22:%221%22,%20%22id%22:1}}
*/
