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

bool exitbutton = false;

int xValue;
int yValue;

int menu [5][3] = 
{
  {1,2,3},
  {6,7,8},
  {11,12,13},
  {16,17,18},
  {21,22,23}  
  
};

int currentJoystickValue = 0;
int previousJoystickValue = 0;

//Joystick values
#define up    0
#define right 1
#define down  2
#define left  3
#define enter 4
#define none  5




void move_up(int* i, int* j) {
  if (*i > 0) {
    (*i)--;
  }
}

void move_down(int* i, int* j) {
  if (*i < 4) {
    (*i)++;
  }
}

void move_left(int* i, int* j) {
  if (*j < 2) {
    (*j)++;
  }
}

void move_right(int* i, int* j) {
  if (*j > 0) {
    (*j)--;
  }
}


void writeNFC(String txt) 
{
 //Serial.println("\nPlace a formatted Mifare Classic NFC tag on the reader.");
    if (nfc.tagPresent()) {
        NdefMessage message = NdefMessage();
        message.addUriRecord(txt);

        bool success = nfc.write(message);
        if (success) {
          //Serial.println("Success. Try reading this tag");
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

int read_button(){
  int okbutton;
  int backbutton;
  okbutton = digitalRead(2);
  backbutton = digitalRead(3);
  if (!okbutton == 1){
    if (!backbutton == 1){
      return 0;
    }else{return 1;}
  }
  else if (!backbutton == 1){
    return 2;
  }else {return 0;}
}
int read_joystick() 
{
  int output;
  yValue = analogRead(joyY);
  xValue = analogRead(joyX);
  
  if (yValue < 300) {
    output = left;
  } else if (yValue > 500) {
    output = right;
  } else if (xValue < 250) {
    output = up;
  } else if (xValue > 500) {
    output = down;
  } else {output = none;}
  return output;
}

int message;


String pi_message;

String recieve_pi() {
  String pi_message = Serial.readStringUntil('\n');
  Serial.println(pi_message);
  return pi_message;
}

void setup(void) 
{
  Serial.begin(9600);
  Serial.println("System initialized");
  nfc.begin();
  pinMode(3, INPUT_PULLUP);
  pinMode(2, INPUT_PULLUP);
}
 

int i = 0;
int j = 0;

void loop() 
{
  delay(200);
  int currentJoystickValue = read_joystick();
  int buttonvalue = read_button();

    switch (currentJoystickValue) 
    {
      
      case up:
        move_up(&i, &j);
        message = 0;
        message += buttonvalue + i*100 + j*10;
        Serial.println(String(message));
        break;
      case down:
        move_down(&i, &j);
        message = 0;
        message += buttonvalue + i*100 + j*10;;
        Serial.println(String(message));
        break;
      case right:
        move_right(&i, &j);
        message = 0;
        message += buttonvalue + i*100 + j*10;
        Serial.println(String(message));
        break;
      case left:
        move_left(&i, &j);
        message = 0;
        message += buttonvalue + i*100 + j*10;
        Serial.println(String(message));
        break;
      default: break;
      
      case none:
        message += buttonvalue;
        Serial.println(String(message));
        message -= buttonvalue;
        break;
    }
    if(pi_message == "01")
    {
      readNFC();
    }else if(pi_message == "02")
    {
      delay(150);
      writeNFC(pi_message);   
    }else if(i == 0 && j == 2)
    {
      formatNFC();
    }
    
 
}
