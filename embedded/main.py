import os
import time
import requests

from Crypto.Cipher import AES
from Crypto.Util import Padding

from pn532pi import Pn532, Pn532I2c, Pn532Spi, Pn532Hsu

# Custom modules
import read
import write
import formatcard
import ndeftoclassic

import RPi.GPIO as GPIO

# from myinterface import turnOff

# Set GPIO mode to BCM

# Load environment variables
from dotenv import load_dotenv

load_dotenv()

# Set the desired interface to True
interface = "I2C"

if interface == "SPI":
    PN532_SPI = Pn532Spi(Pn532Spi.SS0_GPIO8)
    nfc = Pn532(PN532_SPI)
elif interface == "HSU":
    PN532_HSU = Pn532Hsu(0)
    nfc = Pn532(PN532_HSU)
elif interface == "I2C":
    PN532_I2C = Pn532I2c(1)
    nfc = Pn532(PN532_I2C)

# Constants
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY").encode("utf-8")
IV_LENGTH = 16

SERVER_URL = "https://7ac9-78-154-14-184.ngrok-free.app"
UUID = "32d-ef2-7e5-4f0"

GPIO.setmode(GPIO.BCM)

GPIO.setup(4, GPIO.OUT)

GPIO.output(4, GPIO.LOW)


# ---------------------------

GPIO.setup(26, GPIO.OUT)

GPIO.output(26, GPIO.LOW)

time.sleep(1)

GPIO.output(26, GPIO.HIGH)


# MAC_ADDRESS = "00:00:00:00:00:00"


def encrypt(data: str) -> str:
    iv = os.urandom(IV_LENGTH)

    cipher = AES.new(bytes(ENCRYPTION_KEY), AES.MODE_CBC, iv)

    padded_data = Padding.pad(data.encode(), AES.block_size)

    encrypted = cipher.encrypt(padded_data)

    return f"{iv.hex()}:{encrypted.hex()}"


def decrypt(data: str) -> str:
    [iv_hex, encrypted_data] = data.split(":")
    iv = bytes.fromhex(iv_hex)

    cipher = AES.new(bytes(ENCRYPTION_KEY), AES.MODE_CBC, iv)

    decrypted = cipher.decrypt(bytes.fromhex(encrypted_data))

    unpadded = Padding.unpad(decrypted, AES.block_size)

    return unpadded.decode("utf-8")


# Requests
def get_status_checker():
    status_update_url = f"{SERVER_URL}/statusupdate"

    while True:
        # headers for uuid
        headers = {"X-UUID": UUID}
        # headers = {"X-Mac-Address": MAC_ADDRESS}

        response = requests.get(status_update_url, headers=headers)
        data = response.json()
        # print(data)

        raspiSend = data["raspiSend"]
        raspiReceive = data["raspiReceive"]

        # print(raspiReceive)
        time.sleep(5)

        # Check if the status is pending
        if raspiSend["pending"] or raspiReceive["pending"]:
            continue

        if raspiSend["status"]:
            # Set the status to pending
            print("I'm in RaspiSend")
            requests.post(f"{status_update_url}/pending", headers=headers)

            read.setup_read()

            # Start trying to read from the tag
            read_data = None
            while True:
                print("Waiting for an ISO14443A card")
                try:
                    read_data = read.loop_read()
                    print(read_data)

                    if not read_data:
                        continue

                    break
                except Exception:
                    pass

            create_tag(raspiSend["nickname"], "nfc", read_data)

            # Set the status to resolved
            requests.post(f"{status_update_url}/resolve", headers=headers)

            GPIO.output(26, GPIO.LOW)

            time.sleep(1)

            GPIO.output(26, GPIO.HIGH)

        elif raspiReceive["status"]:
            print("Im in RaspiReceive")
            print(raspiReceive["tag"])
            # Set the status to pending
            requests.post(f"{status_update_url}/pending", headers=headers)

            data = decrypt(raspiReceive["tag"]["data"])
            print(data)

            # Start trying to write to the tag
            write.setup_write()
            # formatcard.setup_format()

            is_written = False
            is_emulated = False

            while True:
                try:
                    GPIO.output(4, GPIO.LOW)  # turn off emulation relay
                    is_written = write.loop_write(data)
                    print("I tried to write to card")

                    # print(f"is written: {is_written}")
                    GPIO.output(4, GPIO.HIGH)
                    print("I have set emulation on")
                    formatcard.loop_format()
                    ndeftoclassic.loop_ndefToClassic()
                    print("I have formated successfully")
                    time.sleep(0.1)
                    is_emulated = write.loop_write(data)

                    if not is_written and not is_emulated:
                        time.sleep(2)
                        continue
                    else:
                        print("Success")
                        break
                except Exception:
                    pass

            GPIO.output(26, GPIO.LOW)  # turn off module

            time.sleep(10)

            GPIO.output(4, GPIO.LOW)  # turn off emulation relay

            GPIO.output(26, GPIO.HIGH)  # turn on module

            # GPIO.output(26, GPIO.LOW)# turn on module
            # time.sleep(5)
            # GPIO.output(4, GPIO.LOW)# turn off emulation relay

            # Set the status to resolved
            requests.post(f"{status_update_url}/resolve", headers=headers)


def create_tag(nickname: str, type: str, data: str):
    # headers for uuid
    headers = {"X-UUID": UUID}
    # headers = {"X-Mac-Address": MAC_ADDRESS}

    data = {
        "nickname": nickname,
        "type": type,
        "data": data.decode()
    }

    create_tag_url = f"{SERVER_URL}/tags"
    res = requests.post(create_tag_url, headers=headers, json=data)

    if res.ok:
        print("Tag created")
    else:
        print("Tag creation failed")


if __name__ == "__main__":
    while True:
        try:
            get_status_checker()
        except Exception:
            pass
