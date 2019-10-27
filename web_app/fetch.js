//var fetchResult; Heatmap
const satationInfo = "http://localhost:8080/getstationinfo";
const getfiltereddata = "http://localhost:8080/getfiltereddata";
const getStationInfo = async () => {
    return new Promise(function (resolve, reject) {
        try {
            fetch(satationInfo, {
                method: "GET",
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            }).then(res => res.json()).then(json =>{
                console.log(fetchMarker);
                resolve(json);
            });
        } catch (error) {
            console.log(error);
        }
    });


};

const getRawData = async (day,hour,weather) => {
    return new Promise(function (resolve, reject) {
        try {
             fetch(getfiltereddata +"?day="+day+"&hour="+hour+"&weather="+weather, {
                method: "GET",
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            }).then(res => res.json()).then(json =>{
                console.log(fetchResult);
                 resolve(json);
             });
        } catch (error) {
            console.log(error);
        }
    });
};