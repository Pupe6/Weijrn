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

int menu [5][5] = 
{
  {1,2,3,4,5},
  {6,7,8,9,10},
  {11,12,13,14,15},
  {16,17,18,19,20},
  {21,22,23,24,25}  
  
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
  if (*j < 4) {
    (*j)++;
  }
}

void move_right(int* i, int* j) {
  if (*j > 0) {
    (*j)--;
  }
}


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


int read_joystick() 
{
  int output;
  yValue = analogRead(joyY);
  xValue = analogRead(joyX);
  
  if (yValue < 300) {
    output = left;
  } else if (yValue > 500) {
    output = right;
  } else if (xValue < 300) {
    output = up;
  } else if (xValue > 500) {
    output = down;
  } else {output = none;}
  delay(200);
  return output;
}

int message;



void setup(void) 
{
 Serial.begin(9600);
 Serial.println("System initialized");
 nfc.begin();
}
 

int i = 0;
int j = 0;

void loop() 
{
  
  int currentJoystickValue = read_joystick();

  yValue = analogRead(joyY);
  xValue = analogRead(joyX);
  //Serial.println(xValue);
  //Serial.println(yValue);


    
    switch (currentJoystickValue) 
    {
      
      case up:
        move_up(&i, &j);
        message = 0;
        message += i*10 + j;
        Serial.println(String(message));
        break;
      case down:
        move_down(&i, &j);
        message = 0;
        message += i*10 + j;
        Serial.println(String(message));
        break;
      case right:
        move_right(&i, &j);
        message = 0;
        message += i*10 + j;
        Serial.println(String(message));
        break;
      case left:
        move_left(&i, &j);
        message = 0;
        message += i*10 + j;
        Serial.println(String(message));
        break;
      default: break;
      case none:
        break;
    }
    
    delay(300);
 
}
