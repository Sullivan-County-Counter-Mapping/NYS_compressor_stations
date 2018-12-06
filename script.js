var map = L.map('map', {}).setView([42.4, -76.2], 8);


// Add base layer - mapbox
L.tileLayer('https://api.mapbox.com/styles/v1/data-maps/cjespwfuo2blg2rs4i7712f5g/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGF0YS1tYXBzIiwiYSI6ImNqZWpmeXhoajNtb2Eyd3FldG93OGpxejgifQ.xzOcuUd0LChdzHktllsAHw', {
    maxZoom: 18
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
    apiKey: 'f18cab8055a91a04b4b9953a1f0c8fec11fc547c',
    username: 'mappinghighlandny'
});

// Initialze source data
var source = new carto.source.Dataset('nys_compressor_stations_12_18');

// Create style for the data
var style = new carto.style.CartoCSS(`
  #nys_compressor_stations_12_18 {
  marker-fill-opacity: 0.9;
  marker-line-color: #000000;
  marker-line-width: 0.5;
  marker-line-opacity: 1;
  marker-placement: point;
  marker-type: ellipse;
  marker-width: 13;
  marker-fill: #B40903;
  marker-allow-overlap: true;
}
`);

// Add style to the data
var layer = new carto.layer.Layer(source, style, {
    featureOverColumns: ['name', 'date', 'nysdecid']
});


// Add the data to the map as a layer
client.addLayer(layer);
client.getLeafletLayer().addTo(map);

//addition

layer.on('featureOver', featureEvent => {
    content = `
          <h3>${featureEvent.data.name.toUpperCase()}</h3>
          <p class="open-sans"><medium>NYS DEC permit date:</medium> ${featureEvent.data.date} </p>
          <p>&nbsp;</p>
          <p class="open-sans"><medium>NYS DEC facility ID:</medium> ${featureEvent.data.nysdecid} </p>
        
        `;

    document.getElementById('info').innerHTML = content;
    featureVisible = true;
});

layer.on('featureOut', featureEvent => {
    hideInfo();
});

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

hideInfo = debounce(function() {
    document.getElementById('info').innerHTML = '';
}, 500);