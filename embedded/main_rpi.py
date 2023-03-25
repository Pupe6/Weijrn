import os

import time

import requests

from dotenv import load_dotenv

import os
from Crypto.Cipher import AES
from Crypto.Util import Padding

load_dotenv()

#ENCRYPTION, DECRYPTION CODE
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY").encode("utf-8")
IV_LENGTH = 16

def encrypt(text: str):
    iv = os.urandom(IV_LENGTH)
    cipher = AES.new(bytes(ENCRYPTION_KEY), AES.MODE_CBC, iv)
    padded_text = Padding.pad(text.encode(), AES.block_size)
    encrypted = cipher.encrypt(padded_text)
    return iv.hex() + ":" + encrypted.hex()

def decrypt(text):
    text_parts = text.split(":")
    iv = bytes.fromhex(text_parts[0])
    encrypted_text = bytes.fromhex(text_parts[1])
    cipher = AES.new(ENCRYPTION_KEY, AES.MODE_CBC, iv)
    decrypted = cipher.decrypt(encrypted_text)
    unpadded = Padding.unpad(decrypted, AES.block_size)
    return unpadded.decode('utf-8')


# def expand2square(pil_img, background_color):
#     width, height = pil_img.size
#     if width == height:
#         return pil_img
#     elif width > height:
#         result = Image.new(pil_img.mode, (width, width), background_color)
#         result.paste(pil_img, (0, (width - height) // 2))
#         return result
#     else:
#         result = Image.new(pil_img.mode, (height, height), background_color)
#         result.paste(pil_img, ((height - width) // 2, 0))
#         return result


# {'status': True, 'nickname': 'Test', 'pending': True}
# Ako status == True iziskva action osven ako pendinga ne e true

def get_status_checker():
    url = "https://13ab-95-42-52-106.eu.ngrok.io/statusupdate"
    while True:
        headers = {'X-MAC-Address' : '00:00:00:00:00:00'}
        response = requests.get(url, headers = headers)
        data = response.json()
        raspiSend = data["raspiSend"]
        raspiReceive = data["raspiReceive"]
        time.sleep(5)
        
        if raspiSend["pending"] or raspiReceive["pending"]:
            continue
        
        if raspiSend["status"]:
            requests.post(f"{url}/pending", headers=headers)
            
            
            # nie prastame na servera VIKAM READ ARDUINO!!! nfc
            
            create_tag(raspiSend["_owner"], raspiSend["nickname"], "nfc", "test")
            
            requests.get(f"{url}/resolve", headers=headers)
            
        elif raspiReceive["status"]:
            requests.post(f"{url}/pending", headers=headers)
            
            data = decrypt(raspiReceive["tag"]["data"])
            print(data)
            
            
            # NA ARDUINOTO WRITE NA TAGA NFC
            
            requests.get(f"{url}/resolve", headers=headers)
            
        
def create_tag(_owner, nickname, type, data):
    headers = {"X-Mac-Address": "00:00:00:00:00:00"}
    data = {"_owner": _owner, "nickname": nickname, "type": type, "data": data}
    
    url = "https://13ab-95-42-52-106.eu.ngrok.io/jrn/tags/"
    
    res = requests.post(url, headers=headers, json=data)
    print(res.json())
    if res.ok:
        print("Tag created")
       

if __name__ == '__main__':
    get_status_checker()
    
    
    
    

    


