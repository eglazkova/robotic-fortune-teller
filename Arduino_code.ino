#include <FastLED.h>
#include <Adafruit_Thermal.h>
#include "Adafruit_Thermal.h"
#include "adalogo.h"
#include "adaqrcode.h"
#include "SoftwareSerial.h"
#define TX_PIN 6 // Arduino transmit  YELLOW WIRE  labeled RX on printer
#define RX_PIN 5 // Arduino receive   GREEN WIRE   labeled TX on printer

SoftwareSerial mySerial(RX_PIN, TX_PIN); // Declare SoftwareSerial obj first
Adafruit_Thermal printer(&mySerial);     // Pass addr to printer constructor

String message = "";         // a String to hold incoming data

// How many leds in your strip?

//check our new LEDs

#define NUM_LEDS 40

#define DATA_PIN 8


// Define the array of leds
CRGB leds[NUM_LEDS];

void blinkLEDs(int n){
  for(int j = 0; j<n; j++){
    for(int i = 0; i<NUM_LEDS; i++){

     //leds[i] = CRGB::Red;
      
     leds[i] = CRGB::Red;
      FastLED.show();
    }
    delay(100);
    // Now turn the LED off, then pause
    for(int i =0; i<NUM_LEDS; i++){
      leds[i] = CRGB::Black;
      FastLED.show();
    }
    delay(100);
  }
}

void setup() {

  Serial.begin(9600);  // Initialize SoftwareSerial
  mySerial.begin(19200); // Use this instead if using hardware serial
  printer.begin();        // Init printer (same regardless of serial type)
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS);

}

void loop() {
   if (Serial.available() > 0) {
    // read the incoming:
    //blinkLEDs(6);
      blinkLEDs(3);
      message = Serial.readString();// read the incoming data as string

      printer.upsideDownOn();
      
      printer.justify('C');
      printer.setSize('M');
      printer.println(message+"\r\n");
      printer.println("                                   ");
      //blinkLEDs(6);
     blinkLEDs(3);
      
  }

}
