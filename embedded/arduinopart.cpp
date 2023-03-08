#include <Wire.h>
#include <PN532_I2C.h>
#include <PN532.h>
#include <NfcAdapter.h>
PN532_I2C pn532_i2c(Wire);
NfcAdapter nfc = NfcAdapter(pn532_i2c);
String tagId = "None";
byte nuidPICC[4];

#define joyX A0
#define joyY A1

int xValue;
int yValue;
int op = 0;
int opNFC = 0;
bool confirmation = false;


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

int ReadJoystick(int option)
{
    xValue = analogRead(joyX);
  
    if(xValue < 300)
    {
      option--;
      delay(100);
    }else if(xValue > 550)
    { 
      option++;
      delay(100);
    }
  delay(10);
  return option;
  
}

int ReadConfirmation(int conf)
{
    yValue = analogRead(joyY);

    if(yValue < 300)
    {
      conf = true;
    
    }else if(yValue > 550)
    {
      conf = false;
    }
    delay(10);
    return conf;

}
void setup(void) 
{
 Serial.begin(115200);
 Serial.println("System initialized");
 nfc.begin();
 op = ReadJoystick(op);
}
 
void loop() 
{

  ///ADD BUTTONS CODE!!!

  ///ADD UART CODE TO RASPBERRY
  //ReadJoystick(op);

  
  switch(op)
  {
    
    case 1: // IZBIRAM NFC
     //ASK FOR MAIN OP
    confirmation = ReadConfirmation(confirmation); //ASK FOR CONF

      if(confirmation == true)
      { // VLIZAM V NFC
        Serial.println("az sum v NFC list");
        opNFC = ReadJoystick(opNFC); //ASK FOR opNFC
        
        if(opNFC == 1)
        {
            Serial.println("az sum v NFC list option1")
            confirmation = false;
            
            confirmation = ReadConfirmation(confirmation); //ASK FOR CONF
            
            if(confirmation == true)
            {
               readNFC();
               confirmation = false;
            }
            
        }else if(opNFC == 2)
        {
            Serial.println("az sum v NFC list option2")
            confirmation = false;

            confirmation = ReadConfirmation(confirmation); //ASK FOR CONF

            if(confirmation == true)
            {
               formatNFC();
               writeNFC();
               confirmation = false;
            }
            
        }else if(opNFC == 3)
        {
            Serial.println("az sum v NFC list option2")
            confirmation = false;

            confirmation = ReadConfirmation(confirmation); //ASK FOR CONF

            if(confirmation == true)
             {
                formatNFC();
             }
            
        }else 
        {
          opNFC = ReadJoystick(opNFC);
        }
        
       }//conf na NFC scob 😂
     default:
        op = ReadJoystick(op);     
     } // skobata na switcha
      
    }
    Serial.print("option -> ");
    Serial.println(op);
    Serial.print("conf -> ");
    Serial.println(confirmation);
    delay(100);
    
}


