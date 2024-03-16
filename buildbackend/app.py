from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from PyPDF2 import PdfReader
import google.generativeai as genai
import PIL.Image
import csv

GOOGLE_API_KEY = 'AIzaSyA1OSP9Sccj2O0uBZSME2fz7LIzCx7Im8c'
genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel('gemini-pro')
model_vision = genai.GenerativeModel('gemini-pro-vision')
global chat 
chat = model.start_chat(history=[])

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['UPLOAD_FOLDER'] = './uploads'
app.secret_key = 'your_secret_key'  # Change this to a secure secret key


def is_pdf(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() == 'pdf'

def is_png(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() == 'png'


def get_response(query, img):
    img = PIL.Image.open(r'C:\Users\snsis\Desktop\Hackathons\DataDynamo\backend\samplefood.jpg')
    if not query:
        return 'Error'

    if img is not False:
        response = model_vision.generate_content([query, img], stream=True)
        response.resolve()
        return response.text
    else:
        response = chat.send_message('%s -- Please answer as concisely as you can, avoiding any extra conversation or text' % query, stream=True)
        response.resolve()
        gemini_response = response.text
        return gemini_response


@app.route('/upload', methods=['POST', 'OPTIONS'])
def upload_file():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'CORS preflight request handled successfully'})
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    if 'file' not in request.files:
        return jsonify({'error': 'No file part', 'message': 'error'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file', 'message': 'An error occurred.'})

    if file and is_pdf(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        try:
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            print('file saved')
        except Exception as e:
            return jsonify({'error': f'Error saving the file: {e}', 'message': 'error'})

        reader = PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text()

        query = text + ' Analyze these reports, and tell me if they have anything that indicates the forecoming of a specific disease. I am a complete beginner to healthcare and i do not know what the terms mean, and I just want to know what the possible diseases i could get for what reason, tell what kind of treatments i have to go through. Also output them in a neat point wise format, within 300 words.'
        response = chat.send_message('%s -- Please answer as concisely as you can, avoiding any extra conversation or text' % query, stream=True)
        response.resolve()


        return jsonify({'message': response.text}), 200


@app.route('/message', methods=['POST', 'OPTIONS'])
def get_message():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'CORS preflight request handled successfully'})
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    data = request.get_json()
    if 'message' not in data:
        return jsonify({'error': 'data not found'})

    message = data['message']

    # Check if a chat session exists for the user
    if 'chat_history' not in session:
        # Create a new chat history for the user
        session['chat_history'] = []

    # Send the message to the model and get the response
    response = chat.send_message(message, stream=True)
    response.resolve()

    
    return jsonify({'message': response.text})


@app.route('/healthanalysis', methods=['POST', 'OPTIONS'])
def get_report():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'CORS preflight request handled successfully'})
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    data = request.get_json()
    if 'message' not in data:
        return jsonify({'error': 'data not found'})

    message = data['message']

    # CROSS CHECKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
    # Send the message to the model and get the response
    response = chat.send_message(message, stream=True)
    response.resolve()

    
    return jsonify({'message': response.text})


@app.route("/calorietrack", methods=['POST', 'OPTIONS'])
def calorietrack():
    print('received image')
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'CORS preflight request handled successfully'})
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    
    print('debug 1')

    if 'file' not in request.files:
        return jsonify({'error': 'No file part', 'message': 'error'})
    print('debug 2')
    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file', 'message': 'An error occurred.'})
    
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        try:
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            print('file saved')
        except Exception as e:
            return jsonify({'error': f'Error saving the file: {e}', 'message': 'error'})
        print('debug 3')
        

        img = PIL.Image.open(file)

        response = model_vision.generate_content(["Generate the calorie count and nutrition facts for the image, along with the names of the food and its quantity in a precise and point wise manner, and nothing else is to be generated.", img], stream=True)
        response.resolve()
        print(response.text)

        return jsonify({'message': response.text}), 200

@app.route('/api/medicines', methods=['GET']) 
def get_medicine_list():
    try:
        with open(r'C:\Users\snsis\Desktop\Hackathons\DataDynamo\backend\Medicine_Details.csv', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            medicines = list(reader)
        return jsonify({'medicines': medicines})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/querymedicines', methods=['POST', 'OPTIONS'])
def ask_chat():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'CORS preflight request handled successfully'})
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    data = request.get_json()
    if 'message' not in data:
        return jsonify({'error': 'data not found'})

    message = data['message']

    






if __name__ == '__main__':
    app.run(debug=True)
