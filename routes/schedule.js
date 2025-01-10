var express = require('express');
var axios = require('axios');
const { default: ical } = require('ical-generator');
const { start } = require('repl');
const moment = require('moment-timezone');


// var ICalCalendarMethod = ical.

var router = express.Router();

const calendar = ical({name: 'my first iCal'});

// A method is required for outlook to display event as an invitation
// calendar.method(ICalCalendarMethod.REQUEST);

let buildBasicAuthString = function(username, password) {
  const credentials = `${username}:${password}`;
  const encodedCredentials = btoa(credentials);
  return `Basic ${encodedCredentials}`;
}


const username = process.env.PAPRIKA_USERNAME;
const password = process.env.PAPRIKA_PASSWORD;


let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://www.paprikaapp.com/api/v1/sync/meals/',
  headers: { 
    'Authorization': buildBasicAuthString(username, password)
  }
};

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    var response = await axios.request(config);

    for (let meal of response.data.result) {
      let hour = 0;
      switch (meal.type) {
        case 0:
          hour = 9;
          break;
        case 1:
          hour = 12;
          break;
        case 2:
          hour = 18;
          break;
        case 3:
          hour = 16;
          break;
        default:
          break;
      }

      // console.log("Meal:", meal.name, " ", meal.type, " ", meal.date, " ", hour);
      // console.log(meal);
      let startDate = moment.tz(meal.date, 'America/New_York');
      let endDate = moment.tz(meal.date, 'America/New_York');
      startDate.hour(hour);
      endDate.hour(hour + 1);

    // console.log("Event:", meal.name, " ", startDate, " ", endDate);
      // return;
      calendar.createEvent({
        id: meal.uid,
        start: startDate,
        end: endDate,
        summary: meal.name
      });
    }

    return res.send(calendar.toString());
  } catch (error) {
    console.error("Failed to retrieve data:", error);
    return res.status(500).json({ error: "An error occurred while retrieving data.", message: error.message.message, req: req, res: res });
  }
});

module.exports = router;


