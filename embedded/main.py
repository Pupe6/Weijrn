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

# Clear display.
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
op = 0 # change later with joystick code
subop = 0

fnt = ImageFont.truetype("Pillow/Tests/fonts/FreeMono.ttf", 30)

currenntop = op
lastop = None

SubopCheck = False

while True: 
    time.sleep(0.5)
    time.sleep(0.01)
    if ser.in_waiting > 0:
        message = ser.readline().decode('utf-8').rstrip()
        op = int(message)
        currentop = op
        subop = op % 10
        #very imp for subop to be over op
        op = op // 10
        print(f"op -> ..{op}")
        print(f"subop -> {subop}")
        
        SubopCheck = not SubopCheck



        

    if op == 0:
        if(SubopCheck == False):
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
            
            SubopCheck = True
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
                    
                time.sleep(0.01)
            
                
                
        if subop == 2:
            
            SubopCheck = True
            with Image.open("black.png").convert("RGBA") as base:
                txt = Image.new("RGBA", (disp.width, disp.height) , (255, 255, 255, 1)) 
                d = ImageDraw.Draw(txt)

                d.text((5, 5), ">Write", font=fnt, fill=(0, 255, 0, 255))
                d.text((5, 55), " 125 KHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                d.text((5, 105), " Sub-1 GHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                d.text((5, 155), " IR", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                d.text((5, 205), " More", font=fnt, fill=(0, 255, 0, 255)) # hacker green

                out = Image.alpha_composite(base, txt)
                disp.display(out)
        if subop == 3:
            
            
            SubopCheck = True
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
        if subop == 4:
            
            
            SubopCheck = True

            with Image.open("black.png").convert("RGBA") as base:
                txt = Image.new("RGBA", (disp.width, disp.height) , (255, 255, 255, 1)) 
                d = ImageDraw.Draw(txt)

                d.text((5, 5), ">---", font=fnt, fill=(0, 255, 0, 255))
                d.text((5, 55), " 125 KHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                d.text((5, 105), " Sub-1 GHz", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                d.text((5, 155), " IR", font=fnt, fill=(0, 255, 0, 255)) # hacker green
                d.text((5, 205), " More", font=fnt, fill=(0, 255, 0, 255)) # hacker green

                out = Image.alpha_composite(base, txt)
                disp.display(out)
                

                
                

    

            
    

    #itn shte dobavqme posleee

            

#disp.display(out)
