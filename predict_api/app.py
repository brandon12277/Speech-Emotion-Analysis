from flask import Flask, request, redirect,jsonify
import tensorflow as tf
import matplotlib.pyplot as plt
import os
import io
import librosa
from flask_cors import CORS

import numpy as np
from PIL import Image
import threading








import random

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)


model = tf.keras.models.load_model("emotion_80.h5")

os.makedirs("uploads", exist_ok=True)

class UniqueUIDGenerator:
    def __init__(self):
        self.generated_uids = set()

    def generate_uid(self):
        while True:
            uid = ''.join(random.choice('0123456789') for _ in range(6))
            if uid not in self.generated_uids:
                self.generated_uids.add(uid)
                return uid


generator = UniqueUIDGenerator()


def image_processing(audio_path):
    try:
        y, sr = librosa.load(audio_path, sr=None)
        
        uid = generator.generate_uid()
        url  = 'uploads/'+uid+'.png'
 
        mel_spectrogram = librosa.feature.melspectrogram(y=y, sr=sr, n_fft=2048, hop_length=512, n_mels=128)

   
        mel_spectrogram_db = librosa.power_to_db(mel_spectrogram, ref=np.max)

   
        plt.figure(figsize=(4, 4))
        librosa.display.specshow(mel_spectrogram_db, sr=sr, hop_length=512, x_axis=None, y_axis=None)
        plt.axis('off')
        plt.tight_layout(pad=0)

    
        plt.savefig(url, format='png', bbox_inches='tight', pad_inches=0)
        plt.close()


        img = tf.keras.preprocessing.image.load_img(url, target_size=(128,128))
    
        img_array = tf.keras.preprocessing.image.img_to_array(img)
   
        img_array = np.expand_dims(img_array, axis=0)
        return  img_array,url

    
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
       

    
   



@app.route('/upload', methods=['POST'])
def upload_file():
    f = request.files['audio_blob']
    uid = generator.generate_uid()
    url  = 'uploads/'+uid+'.wav'
    with open(url, 'wb') as audio:
            f.save(audio)
    
    print(f)
    resized_spectrogram_image,save_path = image_processing(url)
   
    
    

    os.remove(url)
    os.remove(save_path)

    result =  model.predict(resized_spectrogram_image)
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
   

    
            
thread = threading.Thread(target=upload_file)
thread.start()
thread.join() 

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001,debug=True)