from flask import Flask, request, jsonify, render_template
from google.oauth2 import service_account
from google.cloud import dialogflow_v2 as dialogflow
import uuid
from flask_cors import CORS



# Set up Flask app
app = Flask(__name__)

# Enable CORS
CORS(app)
# Replace '/path/to/keyfile.json' with the actual path to the service account key file
creds = service_account.Credentials.from_service_account_file('C:/Users/Hélène/Downloads/small-talk-ofck-0c6358767414.json')

# Create a Dialogflow client using the credentials
client = dialogflow.SessionsClient(credentials=creds)

# Define a route to handle Dialogflow requests
@app.route('/dialogflow', methods=['POST'])
def handle_dialogflow():
    # Get the request data as JSON
    req_data = request.get_json()
    print(req_data)
    # Set up the session ID using a unique identifier
    my_session_id = str(uuid.uuid4())
    session = client.session_path("small-talk-ofck", my_session_id)

    # Set up the query text and parameters
    query_text = req_data['queryInput']['text']['text']
    

    # Send the query to Dialogflow
    query_input = dialogflow.types.QueryInput(text=dialogflow.types.TextInput(text=query_text, language_code='en-US'))
    response = client.detect_intent(session=session, query_input=query_input)
    # Extract the response from the Dialogflow API response
    output = response.query_result.fulfillment_text

    # Return the response as JSON
    return jsonify({'fulfillmentText': output})

# Route to render the HTML file
@app.route('/')
def index():
    return render_template('TrinityBot.html')

# Run the app
if __name__ == '__main__':
    app.run()