/*
  Nodejs Slackbots with yelp API Implementation.
*/


var Bot = require('slackbots');
var https = require('https');
var querystring = require('querystring');

//Bot settings
var settings = {
	token: 'xoxb-105223458929-uL2RHLIz1WxevVJcSbecahyz',
	name: 'Yelp Help'
};

var Yelp = require('yelp-api-v3');

var yelp = new Yelp({
  app_id: 'GsTTSZRo4S2yfBFWxDgiBw',
  app_secret: 'I206rFMYeuTSCitBnq1L5Of6oqrDUGyKtRbx7ACEqZChtzb7aCv4k39QPQt8iUxm'
});

//Initialize a bot
var bot = new Bot(settings);

//Starting message
bot.on('start', function(){
	bot.postMessageToChannel('general', 'Hello, There! How can I help you.');
});

bot.on('message', function(data) {
  if(data.text != undefined && data.subtype == undefined){
    //Nearby search
    if (data.text.search("Nearby") >(-1))
    {
      yelp.search({term: 'restaurant', radius_filter: 10000, location: data.text, limit: 5})
      .then(function (data) {
        var response = JSON.parse(data); //Parses the return
          var businesses = ""; //To build bot string
          if(response.total > 0)
          {
            //Loops through the businesses returned
            for(var i = 0; i < response.businesses.length; i++)
            {
               businesses += (i+1) +") Restaurant Name: " + 
                            response.businesses[i].name + "\n  " +
                             "  Address: " + response.businesses[i].location.address1 + "\n";
            }
            //Sends data to bot
            bot.postMessageToChannel('general', businesses);
          }
      })
      .catch(function (err) {
        //If no data found. Send message to be indication no data found
        bot.postMessageToChannel('general', "No nearby restaurants can be found");
      });
    }

    //Close by search
    if(data.text.search("Closeby") >(-1))
    {
      var res = data.text.split(" ");

      //Longgituda and latitude parsing
      var longitude = parseFloat(res[1].replace('/W','')) * -1;
      var latitude = parseFloat(res[2].replace('/S',''));

    
      yelp.search({term: 'restaurant', radius_filter: 10000, latitude: latitude, longitude:longitude, limit: 5})
      .then(function (data) {
          var response = JSON.parse(data); //Parses the return
          var businesses = ""; //To build bot string
          if(response.total > 0)
          {
            //Loops through the businesses returned
            for(var i = 0; i < response.businesses.length; i++)
            {
               businesses += (i+1) +") Restaurant Name: " + 
                            response.businesses[i].name + "\n  " +
                             "  Address: " + response.businesses[i].location.address1 + "\n";
            }
            //Sends data to bot
            bot.postMessageToChannel('general', businesses);
          }
      })
      .catch(function (err) {
          //If no data found. Send message to be indication no data found
          bot.postMessageToChannel('general', "No closeby restaurants can be found");
      });
    }

    //Search by highest rated
    if(data.text.search("Top") > (-1))
    {
        //Search criteria
        var string = data.text.split(" "); 
        //Nuber of bussinesses to get ratings
        var numberOfBussinesses = parseInt(string[1]);
        //Seach call to api
        yelp.search({term: 'restaurant', radius_filter: 10000, location: (string[2] + string[3]), sort:2, limit: numberOfBussinesses})
        .then(function (data) {
            var response = JSON.parse(data); //Parses the return
            var businesses = ""; //To build bot string
            if(response.total > 0)
            {
              //Loops through the businesses returned
              for(var i = 0; i < response.businesses.length; i++)
              {
                 businesses += (i+1) +") Restaurant Name: " + 
                              response.businesses[i].name + "\n  " +
                               "  Address: " + response.businesses[i].location.address1 + "\n";
              }
              //Sends data to bot
              bot.postMessageToChannel('general', businesses);
            }
        })
        .catch(function (err) {
            //If no data found. Send message to be indication no data found
            bot.postMessageToChannel('general', "No nearby restaurants can be found");
        });
    }



    //Search by Closest
    if(data.text.search("Closest") > (-1))
    {
        //Search criteria
        var string = data.text.split(" "); 
        //Nuber of bussinesses to get ratings
        var numberOfBussinesses = parseInt(string[1]);
        //Seach call to api
        yelp.search({term: 'restaurant', location: (string[2] + string[3]), sort:1, limit: numberOfBussinesses})
        .then(function (data) {
            var response = JSON.parse(data); //Parses the return
            var businesses = ""; //To build bot string
            if(response.total > 0)
            {
              //Loops through the businesses returned
              for(var i = 0; i < response.businesses.length; i++)
              {
                 businesses += (i+1) +") Restaurant Name: " + 
                              response.businesses[i].name + "\n  " +
                               "  Address: " + response.businesses[i].location.address1 + "\n";
              }
              //Sends data to bot
              bot.postMessageToChannel('general', businesses);
            }
        })
        .catch(function (err) {
            //If no data found. Send message to be indication no data found
            bot.postMessageToChannel('general', "No nearby restaurants can be found");
        });
    }



    //Search by FindMe
    if(data.text.search("FindMe") > (-1))
    {
        //Search criteria
        var string = data.text.split(" "); 
        //Seach call to api
        yelp.search({term: string[1], radius_filter: 20000, location: (string[2] + string[3] + string[4] + string[5]+ string[6]), sort:1})
        .then(function (data) {
            var response = JSON.parse(data); //Parses the return
            var businesses = ""; //To build bot string
            if(response.total > 0)
            {
              //Loops through the businesses returned
              for(var i = 0; i < response.businesses.length; i++)
              {
                 businesses += (i+1) +") Restaurant Name: " + 
                              response.businesses[i].name + "\n  " +
                               "   Address: " + response.businesses[i].location.address1 + "\n " +
                               "   Ratings " + response.businesses[i].rating + " \n";
              }
              //Sends data to bot
              bot.postMessageToChannel('general', businesses);
            }
        })
        .catch(function (err) {
            //If no data found. Send message to be indication no data found
            bot.postMessageToChannel('general', "No " + string[1]+ " category restaurant can be found");
        });
    }

    //Search by SearchByPhone 
    if(data.text.search("SearchByPhone") > (-1))
    {
        //Search criteria
        var string = data.text.split(" "); 
        //Seach call to api
        yelp.phoneSearch({phone: ('+'+string[1])})
        .then(function (data) {
            var response = JSON.parse(data); //Parses the return
            var businesses = ""; //To build bot string
            if(response.total > 0)
            {
              //Loops through the businesses returned
              for(var i = 0; i < response.businesses.length; i++)
              {
                 businesses += (i+1) +") Restaurant Name: " + 
                              response.businesses[i].name + "\n  " +
                               "   Address: " + response.businesses[i].location.address1 + "\n " ;
              }
              //Sends data to bot
              bot.postMessageToChannel('general', businesses);
            }
        })
        .catch(function (err) {
            //If no data found. Send message to be indication no data found
            bot.postMessageToChannel('general', "No restaurant with phone number " + string[1]+ " can be found");
        });
    }
  }
});
