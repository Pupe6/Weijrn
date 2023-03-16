import Adafruit_GPIO as GPIO
import Adafruit_GPIO.SPI as SPI

import ST7789 as TFT

import datetime

import os

import time
from gif import AnimatedGif
import time
from PIL import Image, ImageDraw, ImageFont, ImageColor

import numpy as np
import serial
import time

import asyncio
import requests

from multiprocessing import Process

from dotenv import load_dotenv
import os

import os
from Crypto.Cipher import AES


load_dotenv()



RST = 22            # Set GPIO pin# 15 (BCM 22) as reset control
DC  = 17            # Set GPIO pin# 11 (BCM 17) as DATA/command (NOT MOSI!)
LED = 27            # Set GPIO pin# 13 (BCM 27) as backlight control
SPI_PORT = 0
SPI_DEVICE = 0
SPI_MODE = 0b11
SPI_SPEED_HZ = 40000000
disp = TFT.ST7789(spi=SPI.SpiDev(SPI_PORT, SPI_DEVICE, max_speed_hz=SPI_SPEED_HZ),
    mode=SPI_MODE, rst=RST, dc=DC, led=LED)

# Initialize display.
disp.begin()

# Clear display
disp.clear()

ser = serial.Serial('/dev/ttyUSB0', 9600, timeout = 1.0)
time.sleep(3)
ser.reset_input_buffer()


# ser.close()

#ENCRYPTION, DECRYPTION CODE
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY").encode("utf-8")
IV_LENGTH = 16

def encrypt(text):
    iv = os.urandom(IV_LENGTH)
    cipher = AES.new(bytes(ENCRYPTION_KEY, "utf-8"), AES.MODE_CBC, iv)
    encrypted = cipher.encrypt(text.encode())
    return iv.hex() + ":" + encrypted.hex()

def decrypt(text):
    text_parts = text.split(":")
    iv = bytes.fromhex(text_parts[0])
    encrypted_text = bytes.fromhex(text_parts[1])
    cipher = AES.new(ENCRYPTION_KEY, AES.MODE_CBC, iv)
    decrypted = cipher.decrypt(encrypted_text)
    return decrypted.decode()

print(decrypt("802e21e08b6f4b82a73a8b6ed5a9e865:8d4126f3039107597058db00ed90a23e"))


def expand2square(pil_img, background_color):
    width, height = pil_img.size
    if width == height:
        return pil_img
    elif width > height:
        result = Image.new(pil_img.mode, (width, width), background_color)
        result.paste(pil_img, (0, (width - height) // 2))
        return result
    else:
        result = Image.new(pil_img.mode, (height, height), background_color)
        result.paste(pil_img, ((height - width) // 2, 0))
        return result


#image1 = Image.new("RGB", (disp.width, disp.height), "PURPLE")

#draw = ImageDraw.Draw(image1) #image1
#disp.display(Image.open("cat.jpg"))


fnt = ImageFont.truetype("Pillow/Tests/fonts/FreeMono.ttf", 30)


def rpi_to_arduino_send(text):
    ser.write((text + "\n").encode('utf-8')) #tuk mozhe i da e decode

# {'status': True, 'nickname': 'Test', 'pending': True}
# Ako status == True iziskva action osven ako pendinga ne e true

def get_status_checker():
    url = "https://ffbc-95-42-52-106.eu.ngrok.io/statusupdate" #da se proveri dali e vqrno
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
            if ser.in_waiting > 0:
                #tuk mozhe da ima problem trqbva da izpatim na arduino
                message = ser.readline().rstrip().decode('utf-8')#tuk mozhe i da e endcode
                print(message)
            
        elif raspiReceive["status"]:
            requests.post(f"{url}/pending", headers=headers) #mai trabva da se izpolzva get
            
            print(raspiReceive["tag"])
            
            data = decrypt(raspiReceive["tag"]["data"])
            print(data)
            rpi_to_arduino_send("02") #tova zashto se polzva
            time.sleep(0.1) #mai trqbva sleepa da e se promeni
            rpi_to_arduino_send(data)
            
            # NA ARDUINOTO WRITE NA TAGA NFC
            # rpi_to_arduino_send(data)
            
            
# def create_tag(nickname, type, data):
#     SECONDS_TO_WAIT = 5
#     current_time = datetime.datetime.now().strftime("%d-%m-%Y-%H-%M-%S")

#     headers = {"X-Mac-Address": "00:00:00:00:00:00"}
#     data = {"nickname": nickname, "type": type, "data": data}

#     url = "https://ffbc-95-42-52-106.eu.ngrok.io/jrn/tags/"

#     async def create_tag():
#         async with aiohttp.ClientSession() as session:
#             async with session.post(url, headers=headers, json=data) as response:
#                 print("Sending request")
#                 print(await response.text())
#                 # print(await response.json())
#                 await asyncio.sleep(SECONDS_TO_WAIT)
#                 print("Request sent")
#                 if response.ok:
#                     resolutionResponse = requests.get("https://5800-194-141-252-114.eu.ngrok.io/statusupdate/resolve", headers=headers)
#                     print(resolutionResponse.json())
#                     # current_time = datetime.datetime.now().strftime("%d-%m-%Y-%H-%M-%S")

def handle_main_code(op, subop, buttonValue):
    while True:
        fnt = ImageFont.truetype("Pillow/Tests/fonts/FreeMono.ttf", 30)

        
        time.sleep(0.01)
        ####
        if ser.in_waiting > 0:
            message = ser.readline().decode('utf-8').rstrip()
            
            if len(message) == 1:
                buttonValue == int(message[0])
                op = 0
                subop = 0
                
            elif len(message) == 2:
                subop = int(message[0])
                buttonValue = int(message[1])
                op = 0
            elif len(message) == 3:
                op = int(message[0])
                subop = int(message[1])
                buttonValue = int(message[2])


            #FIX OP != 0
            
          #  print(f"op -> ..{op}")
          #  print(f"subop -> {subop}")
          #  print(f"buttonval -> {buttonValue}")
            #0 nothing, 2 back, 1 ok
            ####

        if op == 0:
            if subop == 0:
                with Image.open("black.png").convert("RGBA") as base:
                    txt = Image.new("RGBA", (disp.width, disp.height) , (255, 255, 255, 1)) 
                    d = ImageDraw.Draw(txt)

                    d.text((5, 5), ">NFC", font=fnt, fill=(0, 255, 0, 255))
                    d.text((5, 55), " 125 KHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 105), " Sub-1 GHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 155), " IR", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 205), " More", font=fnt, fill=(0, 255, 0, 255)) # hacker green
            
                    out = Image.alpha_composite(base, txt)
                    disp.display(out)
                    
            

            if subop == 1:
                
                if buttonValue == 1:
                    disp.clear()                #backend function
                    with Image.open("black.png").convert("RGBA") as base:
                        txt = Image.new("RGBA", (disp.width, disp.height) , (255, 255, 255, 1)) 
                        d = ImageDraw.Draw(txt)

                        d.text((5, 85), "   SUCCESS", font=fnt, fill=(0, 255, 0, 255))
                        d.text((5, 135), "   SENT", font=fnt, fill=(0, 255, 0, 255))
                        out = Image.alpha_composite(base, txt)
                        disp.display(out)
                        time.sleep(0.5)
                else:
                
                    with Image.open("black.png").convert("RGBA") as base:
                        txt = Image.new("RGBA", (disp.width, disp.height) , (255, 255, 255, 1)) 
                        d = ImageDraw.Draw(txt)

                        d.text((5, 5), ">Read", font=fnt, fill=(0, 255, 0, 255))
                        d.text((5, 55), " 125 KHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                        d.text((5, 105), " Sub-1 GHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                        d.text((5, 155), " IR", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                        d.text((5, 205), " More", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                  
                        out = Image.alpha_composite(base, txt)
                        disp.display(out)
                            
                        time.sleep(0.3)
                
                
                    
                    
            if subop == 2:
                
                with Image.open("black.png").convert("RGBA") as base:
                    txt = Image.new("RGBA", (disp.width, disp.height) , (255, 255, 255, 1)) 
                    d = ImageDraw.Draw(txt)

                    d.text((5, 5), ">Format", font=fnt, fill=(0, 255, 0, 255))
                    d.text((5, 55), " 125 KHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 105), " Sub-1 GHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 155), " IR", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 205), " More", font=fnt, fill=(0, 255, 0, 255)) # hacker green
              
                    out = Image.alpha_composite(base, txt)
                    disp.display(out)
                    #time.sleep(0.3)
                    
                    
        if op == 1:
            if subop == 0:
                with Image.open("black.png").convert("RGBA") as base:
                    txt = Image.new("RGBA", (disp.width, disp.height) , (255, 255, 255, 1)) 
                    d = ImageDraw.Draw(txt)

                    d.text((5, 5), " NFC", font=fnt, fill=(0, 255, 0, 255))
                    d.text((5, 55), ">125 KHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 105), " Sub-1 GHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 155), " IR", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 205), " More", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                 
                    out = Image.alpha_composite(base, txt)
                    disp.display(out)
            

            if subop == 1:
                
                with Image.open("black.png").convert("RGBA") as base:
                    txt = Image.new("RGBA", (disp.width, disp.height) , (255, 255, 255, 1)) 
                    d = ImageDraw.Draw(txt)

                    d.text((5, 5), " NFC", font=fnt, fill=(0, 255, 0, 255))
                    d.text((5, 55), ">Read", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 105), " Sub-1 GHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 155), " IR", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 205), " More", font=fnt, fill=(0, 255, 0, 255)) # hacker green
              
                    out = Image.alpha_composite(base, txt)
                    disp.display(out)
                        
                    time.sleep(0.3)
                
                    
                    
                    
            if subop == 2:
                
                with Image.open("black.png").convert("RGBA") as base:
                    txt = Image.new("RGBA", (disp.width, disp.height) , (255, 255, 255, 1)) 
                    d = ImageDraw.Draw(txt)

                    d.text((5, 5), " NFC", font=fnt, fill=(0, 255, 0, 255))
                    d.text((5, 55), ">Format", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 105), " Sub-1 GHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 155), " IR", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 205), " More", font=fnt, fill=(0, 255, 0, 255)) # hacker green
     
                    out = Image.alpha_composite(base, txt)
                    disp.display(out)
                    #time.sleep(0.3)
                    

        if op == 2:
            if subop == 0:
                with Image.open("black.png").convert("RGBA") as base:
                    txt = Image.new("RGBA", (disp.width, disp.height) , (255, 255, 255, 1)) 
                    d = ImageDraw.Draw(txt)

                    d.text((5, 5), " NFC", font=fnt, fill=(0, 255, 0, 255))
                    d.text((5, 55), " 125 KHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 105), ">Sub-1 GHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 155), " IR", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 205), " More", font=fnt, fill=(0, 255, 0, 255)) # hacker green
               
                    out = Image.alpha_composite(base, txt)
                    disp.display(out)
            

            if subop == 1:
                
                with Image.open("black.png").convert("RGBA") as base:
                    txt = Image.new("RGBA", (disp.width, disp.height) , (255, 255, 255, 1)) 
                    d = ImageDraw.Draw(txt)

                    d.text((5, 5), " NFC", font=fnt, fill=(0, 255, 0, 255))
                    d.text((5, 55), " 125 KHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 105), ">Read", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 155), " IR", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 205), " More", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                  
                    out = Image.alpha_composite(base, txt)
                    disp.display(out)
                        
                
                    
                    
                    
            if subop == 2:
                
                with Image.open("black.png").convert("RGBA") as base:
                    txt = Image.new("RGBA", (disp.width, disp.height) , (255, 255, 255, 1)) 
                    d = ImageDraw.Draw(txt)

                    d.text((5, 5), " NFC", font=fnt, fill=(0, 255, 0, 255))
                    d.text((5, 55), " 125 KHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 105), ">Format", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 155), " IR", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 205), " More", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                  
                    out = Image.alpha_composite(base, txt)
                    disp.display(out)
                    #time.sleep(0.3)
                    
        if op == 3:
            if subop == 0:
                with Image.open("black.png").convert("RGBA") as base:
                    txt = Image.new("RGBA", (disp.width, disp.height) , (255, 255, 255, 1)) 
                    d = ImageDraw.Draw(txt)

                    d.text((5, 5), " NFC", font=fnt, fill=(0, 255, 0, 255))
                    d.text((5, 55), " 125 KHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 105), " Sub-1 GHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 155), ">IR", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 205), " More", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    
                    out = Image.alpha_composite(base, txt)
                    disp.display(out)
        

            if subop == 1:
                
                with Image.open("black.png").convert("RGBA") as base:
                    txt = Image.new("RGBA", (disp.width, disp.height) , (255, 255, 255, 1)) 
                    d = ImageDraw.Draw(txt)

                    d.text((5, 5), " NFC", font=fnt, fill=(0, 255, 0, 255))
                    d.text((5, 55), " 125 KHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 105), " Sub-1 GHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 155), ">Read", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 205), " More", font=fnt, fill=(0, 255, 0, 255)) # hacker green
          
           
                    out = Image.alpha_composite(base, txt)
                    disp.display(out)
                        
                
                    
                    
            if subop == 2:
                
                with Image.open("black.png").convert("RGBA") as base:
                    txt = Image.new("RGBA", (disp.width, disp.height) , (255, 255, 255, 1)) 
                    d = ImageDraw.Draw(txt)

                    d.text((5, 5), " NFC", font=fnt, fill=(0, 255, 0, 255))
                    d.text((5, 55), " 125 KHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 105), " Sub-1 GHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 155), ">Format", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    d.text((5, 205), " More", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                    
                    out = Image.alpha_composite(base, txt)
                    disp.display(out)
                    #time.sleep(0.3)
                
       

if __name__ == '__main__':
    op = 0 # change later with joystick code
    subop = 0
    buttonValue = None
    p2 = Process(target = get_status_checker)
    p2.start()
    
    p1 = Process(target = handle_main_code, args = (op, subop, buttonValue))
    p1.start()
    
    
    

    


