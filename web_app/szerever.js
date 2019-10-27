const fetch = require('node-fetch')
const perf = require('execution-time')();
const express = require("express");
const http = require('http');
const Pool = require('pg').Pool
const cors = require('cors');
const pool = new Pool({
    user: 'admin',
    //host: '34.77.180.31',
    host:'100.98.3.23',
    database: 'postgres',
    password: 'example',
    port: 5432,
  })
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

let dayQuery = "EXTRACT(DOW FROM avg_data.\"time\") = ";
let hourQuery = "EXTRACT(HOUR FROM avg_data.\"time\") = ";
let weatherquery1 = ",(select \"year\",\"month\",\"day\",\"time\" from weather where rain_intensity ";
let weatherquery2 = " 1) as weather_data where" +
" EXTRACT(YEAR FROM avg_data.\"time\") = weather_data.year and"+
" EXTRACT(MONTH FROM avg_data.\"time\") = weather_data.month and"+
" EXTRACT(day FROM avg_data.\"time\") = weather_data.day and" +
" EXTRACT(hour FROM avg_data.\"time\") = weather_data.time::integer ";
/**
 * path params
 * day = 0-6
 * 0 - 6; Sunday is 0
 * hour=0-24 all data average
 * weather= 0 none,weather = 1 sunny,weather = 2 rainy 
 */

app.get("/getfiltereddata", (req,res,next) =>{
    let day = req.query.day;
    let hour = req.query.hour;
    let weather = req.query.weather;
    let arr = [];
    let groupby = " group by(\"serial\")";
    let startquery = "select \"serial\", avg(number_of_people) from avg_data ";
    let separator = " where "
    if (weather > 0) {
        startquery = startquery + weatherquery1 + (weather == 1 ? '<' :'>' )+ weatherquery2;
        separator = " and ";
    }
    if (day > 0 ) {
        arr.push(day);
        startquery = startquery +separator+ dayQuery + "$1"; 
        separator = " and ";
    }
    if (hour > 0) {
        if (arr.length == 0 ) {
            startquery = startquery +separator+ hourQuery + "$1"; 
        } else {
            startquery = startquery +separator+ hourQuery + "$2"; 
        }
        arr.push(hour);
        
    }
    
    startquery = startquery + groupby;
    console.log(startquery);
    console.log(arr);
    pool.query(startquery,arr,(error, results) => {
        if (error) {
            console.log(error);
            res.json(error);
            return;
        } 
        res.json(results.rows);
        
    })
    //res.json(startquery);
});

app.get("/getstationinfo", (req,res,next) => {
    console.log("asd");
    if (req.query.serial == undefined) {

        fetch("https://api.hypr.cl/station", {
            method: 'POST',
            headers: {
                'x-api-key': api_key,
                'command':'list',
            }
            }).then(res=> res.json())
            .then(json => {
               res.json(json.list);
               return;
            });
    }
    fetch("https://api.hypr.cl/station", {
    method: 'POST',
    headers: {
        'x-api-key': api_key,
        'command':'list',
    }
    }).then(res=> res.json())
    .then(json => {
        json.list.forEach(element => {
            if (element.serial === req.query.serial) {
                res.json(element);
                return;
            }
        });
    });
});



app.get("/gethourdata", (req, res, next) => {
    let date = undefined;
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
   
});


app.get('/',function(req,res) {
    res.sendFile(__dirname+'/map.html');
});

app.get('/about.html',function(req,res) {
    res.sendFile(__dirname+'/about.html');
});

app.get('/predict.html',function(req,res) {
    res.sendFile(__dirname+'/predict.html');
});

app.get('/index.html',function(req,res) {
    res.sendFile(__dirname+'/index.html');
});
////////////////////////////////////////////////////////
app.get('/fetch.js',function(req,res) {
    res.sendFile(__dirname+'/fetch.js');
});

app.get('/popupmarker.js',function(req,res) {
    res.sendFile(__dirname+'/popupmarker.js');
});

app.get('/events.js',function(req,res) {
    res.sendFile(__dirname+'/events.js');
});

app.get('/gmap.js',function(req,res) {
    res.sendFile(__dirname+'/gmap.js');
});

app.get('/webcam.js',function(req,res) {
    res.sendFile(__dirname+'/webcam.js');
});

app.get('/ima3.js',function(req,res) {
    res.sendFile(__dirname+'/ima3.js');
});



app.use(cors());
//export app
module.exports = app;

const port = process.env.PORT || 8080;
const server = http.createServer(app);

server.listen(port, () => {
    //    let's print a message when the server run successfully
    console.log("Server restarted successfully")
});