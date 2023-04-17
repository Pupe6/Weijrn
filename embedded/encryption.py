import os

from Crypto.Cipher import AES
from Crypto.Util import Padding

# Load environment variables
from dotenv import load_dotenv

load_dotenv()

# Constants
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY").encode("utf-8")
IV_LENGTH = 16


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
