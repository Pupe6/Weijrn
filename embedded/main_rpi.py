import os

import time

import requests

from dotenv import load_dotenv

from Crypto.Cipher import AES
from Crypto.Util import Padding

import read
import write

import binascii

from pn532pi import Pn532, pn532
from pn532pi import Pn532I2c
from pn532pi import Pn532Spi
from pn532pi import Pn532Hsu

import json

load_dotenv()

# Set the desired interface to True
SPI = False
I2C = True
HSU = False

if SPI:
    PN532_SPI = Pn532Spi(Pn532Spi.SS0_GPIO8)
    nfc = Pn532(PN532_SPI)
# When the number after #elif set as 1, it will be switch to HSU Mode
elif HSU:
    PN532_HSU = Pn532Hsu(0)
    nfc = Pn532(PN532_HSU)

# When the number after #if & #elif set as 0, it will be switch to I2C Mode
elif I2C:
    PN532_I2C = Pn532I2c(1)
    nfc = Pn532(PN532_I2C)

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




def get_status_checker():
    url = "https://a37d-95-42-52-106.ngrok-free.app/statusupdate"
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
                        
            read.setup_read()

            read_data = None
            
            while True:
                print("Waiting for an ISO14443A card")
                try: 
                    read_data = read.loop_read()
                    print(f"89: {read_data}")
                    if not read_data:
                        continue
                    break
                except Exception:
                    pass

            create_tag(raspiSend["_owner"], raspiSend["nickname"], "nfc", read_data)
            
            requests.get(f"{url}/resolve", headers=headers)


            
        elif raspiReceive["status"]:
            is_written = False
            print("In raspiReceive")
            requests.post(f"{url}/pending", headers=headers)
            
            data = decrypt(raspiReceive["tag"]["data"])
            print(data)
            
            write.setup_write()

            while True:
                try: 
                    is_written = write.loop_write(data)
                    if not is_written:
                        continue
                    break

                except Exception:
                    pass
            
            requests.get(f"{url}/resolve", headers=headers)
            
        
def create_tag(_owner, nickname, type, data):
    headers = {"X-Mac-Address": "00:00:00:00:00:00"}
    # byte_string = bytes.fromhex(data)

    data = {"_owner": _owner, "nickname": nickname, "type": type, "data": data.decode()}
    
    url = "https://a37d-95-42-52-106.ngrok-free.app/jrn/tags/"
    
    res = requests.post(url, headers=headers, json=data)
    print(res.json())
    if res.ok:
        print("Tag created")
       

if __name__ == '__main__':
    while True:
        try:
            get_status_checker()
        except Exception:
            pass
