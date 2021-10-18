/* 
Using my previous designs as a template, I created this final concept experimenting with more animations and audio
clips. For this design I took a sci-fi approach using very futuristic sound clips and creating a design based 
on what I heard and thought of.
*/


let osc;
let playing = false;
let serial;
let latestData = "waiting for data"; // you'll use this to write incoming data to the canvas
let splitter;
let diameter0 = 0,
    diameter1 = 0,
    diameter2 = 0;
let value1 = 0,
    value2 = 0,
    value3 = 0;
let song1, song2, song3;

let circleY = 0;


function setup() {


    createCanvas(windowWidth, windowHeight);
    frameRate(8)



    ///////////////////////////////////////////////////////////////////
    //Begin serialport library methods, this is using callbacks
    ///////////////////////////////////////////////////////////////////    


    // Instantiate our SerialPort object
    serial = new p5.SerialPort();

    // Get a list the ports available
    // You should have a callback defined to see the results
    serial.list();
    console.log("serial.list()   ", serial.list());

    //////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    // Assuming our Arduino is connected, let's open the connection to it
    // Change this to the name of your arduino's serial port
    serial.open("COM3");
    /////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    // Here are the callbacks that you can register

    // When we connect to the underlying server
    serial.on('connected', serverConnected);

    // When we get a list of serial ports that are available
    serial.on('list', gotList);
    // OR
    //serial.onList(gotList);

    // When we some data from the serial port
    serial.on('data', gotData);
    // OR
    //serial.onData(gotData);

    // When or if we get an error
    serial.on('error', gotError);
    // OR
    //serial.onError(gotError);

    // When our serial port is opened and ready for read/write
    serial.on('open', gotOpen);
    // OR
    //serial.onOpen(gotOpen);

    // Callback to get the raw data, as it comes in for handling yourself
    //serial.on('rawdata', gotRawData);
    // OR
    //serial.onRawData(gotRawData);
    song1 = createAudio('assets/Reverse.mp3');
    song2 = createAudio('assets/Beeps.mp3');
    song3 = createAudio('assets/Chimes.mp3');
}
////////////////////////////////////////////////////////////////////////////
// End serialport callbacks
///////////////////////////////////////////////////////////////////////////



// We are connected and ready to go
function serverConnected() {
    console.log("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
    console.log("List of Serial Ports:");
    // theList is an array of their names
    for (var i = 0; i < thelist.length; i++) {
        // Display in the console
        console.log(i + " " + thelist[i]);
    }
}

// Connected to our serial device
function gotOpen() {
    console.log("Serial Port is Open");
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
    console.log(theerror);
}



// There is data available to work with from the serial port
function gotData() {
    var currentString = serial.readLine(); // read the incoming string
    trim(currentString); // remove any trailing whitespace
    if (!currentString) return; // if the string is empty, do no more
    console.log("currentString  ", currentString); // println the string
    latestData = currentString; // save it for the draw method
    console.log("latestData" + latestData); //check to see if data is coming in
    splitter = split(latestData, ','); // split each number using the comma as a delimiter
    //console.log("splitter[0]" + splitter[0]); 
    value1 = splitter[0]; //put the first sensor's data into a variable
    value2 = splitter[1];
    value3 = splitter[2];



}

// We got raw data from the serial port
function gotRawData(thedata) {
    println("gotRawData" + thedata);
}


function draw() {
    background(0, 59, 89);




    if (value3 < 50) {
        playLight();
        strokeWeight();
        stroke(255);
        for (var x = 0; x <= width; x += 10) {
            for (var y = 0; y <= height; y += 20) {
                fill(random(255), 255, 255);
                ellipse(x, y, 25, 25);
            }
        }


    }
    if (value3 > 0) {
        song2.stop();
    }


    playButton();

    playTurn();

}

function playButton() {
    if (value1 == 1) {
        song1.loop();


        circle(1000, circleY, 200);
        fill(255);
        circleY = circleY + 100;
        if (circleY > height) {
            circleY = 0;


        }

    }
    if (value1 == 0) {
        song1.stop();
    }
};

function playTurn() {
    if (value2 >= 1) {
        song3.loop();



        stroke(random(255), 255, random(255));
        strokeWeight(20);

        line(random(width), random(height), random(width), random(height));

        line(random(width), random(height), random(width), random(height));

    }
    if (value2 <= 1) {
        song3.stop();
    }
};





function playLight() {
    song2.loop();

};
