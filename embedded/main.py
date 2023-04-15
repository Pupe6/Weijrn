import os
import time
import requests

from Crypto.Cipher import AES
from Crypto.Util import Padding

from pn532pi import Pn532, Pn532I2c, Pn532Spi, Pn532Hsu

# Custom modules
import read
import write

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

SERVER_URL = "http://localhost:8393"
UUID = "32d-ef2-7e5-4f0"
# MAC_ADDRESS = "00:00:00:00:00:00"


def encrypt(data: str) -> str:
    iv = os.urandom(IV_LENGTH)

    cipher = AES.new(bytes(ENCRYPTION_KEY), AES.MODE_CBC, iv)

    padded_data = Padding.pad(data.encode(), AES.block_size)

    encrypted = cipher.encrypt(padded_data)

    return f"{iv.hex()}:{encrypted.hex()}"


def decrypt(data: str) -> str:
    [iv, encrypted_data] = data.split(":")

    cipher = AES.new(ENCRYPTION_KEY, AES.MODE_CBC, iv)

    decrypted = cipher.decrypt(encrypted_data)

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

        raspiSend = data["raspiSend"]
        raspiReceive = data["raspiReceive"]

        time.sleep(5)

        # Check if the status is pending
        if raspiSend["pending"] or raspiReceive["pending"]:
            continue

        if raspiSend["status"]:
            # Set the status to pending
            requests.post(f"{status_update_url}/pending", headers=headers)

            read.setup_read()

            # Start trying to read from the tag
            read_data = None
            while True:
                print("Waiting for an ISO14443A card")
                try:
                    read_data = read.loop_read()
                    # print(read_data)

                    if not read_data:
                        continue

                    break
                except Exception:
                    pass

            create_tag(raspiSend["nickname"], "nfc", read_data)

            # Set the status to resolved
            requests.get(f"{status_update_url}/resolve", headers=headers)

        elif raspiReceive["status"]:
            # Set the status to pending
            requests.post(f"{status_update_url}/pending", headers=headers)

            data = decrypt(raspiReceive["tag"]["data"])
            # print(data)

            # Start trying to write to the tag
            write.setup_write()

            is_written = False
            while True:
                try:
                    is_written = write.loop_write(data)

                    if not is_written:
                        continue
                    else:
                        break
                except Exception:
                    pass

            # Set the status to resolved
            requests.get(f"{status_update_url}/resolve", headers=headers)


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
