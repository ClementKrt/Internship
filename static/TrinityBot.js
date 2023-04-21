const form = document.querySelector('#query-form');
const input = document.querySelector('#query-input');
var queryevaluation = document.getElementById("query-evaluation");
var queryintent = document.getElementById("query-intent");
var queryconfidence = document.getElementById("query-confidence");
var querytext = document.getElementById("query-text");
var queryaction = document.getElementById("query-action");
var intentanswers = document.getElementById("intent-answers");

const chatlogsContainer = document.querySelector('.chatlogs');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  // Get the user's query
  const query = input.value;
  
  // Send the query to the Flask app using an AJAX request
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:5000/dialogflow');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = () => {

    
    // Display the response from the Flask app
    const response = JSON.parse(xhr.responseText);
    const botResponse = response.fulfillmentText;

    queryevaluation.innerHTML = "Answer : " + response.fulfillmentText;
    if(response.intentName == response.action){
      queryintent.innerHTML = "Detected intent : " + response.intentName
    }else{
      queryintent.innerHTML = "Detected intent : " + response.intentName  + response.action;
    }
    querytext.innerHTML = "Question : " + response.text;
    queryconfidence.innerHTML = "Confidence score : " + Math.floor(response.confidence*100) + "%";

    intentanswers.innerHTML = "Possible answers : <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +  response.intentanswer.replace(/["'\\\[\]]/g, '').replace(/[,]/g,"<br>&nbsp;&nbsp;&nbsp;&nbsp;").replace(/[ù]/,",").replace(/[+]/,"'");
    const userQuery = query;
    
    const chatLogLeft = document.createElement('div');
    chatLogLeft.className = 'chat-left';

    const chatLogRight = document.createElement('div');
    chatLogRight.className = 'chat-right';

    
    
    const userQueryContainer = document.createElement('div');
    userQueryContainer.className = 'chat-question';
    userQueryContainer.textContent = userQuery;
    
    const newLineRight = document.createElement('div');
    newLineRight.style.clear = 'right'; // push the new line down to the next line
    const newLineLeft = document.createElement('div');
    newLineLeft.style.clear = 'left';

    const botResponseContainer = document.createElement('div');
    botResponseContainer.className = 'chat-answer';
    botResponseContainer.textContent = botResponse;
    
    
    chatlogsContainer.appendChild(chatLogRight);
    chatLogRight.appendChild(userQueryContainer);
    chatlogsContainer.appendChild(newLineRight); // add the new line here

    chatlogsContainer.appendChild(chatLogLeft);
    chatLogLeft.appendChild(botResponseContainer);
    chatlogsContainer.appendChild(newLineLeft);
    

    chatlogsContainer.scrollTop = chatlogsContainer.scrollHeight;
  };
  xhr.send(JSON.stringify({queryInput: {text: {text: query}}}));
  
  // Clear the input field
  input.value = '';
});


