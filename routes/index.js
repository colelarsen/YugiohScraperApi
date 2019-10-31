var express = require('express');

var router = express.Router();

const request = require('request');

const cheerio = require('cheerio');

var urlstart = 'https://db.ygoprodeck.com/card/?search=';



router.post('/', function (req, res) {
  try {
    var cards = req.body;
    var urlList = { urls: [] };
    var returnedCount = 0;
    cards.forEach(card => {

      var cardAsUrl = convertCardToUrl(card.name);

      imgscrape(urlstart + cardAsUrl)
      .then(url => {
        urlList.urls.push(url);
        returnedCount = returnedCount+1;
        if(returnedCount == cards.length)
        {
          res.json(urlList);
        }
      });
    });
  } catch (error) {
    console.log(error);
  }


});



function imgscrape(url, cardNumber) {
  return new Promise(function (resolve, reject) {
    try {
      request(url, (error, resp, html) => {
        let $ = cheerio.load(html);
        let response = $('meta[property="og:image:secure_url"]').attr('content');
        resolve(response);
      });
    }

    catch (e) {
      console.log(e);
      reject(e);
    }

  });

}





function convertCardToUrl(cardName) {

  var cardNameLength = cardName.length;

  if ((cardName.charAt(cardNameLength - 2) == 'X' || cardName.charAt(cardNameLength - 2) == 'x') && cardName.charAt(cardNameLength - 3) == ' ') {

    copies = cardName.charAt(cardNameLength - 1) - 0;

    cardNameLength = cardNameLength - 3;

    cardName = cardName.substring(0, cardName.length - 3);

  }



  var j;

  var cardAsUrl = "";

  for (j = 0; j < cardNameLength; j++) {

    if (cardName.charAt(j) == ' ') {

      cardAsUrl += '%20';

    }

    else {

      cardAsUrl += cardName.charAt(j);

    }

  }

  return cardAsUrl;

}



module.exports = router;