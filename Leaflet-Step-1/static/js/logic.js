var myMap = L.map("map").setView([37.8, -96], 4);

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY,
  }
).addTo(myMap);

// Store our API endpoint inside queryUrl
var queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl, (data) => {
  data.features.forEach((obj) => {
    var lat = obj.geometry.coordinates[1];
    var lng = obj.geometry.coordinates[0];
    var mag = obj.properties.mag;
    var place = obj.properties.place;

    L.circle([lat, lng], {
      stroke: "black",
      fillOpacity: 1,
      color: "black",
      fillColor: getColor(mag),
      radius: mag * 50000,
    })
      .bindPopup(`<h2>${place}<br>Magnitude: ${mag}</h2>`)
      .addTo(myMap);
  });
});

function getColor(magnitude) {
  switch (true) {
    case magnitude > 5:
      return "#d7191c";

    case magnitude > 4:
      return "#e76818";

    case magnitude > 3:
      return "#f29e2e";

    case magnitude > 2:
      return "#f9d057";

    case magnitude > 1:
      return "#90eb9d";

    case magnitude > 0:
      return "#00ccbc";
  }
}

// Adds Legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");
  grades = [0, 1, 2, 3, 4, 5];
  labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
  var color = [
    "#00ccbc",
    "#90eb9d",
    "#f9d057",
    "#f29e2e",
    "#e76818",
    "#d7191c",
  ];

  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' +
      color[i] +
      '">' +
      grades[i] +
      (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+") +
      "</i>";
  }

  div.innerHTML += `<style>
                          .legend {
                            background: black;
                            border: 2px solid white;
                            padding: 4px;
                        }
                      </style>`;

  return div;
};
legend.addTo(myMap);
