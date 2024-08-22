import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import pg from 'pg';

const app = express();
const port = 3000;
var tbl_data = [];
let score = 0;

//middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

//set connection Postgree local database
const client = new pg.Client({
  user: 'postgres',
  password: '123456',
  host: 'localhost',
  port: 5432,
  database: 'world',
});

//Connect to database
client.connect();

//Math.floor(Math.random() * tbl_data.length)

//Get all data from table capitals
tbl_data = await client.query('select * from capitals');

//select one Random country from the received array or oject of data and return it.
let rnd_countrydata = function () {
  return tbl_data.rows[Math.floor(Math.random() * tbl_data.rows.length)];
};

//close database connection
await client.end();

let newcountry = {};

//index page request
app.get('/', (req, res) => {
  newcountry = rnd_countrydata();
  console.log(
    'newcountry ' + newcountry.country + 'capital ' + newcountry.capital
  );
  res.render('index.ejs', {
    newquestion_country: newcountry.country,
  });
});

//Form submited Postrequest
app.post('/submit', (req, res) => {
  let usersubmittedanswer = req.body.useranswer;
  let quiz = rnd_countrydata();

  if (
    usersubmittedanswer.trim().toLowerCase() ===
    newcountry.capital.trim().toLowerCase()
  ) {
    score = score + 1;
    newcountry = rnd_countrydata();

    res.render('index.ejs', {
      newquestion_country: newcountry.country,
      msg: 'correct',
      score: score,
    });
  } else {
    newcountry = rnd_countrydata();
    res.render('index.ejs', {
      newquestion_country: newcountry.country,
      msg: 'wrong',
      score: score,
    });
  }
});

app.listen(port, () => {
  console.log(`Port is running on ${port}`);
});
