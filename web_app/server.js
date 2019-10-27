const fetch = require('node-fetch')
const perf = require('execution-time')();
const express = require("express");
const http = require('http');
const cors = require('cors');
perf.start();
const api_key = "iQ0WKQlv3a7VqVSKG6BlE9IQ88bUYQws6UZLRs1B"
const MAX_REQUEST_IN_ONE_SECOND = 100;
const REQUEST_SIZE_IN_SECONDS = 3600;
const INTERVALL = REQUEST_SIZE_IN_SECONDS / MAX_REQUEST_IN_ONE_SECOND;
//const testData = new Date('2019-08-01T12:00:00Z')
//console.log( testData.toISOString().replace(".000Z",'Z'));
//let date = testData;
let data = {};
const app = express();

gethourdata = function(date,res) {
    fetch("https://api.hypr.cl/station", {
    method: 'POST',
    headers: {
        'x-api-key': api_key,
        'command':'list',
    }
    }).then(res=> res.json())
    .then(json => {
    json.list.forEach(element => {
        data[element.serial] = {};
        data[element.serial].avgpeople = 0;
        data[element.serial].lat = element.latitude;
        data[element.serial].lon = element.longitude;
    })
    
    let num = 0;
    for (let index = 0; index < MAX_REQUEST_IN_ONE_SECOND; index++) {
    
        console.log(index)
        fetch("https://api.hypr.cl/raw", {  
            method: 'POST',  
            headers:  {
                'x-api-key': api_key,
                'command':'list',
                'time_start': date.toISOString().replace(".000Z",'Z'),
                'time_stop': (new Date(date.getTime() + 1000)).toISOString().replace(".000Z",'Z')
        },  
        body: JSON.stringify({
            name: 'dean',
            login: 'dean',})
    })
    .then(res => res.json()) // expecting a json response
    .then(json => {
        json.raw.forEach(element => {
            try {
                data[element.serial].avgpeople+=1;
            } catch(error) {
                
            }
            
        });
//const results = perf.stop();
//console.log(results.time);  // in milliseconds

        num++
        if (num==100) {
            const results = perf.stop();
            for (var key in data) {
                console.log(data[key].avgpeople); 
                data[key].avgpeople = Math.round(data[key].avgpeople / MAX_REQUEST_IN_ONE_SECOND);
            }
            console.log(data);
            res.json({"hourlyAvg":data})
        }
    //console.log(json);
    })
    .catch(function (error) {  
        console.log('Request failure: ', error);  
    });
    date = new Date(date.getTime() + INTERVALL*1000);
    
    }
    });
}


app.get("/gethourdata", (req, res, next) => {
    let date = undefined;
    console.log('asd');
    try {
        console.log(req.query.date);
        date = new Date(req.query.date);
        console.log(date);

      }
      catch(error) {
        console.error(error);
        res.json({"response":"Invalid date"})
      }
    gethourdata(date,res);
    //res.json({"done":"fasza"});
   
});

app.use(cors())
//export app
module.exports = app;

const port = process.env.PORT || 8080;
const server = http.createServer(app);

server.listen(port, () => {
    //    let's print a message when the server run successfully
    console.log("Server restarted successfully")
});