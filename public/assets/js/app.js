$(function() {
  $(".saveArticleButton").on("click", function(event) {
    event.preventDefault();

    $(".articleSavedBody").empty();

    let articleId = $(this).data("id");

    $.ajax("/save/article/" + articleId, {
      type: "PUT"
    }).then(function() {
      let newText = $("<div>");
      newText.text("Article is Saved");
      $(".articleSavedBody").append(newText);
      $("#articleSavedModal").modal("show");
    });
  });

  $(".deleteSavedArticleButton").on("click", function(event) {
    event.preventDefault();

    $(".articleDeleteBody").empty();

    let articleId = $(this).data("id");

    $.ajax("/delete/article/" + articleId, {
      type: "PUT"
    }).then(function() {
      let newText = $("<div>");
      newText.text("Article has been deleted");
      $(".articleDeleteBody").append(newText);
      $("#articleDeleteModal").modal("show");
    });
  });

  $(".deleteSavedArticleModalButton").on("click", function(event) {
    event.preventDefault();

    $.ajax("/saved", {
      type: "GET"
    }).then(function() {
      location.reload();
      console.log("saved site updated");
    });
  });

  $("#closeArticleButton").on("click", function(event) {
    event.preventDefault();

    $.ajax("/", {
      type: "GET"
    }).then(function() {
      console.log("site updated");
      location.reload();
    });
  });

  $("#scrapeArticlesButton").on("click", function(event) {
    event.preventDefault();

    $(".articlesScrapedBody").empty();

    $.ajax("/", {
      type: "GET"
    }).then(function(response) {
      let oldLength = response;

      console.log(oldLength);

      $.ajax("/scrape", {
        type: "POST"
      }).then(function(response) {
        $.ajax("/reduce", {
          type: "DELETE"
        }).then(function(response) {
          location.reload();
        });
      });
    });
  });

  $(".addNoteButton").on("click", function(event) {
    event.preventDefault();

    let articleId = $(this).data("id");
    $(".noteModalBody").empty();
    $(".noteAlert").remove();

    $.ajax("/comments/" + articleId, {
      type: "GET"
    })
      .then(function(result) {
        $(".noteModalBody").append("<h2>" + result.title + "</h2>");
        $(".noteModalBody").append("<ul id='noteList'>");

        let newForm = $("<form>");

        let newFormGroup1 = $("<div>");
        newFormGroup1.addClass("form-group");
        let newFormGroupLabel1 = $('<label for="titleinput">');
        newFormGroupLabel1.text("New Note Title");
        newFormGroup1.append(newFormGroupLabel1);
        newFormGroup1.append("<input id='titleinput' name='title' >");

        let newFormGroup2 = $("<div>");
        newFormGroup2.addClass("form-group");
        let newFormGroupLabel2 = $('<label for=bodyinput">');
        newFormGroupLabel2.text("New Note Text");
        newFormGroup2.append(newFormGroupLabel2);
        newFormGroup2.append(
          "<textarea id='bodyinput' name='body'></textarea>"
        );

        $(".saveNoteButton").attr("data-id", result._id);
        newForm.append(newFormGroup1);
        newForm.append(newFormGroup2);

        $(".noteModalBody").append(newForm);

        for (let i = 0; i < result.comment.length; i++) {
          let newCard = $("<div class=card>");
          newCard.addClass("noteCard");
          let newCardHeader = $(
            "<div class=card-header>" + result.comment[i].title + "</div>"
          );
          let newCardBody = $("<div class=card-body>");
          newCardBody.addClass("noteCardBody");
          newCardBody.text(result.comment[i].body);
          newCard.append(newCardHeader);
          newCard.append(newCardBody);
          newCard.append(
            "<button class=deleteNoteButton data-id=" + i + ">Delete</button>"
          );

          $(".noteModalHeader").append(newCard);
        }
      })
      .then($("#noteModal").modal("show"));
  });

  $(".saveNoteButton").on("click", function(event) {
    let articleId = $(this).attr("data-id");

    $.ajax({
      method: "POST",
      url: "/create/comment/" + articleId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    }).then(function(result) {
      console.log(result);
      let noteAdded = $("<p>");
      noteAdded.addClass("noteAlert");
      noteAdded.text("Note successfully added");
      $(".alertDiv").append(noteAdded);
      $("#titleinput").val("");
      $("#bodyinput").val("");
    });
  });

  $(".deleteNoteButton").on("click", function(event) {
    event.preventDefault();

    console.log("clicked");
  });
});
