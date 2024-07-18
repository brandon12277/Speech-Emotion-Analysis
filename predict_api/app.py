from flask import Flask, request, redirect,jsonify
import tensorflow as tf
import matplotlib.pyplot as plt
import os
import io
import librosa
from flask_cors import CORS
import subprocess
import numpy as np
from PIL import Image
import threading








import random

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)


model = tf.keras.models.load_model("emotion_80.h5")







    
   



@app.route('/getPredict', methods=['POST'])
def upload_file():
    img = request.files['img']
    result =  model.predict(img)
    print(result)
    class_label = 0
    if result[0][0] == 1:
        class_label = 0

    elif result[0][1] == 1:
        class_label = 1
    elif result[0][2] == 1:
        class_label = 2
    elif result[0][3] == 1:
        class_label = 3
    elif result[0][4] == 1:
        class_label = 4
    elif result[0][5] == 1:
        class_label = 5
    elif result[0][6] == 1:
        class_label = 6
    elif result[0][7] == 1:
        class_label = 7
    

   
    response = jsonify({'data': class_label})

    
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')

    return response  
            
# thread = threading.Thread(target=upload_file)
# thread.start()
# thread.join() 

if __name__ == '__main__':
     
   
     app.run(debug=True,port=5001)