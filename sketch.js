//triggers to start and stop speech recording 
let uDist = 0;
let deviceName = "max"
let hello = "hello " + deviceName;
let goodbye = "bye " + deviceName;
let fortuneTellerIsActive = false;

//keywords
let keywords = ["love","happen", "love", "death", "die", "rich", "health", "healthy", "wintershow", "ITP", "happy", "money", "friends", "job", "boyfriend", "girlfriend", "mom", "dad", "family", "happy", "future", "technology", "lucky", "marry", "pcomp", "ICM", "career", "successful"];


let fortune = ["Love is nonsense, forget it.", "Something very bad", "You are gonna soon regret things you did for love. Think twice.", "Death is not that bad, trust me.", "You are not gonna die in a week. The rest is unclear.","You can be happy and poor at the same time.", "Something concerning your mental health is going to happen soon. Are you an ITP student?", "You’re not gonna feel well next week. Stay at home, sleep (haha, I know you can't!)", "Not everyone is supposed to be a winner. You know what I mean?", "Watch your back while you’re here.", "People are not meant to be happy.", "Money is not everything.", "Keep you enemies close, and friends… Are you sure you have any of those?", "It is not necessarily that you’re gonna find a good job someday. Sorry about that.", "Sometimes it is better to be all alone. You know what I mean, right?", "Sometimes it is better to be all alone. You know what I mean, right?", "You should have listened to your mom. Now it is too late.", "You should have listened to your dad. Now it is too late.", "Get your own life!", "Your future is dark.", "Your future is dark.", "Technology is cold and cruel. Leave for good.", "You’re not supposed to be lucky, sorry.", "The answer is simply NO. Yes, you got me right.","Pcomp is not your thing, sorry.", "ICM is not your thing, sorry.", "Not everybody should have a wonderful career, you know.", "Not everybody is supposed to be successful, you know."];

//the answers for questions without key words
let abstractAnswers = ["You are gonna soon regret things you did for love. Think twice.", "Death is not that bad, trust me.","Something concerning your mental health is going to happen soon. Are you an ITP student?", "I have no clue about your future, it is way too dark.", "You future is uncertain, YOLO.", "You will die alone and poorly dressed. Just kidding", "An alien of some sort will be appearing to you shortly.", "You will be hungry again in one hour.", "The road to riches is paved with homework.", "You’re not gonna feel well next week. Stay at home, sleep (haha, I know you can't!)","Not everyone is supposed to be a winner. You know what I mean?", "Your future is dark.", "Technology is cold and cruel. Leave for good.", "Pcomp is not your thing, sorry."];

//serial communication part
let serial;
let portName = "/dev/tty.usbmodem14101";
let inData; 
let outByte = 0;
let speechRec;
//let robot;

function setup() {
  noCanvas();
    

  serial = new p5.SerialPort();
  serial.on('data',serialEvent);
  serial.on('error',serialError);
  serial.open(portName);

  //Robot speak
  //robot = new p5.Speech(); 
  
  startSpeechRec();
}

function startSpeechRec(){
  
//part for detecting speech 
  let lang=navigator.language||'en-US';
  speechRec=new p5.SpeechRec(lang,gotSpeech);
  let continuous=true;
  let interim=false;
  speechRec.start(continuous,interim);
}

function gotSpeech(){
  
  if(speechRec.resultValue){
   let msg = speechRec.resultString.toLowerCase();
   if(msg.includes("hello") || msg.includes("hi")){
     fortuneTellerIsActive = true;
     console.log("Fortune Teller is working");
     return;
   }
   if(msg.includes("bye") || msg.includes("goodbye")){
     fortuneTellerIsActive = false
     console.log("Goodbye human");
     return;
   }
    
  }
  
  if(speechRec.resultValue && fortuneTellerIsActive === true ){
    let foundAnswer = false;
    if(speechRec.resultString.length < 3 ) {
       // not enough words to send any answer
       return; 
    }
    console.log("You asked: " + speechRec.resultString);
    
    //Trying to find a keywords that match to what was said
    for(var i = 0; i<keywords.length; i++){
       if(speechRec.resultString.includes(keywords[i])){ 
           //Found a keyword, shows the fortune message.
           foundAnswer = true;
           showFortune(fortune[i]);
           break;
       }
    }
    
    //Didn't find keywords
    if(foundAnswer === false){
       // abstract answers go here, we randomly pick one setence from the array of abstract answers
      let r = int(random(0, abstractAnswers.length-1));
      let msg = abstractAnswers[r];
      showFortune(msg);
    }
  } 
}

//Display in the console.log the fortune message and send it to the serial port
function showFortune(message){
  console.log("The fortune teller answer: " + message);
  
  fortuneTellerIsActive = false; //Stop listening after we print out an answer 
  console.log("stop listening");
  
  serial.write (message);
  //robot.speak(message);
}


//that was supposed to be ultrasonic part but we changed to triggers "hi!", "bye!"
function serialEvent(){
  let humanDistance = int(serial.readStringUntil("\r\n"));
  if(humanDistance < 1000){
     startSpeechRec()
   }
  
  
}
  
function serialError(err){
  console.log(err);
}
