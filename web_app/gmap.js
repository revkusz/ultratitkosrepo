var map;
var markers = [];
var heatmapData = [];
var heatmap;
var popup, Popup;
var popupArray = [];
var fetchMarker;
var fetchResult;
var icons = {
    video: {
        icon: 'https://maps.google.com/mapfiles/kml/shapes/'
    }
};
var camMarker = [];



function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 60.1670237, lng: 24.9400336},
        zoom: 14,
        disableDefaultUI: true,
        styles: [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#212121"
                    }
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#212121"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#bdbdbd"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#181818"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#1b1b1b"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#2c2c2c"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#8a8a8a"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#373737"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#3c3c3c"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#4e4e4e"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#3d3d3d"
                    }
                ]
            }
        ]
    });
    console.log('elé');
}

//On load
onLoad = async function() {
    //await getData(url);
   markersLoad();
    cam();
}
window.onload = onLoad;

//Heatmap
heatmapLoad = function() {


}

//Color heat
function colorHeath() {
    var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
    ]

    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
    heatmap.set('radius',  0.008);
}


//Markers
cam = function() {
    webcam.forEach(element => {
        var latLng = new google.maps.LatLng(element.lat,element.lon);

        console.log('ketto');
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            icon: 'http://maps.google.com/mapfiles/kml/paddle/go.png',
            type: 'video'

        })
        camMarker.push(marker);
        markers.push(marker);
    });

    for (let i=0; i<camMarker.length;i++) {
        google.maps.event.addDomListener(camMarker[i], 'click', function () {
            console.log("asd");
        })
    }

};



markersLoad = function (listener) {

    let stationInfo = getStationInfo();
    stationInfo.then(data => {
        let rawData = getRawData();
        rawData.then(peopledata => {
            fetchMarker = {};
            for (var i = 0; i < data.length; i++) {


                Popup = createPopupClass();
                //console.log(data[i]);
                const x = peopledata[i].avg;
                heatmapData.push({location: new google.maps.LatLng(data[i].latitude,data[i].longitude),weight: x});
                var latLng = new google.maps.LatLng(data[i].latitude,data[i].longitude);
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    label: Math.round(parseFloat(peopledata[i].avg)).toString(),
                });
                data[i].marker = marker;
                fetchMarker[data[i].serial] = data[i];
                var random = document.createElement('div',);
                var content = document.createTextNode("");
                random.appendChild(content);
                random.style.visibility='true';
                random.innerHTML="<div class='popup-own'><span>"+data[i].country+" "+data[i].address+
                    "</span><br>"+data[i].description+"</div>";
                random.style.display='none';
                popup = new Popup(
                    new google.maps.LatLng(data[i].latitude, data[i].longitude),
                    random);
                popup.setMap(map);
                markers.push(marker);
                popupArray.push({'marker': marker,'popup': random});
            }
            for (let i=0; i<popupArray.length;i++) {
                google.maps.event.addDomListener(popupArray[i].marker, 'click', function () {
                    popupArray[i].popup.setAttribute("style", "display:block");
                    //console.log("sajt2");
                })
                google.maps.event.addDomListener(popupArray[i].popup, 'click', function () {
                    //console.log("sajt");
                    popupArray[i].popup.setAttribute("style", "display:none");
                })
            }
            //console.log(fetchResult);
            heatmap = new google.maps.visualization.HeatmapLayer({
                data: heatmapData,
                dissipating: false,
                map: map,
            });

            colorHeath();
        });

    });
}

function updateheatmap() {
    let data = getRawData(daynum,time,weathernum);
    data.then(newdata => {

        heatmapData = [];

        newdata.forEach(element =>{
            const x = element.avg;
            fetchMarker[element.serial].marker.setLabel( Math.round(parseFloat(element.avg)).toString());
            //console.log(fetchMarker[element.serial].marker);
            heatmapData.push({location: new google.maps.LatLng(fetchMarker[element.serial].latitude,fetchMarker[element.serial].longitude),weight: x});
        } );
        heatmap.setData( heatmapData);

    });

}

function createPopupClass() {
    /**
     * A customized popup on the map.
     * @param {!google.maps.LatLng} position
     * @param {!Element} content The bubble div.
     * @constructor
     * @extends {google.maps.OverlayView}
     */
    function Popup(position, content) {
        this.position = position;

        content.classList.add('popup-bubble');

        // This zero-height div is positioned at the bottom of the bubble.
        var bubbleAnchor = document.createElement('div');
        bubbleAnchor.classList.add('popup-bubble-anchor');
        //bubbleAnchor.appendChild(content);

        // This zero-height div is positioned at the bottom of the tip.
        this.containerDiv = document.createElement('div');
        this.containerDiv.classList.add('popup-container');
        this.containerDiv.appendChild(content);

        // Optionally stop clicks, etc., from bubbling up to the map.
        google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.containerDiv);
    }
    // ES5 magic to extend google.maps.OverlayView.
    Popup.prototype = Object.create(google.maps.OverlayView.prototype);

    /** Called when the popup is added to the map. */
    Popup.prototype.onAdd = function() {
        this.getPanes().floatPane.appendChild(this.containerDiv);
    };

    /** Called when the popup is removed from the map. */
    Popup.prototype.onRemove = function() {
        if (this.containerDiv.parentElement) {
            this.containerDiv.parentElement.removeChild(this.containerDiv);
        }
    };

    /** Called each frame when the popup needs to draw itself. */
    Popup.prototype.draw = function() {
        var divPosition = this.getProjection().fromLatLngToDivPixel(this.position);

        // Hide the popup when it is far out of view.
        var display =
            Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ?
                'block' :
                'none';

        if (display === 'block') {
            this.containerDiv.style.left = divPosition.x + 'px';
            this.containerDiv.style.top = divPosition.y + 'px';
        }
        if (this.containerDiv.style.display !== display) {
            this.containerDiv.style.display = display;
        }
    };

    return Popup;
}
