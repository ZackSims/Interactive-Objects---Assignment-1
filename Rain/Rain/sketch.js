/* 
With a portion of the source code coming from Doug Whitton, in this design I worked with a basic rain idea, text and new sounds to finalize this idea.

In this idea the potentionmeter is used to create the sound of lightning, the light sensor is used to create rain and the button creates wind.
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


let drop = [];

function setup() {



    createCanvas(windowWidth, windowHeight);

    for (var i = 0; i < 200; i++) {
        drop[i] = new Drop();
    }
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




    song1 = createAudio('assets/Wind.mp3');
    song2 = createAudio('assets/Rain Sound Effect Short.mp3');
    song3 = createAudio('assets/thunder.mp3');
}



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



    background(0, 0, 0);

    textSize(40);
    textAlign(CENTER);
    text("Get out of the rain!", windowWidth / 2, windowHeight / 2);

    for (var i = 0; i < 200; i++) {
        drop[i].show();
        drop[i].update();
    }
    if (value3 < 50) {
        Drop();
        playLight();



    }
    if (value3 > 0) {
        background(0, 0, 0);
        song2.stop();

        textSize(40);
        textAlign(CENTER);
        text("Stay inside, a storm is coming!", windowWidth / 2, windowHeight / 2);


    }


    playButton();

    playTurn();

}

function Drop() {
    this.x = random(0, width);
    this.y = random(0, -height);
    this.show = function () {
        noStroke();
        fill(255);
        ellipse(this.x, this.y, random(1, 5), random(1, 5));
    }
    this.update = function () {
        this.speed = random(5, 10);
        this.gravity = 1.05;
        this.y = this.y + this.speed * this.gravity;

        if (this.y > height) {
            this.y = random(0, -height);
            this.gravity = 0;
        }
    }
}

function playButton() {
    if (value1 == 1) {
        song1.loop();

        background(0);
        textSize(40);
        textAlign(CENTER);
        text("The Wind is picking up!", windowWidth / 2, windowHeight / 2);


    }
    if (value1 == 0) {
        song1.stop();
    }
};

function playTurn() {
    if (value2 >= 1) {
        song3.loop();

    }
    if (value2 <= 1) {
        song3.stop();
    }
};





function playLight() {
    song2.loop();

};
