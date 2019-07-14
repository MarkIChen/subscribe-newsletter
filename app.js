const express = require('express');
const bodyParser = require('body-parser');
const request = require('request')

const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(express.static("public"));

app.listen(process.env.PORT || 3000, function() {
  console.log('Server is running on port 3000')
})

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/sign-up.html");
})

app.post('/', function(req, res) {
  console.log(req.body);
  const FName = req.body.FName;
  const LName = req.body.LName;
  const email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: FName,
          LNAME: LName
        }
      }
    ]
  };
  var jsonData = JSON.stringify(data);

  console.log(jsonData);
  options = {
    url: 'https://us3.api.mailchimp.com/3.0/lists/1ce20c6e4b/',
    method: "POST",
    headers: {
      "Authorization": 'randomUser 24aa8cd12d188841b70edfaf47152577-us3'
    },
    body: jsonData
  }

  request(options, function(error, response, body) {
    if (error) {
      console.log(error);
      res.sendFile(__dirname + "/failure.html");
    } else {
      if(response.statusCode == 200){
        res.sendFile(__dirname + "/success.html");
        console.log(body);
      } else {
        res.sendFile(__dirname + "/failure.html");
      }


    }
  })
})

app.post('/failure', function(req, res){
  res.redirect('/');
})
