var weathernum =0;
var daynum = 0;
var time = 12;
function toggleContentBtn(div) {
    var x = document.getElementById(div);
    var btn = document.getElementById('b'+div);
    if (x.style.display === "none") {
        x.style.display = "block";
        btn.style.borderRadius = " 10px 10px 0px 0px";
    } else {
        x.style.display = "none";
        btn.style.borderRadius = "10px 10px 10px 10px";
    }

}

function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function togglePlaces() {
    if (markers[0].map == null) {
        setMapOnAll(map);
    } else {
        setMapOnAll(null);
    }
}

function timbeButton(i) {
    if (time+i >24) {
        time =0;
    }else if(time+i<0){
        time = 23;
    } else {
        time +=i;
    }

    updateheatmap();
    document.getElementById('ora').innerHTML=time;
}

function dayUpdate(i) {
    daynum=i;
    updateheatmap();
}

function weatherUpdate(i) {
    weathernum=i;
    updateheatmap();
}


timer = undefined;
function autoplayStartStop() {
    if (timer) {
        clearTimeout(timer);
        timer = undefined;
        document.getElementById("playbackButton").innerText = "Play";
    } else {
        document.getElementById("playbackButton").innerText = "Stop";
        timer = setInterval(function () {
            console.log("asd");
            timbeButton(1);
        }, 500);
    }
}


