#include <Wire.h>
#include <PN532_I2C.h>
#include <PN532.h>
#include <NfcAdapter.h>
PN532_I2C pn532_i2c(Wire);
NfcAdapter nfc = NfcAdapter(pn532_i2c);
String tagId = "None";
byte nuidPICC[4];



void writeNFC() 
{
 //Serial.println("\nPlace a formatted Mifare Classic NFC tag on the reader.");
    if (nfc.tagPresent()) {
        NdefMessage message = NdefMessage();
        message.addUriRecord("https://hacktues.bg");

        bool success = nfc.write(message);
        if (success) {
          //Serial.println("Success. Try reading this tag with your phone.");
        } else {
          //Serial.println("Write failed.");
        }
    }
    delay(5000);
}


void formatNFC() 
{
 //Serial.println("\nPlace an unformatted Mifare Classic tag on the reader.");
    if (nfc.tagPresent()) {

        bool success = nfc.format();
        if (success) {
          //Serial.println("\nSuccess, tag formatted as NDEF.");
        } else {
          //Serial.println("\nFormat failed.");
        }

    }
    delay(5000);
} 

void readNFC() 
{
 if (nfc.tagPresent())
 {
   NfcTag tag = nfc.read();
   tag.print();
   tagId = tag.getUidString();
 }
 delay(5000);
}



void setup(void) 
{
 Serial.begin(115200);
 Serial.println("System initialized");
 nfc.begin();
}
 
void loop() 
{
  int op = 0;
  ///ADD JOYSTICK CODE!!!
  ///ADD BUTTONS CODE!!!

  ///ADD UART CODE TO RASPBERRY

  switch(op)
  {
    case 1:
      //Read
      readNFC();
    case 2:
      //Write 
      formatNFC();
      writeNFC();
    case 3:
      //Only Format
      formatNFC();

  }
  
}
