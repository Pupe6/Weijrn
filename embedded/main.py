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
import datetime
import requests

from multiprocessing import Process



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

"""
async def status_update_checker():
    async with aiohttp.ClientSession() as session:
        async with session.get("https://5800-194-141-252-114.eu.ngrok.io/statusupdate", headers=headers) as response:
            body = await response.json()
            raspiSend = body["raspiSend"]
            raspiReceive = body["raspiReceive"]
            await asyncio.sleep(SECONDS_TO_WAIT)
            
            if raspiReceive.status == True:
                tag = raspiReceive.tag
            #receive tag here
            elif raspiSend.status == True:
                pass
            # create tags here                                                                                                                                                                              
"""

def get_status_checker():
    while True:
        headers = {'X-MAC-Address' : '00:00:00:00:00:00'}
        response = reque
        time.sleep(5)

def create_tag():
    SECONDS_TO_WAIT = 5
    current_time = datetime.datetime.now().strftime("%d-%m-%Y-%H-%M-%S")

    headers = {"X-Mac-Address": "00:00:00:00:00:00"}
    data = {"nickname": "test", "type": "nfc", "data": "1234"}

    url = "https://5800-194-141-252-114.eu.ngrok.io/statusupdate"

    async def create_tag():
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=data) as response:
                print("Sending request")
                print(await response.text())
                # print(await response.json())
                await asyncio.sleep(SECONDS_TO_WAIT)
                print("Request sent")
                if response.ok:
                    resolutionResponse = requests.get("https://5800-194-141-252-114.eu.ngrok.io/statusupdate/resolve", headers=headers)
                    print(resolutionResponse.json())
                    # current_time = datetime.datetime.now().strftime("%d-%m-%Y-%H-%M-%S")

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
    
    

    


