let endingIdValue;
let endingQuoteIdValue;

document.addEventListener("DOMContentLoaded", () => {
  populateQuotes();
  let newQuoteForm = document.querySelector("#new-quote-form");
  newQuoteForm.addEventListener("submit", newQuoteFormSubmit);
});

function createQuote(obj) {
  let quoteList = document.querySelector("#quote-list");

  console.log("obj: ", obj);

  let quoteCardLi = document.createElement("li");
  let blockQuote = document.createElement("blockquote");
  let quoteParagraph = document.createElement("p");
  let authorFooter = document.createElement("footer");
  let breakTag = document.createElement("br");
  let likesButton = document.createElement("button");
  let deleteButton = document.createElement("button");

  quoteCardLi.classList.add("quote-card");
  blockQuote.classList.add("blockquote");
  blockQuote.id = obj.id;
  quoteParagraph.classList.add("mb-0");
  quoteParagraph.textContent = obj.quote;
  authorFooter.textContent = obj.author;
  likesButton.textContent = "Likes: ";
  deleteButton.textContent = "Delete";

  likesButton.addEventListener("click", likesButtonClick);

  blockQuote.append(quoteParagraph, authorFooter, breakTag, likesButton, deleteButton);
  quoteCardLi.append(blockQuote);

  console.log("quoteCardLi: ", quoteCardLi);

  quoteList.append(quoteCardLi);
}

function populateQuotes() {
  fetch("http://localhost:3000/quotes?_embed=likes", {
    header: {
      "Content-Type": "application/json"
    },
    method: "GET"
  })
    .then((response) => response.json())
    .then((objArray) => {
      endingIdValue = objArray.length;

      objArray.forEach((obj) => {
        createQuote(obj);
      });
    })
    .catch((error) => {
      console.log("error: ", error.message);
    });
}

function likesButtonClick(e) {
  console.log("likesButtonClick() function called");
  console.log("e: ", e);
  console.log("e.target: ", e.target);
  console.log("e.target.parentElement.id: ", e.target.parentElement.id);
  let existingQuoteId = e.target.parentElement.id;

  // Grab the total amount of elements present so you can get the last id value accordingly:
  fetch("http://localhost:3000/likes", {
    header: {
      "Content-Type": "application/json"
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((objArray) => {
      endingQuoteIdValue = objArray.length;
      endingQuoteIdValue++;
    })
    .catch((error) => {
      console.log("error: ", error.message);
    })
    .then(
      // Make fetch() call with 'POST' method for 'http://localhost:3000/likes' to update 'like' count
      fetch("http://localhost:3000/likes", {
        header: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          id: endingQuoteIdValue,
          quoteId: existingQuoteId
        })
      })
        .catch((error) => {
          console.log("error: ", error.message);
        })
    );
}

function newQuoteFormSubmit(e) {
  e.preventDefault();

  // Grab the existing 'quote-list' items and store them away for later use:
  let quoteListUl = document.querySelector("#quote-list");
  let quoteListUlLis = quoteListUl.querySelectorAll("li");

  let tempArray = [];

  console.log("quoteListUl: ", quoteListUl);
  console.log("quoteListUlLis: ", quoteListUlLis);

  quoteListUlLis.forEach((li) => {
    console.log("li: ", li);
    tempArray.push(li);
  });

  // Clear the 'quote-list' to prevent duplicates from being made at the end:
  quoteListUl.innerHTML = "";

  tempArray.forEach((li) => {
    quoteListUl.append(li);
  });

  // Add the 'newQuoteObj' to the end of the 'quote-list' ul:
  console.log("e: ", e);
  console.log("e.target: ", e.target);
  let newQuote = document.querySelector("#new-quote").value;
  let newAuthor = document.querySelector("#author").value;
  endingIdValue++;

  console.log("newQuote: ", newQuote);
  console.log("newAuthor: ", newAuthor);
  console.log("endingIdValue: ", endingIdValue);

  let newQuoteObj = {};

  newQuoteObj.quote = newQuote;
  newQuoteObj.author = newAuthor;
  newQuoteObj.id = endingIdValue;

  createQuote(newQuoteObj);

  fetch("http://localhost:3000/quotes", {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      id: newQuoteObj.id,
      quote: newQuoteObj.quote,
      author: newQuoteObj.author
    })
  })
    .catch((error) => {
      console.log("error: ", error.message);
    });
}
