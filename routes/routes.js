const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const Comment = require("../models/Comment");
const axios = require("axios");
const cheerio = require("cheerio");

router.get("/", (req, res) => {
  Article.find({ saved: false }, (error, docs) => {
    if (error) {
      console.log(error);
    } else {
      res.render("index", { articles: docs });
    }
  });
});

router.get("/saved", function(req, res) {
  Article.find({ saved: true })
    .sort({ date: -1 })
    .then(docs => {
      res.render("saved", { articles: docs });
    });
});

router.post("/scrape", function(req, res) {
  axios.get("http://www.echojs.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
      var result = {};
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

router.put("/save/article/:id", function(req, res) {
  let articleId = req.params.id;

  Article.findOneAndUpdate(
    { _id: articleId },
    {
      $set: { saved: true }
    }
  ).then(function(result) {
    res.json(result);
  });
});

router.put("/delete/article/:id", function(req, res) {
  let articleId = req.params.id;

  Article.findOneAndUpdate(
    { _id: articleId },
    {
      $set: { saved: false }
    }
  ).then(function(result) {
    res.json(result);
  });
});

router.delete("/reduce", function(req, res) {
  Article.find({ saved: false })
    .sort({ date: -1 })
    .then(function(found) {
      console.log(found.length);
      let countLength = found.length;
      let overflow = countLength - 25;
      console.log(overflow);
      let overflowArray = [];

      for (var i = 0; i < overflow; i++) {
        overflowArray.push(found[10 + i]._id);
        console.log(overflowArray);
      }

      Article.remove({ _id: { $in: overflowArray } }, function(error, result) {
        result["length"] = countLength;
        console.log(result);
        res.json(result);
      });
    });

  router.get("/comments/all", function(req, res) {
    Comment.find({}).then(function(response) {
      res.json(response);
      // res.json(response)
    });
  });
  router.get("/comments/:id", function(req, res) {
    let articleId = req.params.id;

    Article.findOne({ _id: articleId })
      .populate("comment")
      .then(function(result) {
        res.json(result);
      });
  });

  router.post("/create/comment/:id", function(req, res) {
    Comment.create(req.body)
      .then(function(dbComment) {
        return Article.findOneAndUpdate(
          { _id: req.params.id },
          { comment: dbComment._id },
          { new: true }
        );
      })
      .then(function(result) {
        res.json(result);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
});

module.exports = router;
