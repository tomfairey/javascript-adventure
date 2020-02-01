let directions = ["north","south","east","west"];
let inventory = [];
window.visited = [];

class Location {
    constructor(name, description, item = false) {
        this.name = name;
        this.description = description;
        /* <COMPLETE> Task 7 - Add a visited attribute to Locations */
        this.visited = false;
        /* </COMPLETE> */
        this.linkLocations = {};
        if(item !== null) {
            this.item = item;
        } else {
            this.item = false;
        }
    }
    getName = function() {
        return this.name;
    }
    addLink = function(direction, destination) {
        if(!directions.includes(direction)) {
            throw("Invalid direction");
        } else if (!locations[destination]) {
            throw("Invalid destination");
        } else {
            this.linkLocations[direction] = {"direction": direction, "destination": destination};
            return true;
        }
    }
    /* <COMPLETE> Task 2 - Add a display() method to Location, which prints the description on linked locations and use it here */
    display = function() {
        Output(this.description);
        if(this.visited === false) {
            Output("This is somewhere new...", "YELLOW")
            this.visited = true;
            window.visited.push(this.name);
        } else {
            Output("You have been here before...", "YELLOW")
        }
        /* <COMPLETE> Task 4 - Add an Item to a location and make it seen in the display() */
        Output("There is a \""+this.item.name+"\"!", "YELLOW");
        return true;
        /* </COMPLETE> */
    }
    /* </COMPLETE> */
}

/* <COMPLETE> Task 3 - Add an Item class that has a name */

class Item {
    constructor(name, canPickUp) {
        this.name = name;
        if(canPickUp === false) {
            this.pickedUp = true;
        } else {
            this.pickedUp = false;
        }
    }
    pickUp = function() {
        if(this.pickedUp === true) {
            Output("You may not pick this up", "RED");
            return false;
        } else {
            this.pickedUp = true;
            Output("\""+this.name+"\"", "has been acquired...", "YELLOW");
            inventory.push(this.name);
            return true;
        }
    }
}

/* </COMPLETE> */

function Output() {
    let string = "";
    let stringEndSpan = false;
    let argumentArray = Array.from(arguments);
    let colourArray = ["RED", "YELLOW", "BLUE"];
    argumentArray.forEach(function(arg) {
        if(string !== "") {
            string += " ";
            if(colourArray.includes(argumentArray[argumentArray.length - 1])) {
                if(arg !== argumentArray[argumentArray.length - 1]) {
                    string += arg;
                }
            } else {
                string += arg;
            }
        } else {
            string += "<code>";
            if(colourArray.includes(argumentArray[argumentArray.length - 1])) {
                string += "<span style=\"color: "+argumentArray[argumentArray.length - 1]+"\">";
                stringEndSpan = true;
                if((argumentArray.length - 1) !== 0) {
                    string += arg;
                }
            } else {
                string += arg;
            }
        }
    })
    if(stringEndSpan) {
        string += "</span>";
    }
    string += "</code><br />\n";

    let consoleHTML = document.getElementById("console");
    consoleHTML.innerHTML += string;
    consoleHTML.scrollTop = consoleHTML.scrollHeight;

    window.logOfTurnOutputs += string;

    return;
}

function allowInput() {
    document.getElementById("userTextInput").value = "";
    document.getElementById("userTextInput").disabled = false;
    document.getElementById("userTextButton").disabled = false;
    document.getElementById("userTextInput").focus();
}

function handleInput(userInput = "") {
    userInput = userInput.toLowerCase();

    if(directions.includes(userInput)) {
        let availableLinkLocations = [];
        Object.keys(currentLocation.linkLocations).forEach(element => {
            availableLinkLocations.push(currentLocation.linkLocations[element].direction);
        });
        if(!availableLinkLocations.includes(userInput)) {
            Output("You cannot go that way", "RED");
        } else {
            let newLocationID = currentLocation.linkLocations[userInput].destination
            currentLocation = locations[newLocationID]
        }
    } else if(userInput === "location") {
        let string = "";
        for(i = 0; i < 5; i++) {
            string += currentLocation.getName()+". ";
        }
        Output(string);
    } else if(userInput === "inventory") { /* <COMPLETE> Task 6 - Add a command list the inventory */
        if(inventory.length !== 0) {
            Output("In your inventory is:", "YELLOW");
            for(i = 0; i <= (inventory.length - 1); i++) {
                if((inventory.length - 1) !== i) {
                    Output(inventory[i] + ",", "YELLOW");
                } else {
                    Output(inventory[i], "YELLOW");
                }
            }
        } else {
            Output("Your inventory is empty!", "YELLOW");
        }
        /* </COMPLETE> */
    } else if(userInput === "pickup") { /* <COMPLETE> Task 5 - Add a command to pick up an item and add it to the inventory */
        currentLocation.item.pickUp();
        /* </COMPLETE> */
    } else {
        let string = "Try one of: ";
        i = 0;
        directions.forEach(function(direction) {
            i++;
            string += direction;
            if(i !== directions.length) {
                string += ", "
            }
        });
        Output(string, "YELLOW");
    }
    commenceTurn();
}

/* <COMPLETE> Task 1 - Add at least 3 new locations */

let locations = {
    "woods": new Location("The woods", "You are in the woods. There are a lot of trees.", new Item("Jar o' Hair Grease", false)),
    "lake": new Location("The lake", "You are by the lake. It is very watery.", new Item("T-shirt", true)),
    "meadow": new Location("Long meadow", "You are by the meadow. It is very long.", new Item("Sheep Comb", true)),
    "hotel": new Location("Luxury hotel", "You are by the hotel. It appears very luxurious.", new Item("Branded Napkin", true)),
    "cruiseShip": new Location("Cruise ship", "You are by the cruise ship. There is a bottle shaped hole in the side.", new Item("Bottle Cork", true))
};

locations["woods"].addLink("north", "lake");
locations["woods"].addLink("south", "meadow");
locations["woods"].addLink("west", "cruiseShip");

locations["lake"].addLink("east", "hotel");
locations["lake"].addLink("south", "woods");

locations["hotel"].addLink("west", "lake");

locations["meadow"].addLink("north", "woods");

locations["cruiseShip"].addLink("east", "woods");

/* </COMPLETE> */

let currentLocation = locations["woods"];

function commenceTurn() {
    try {
        document.getElementById("console").innerHTML; // = "";
    } catch(e) {
        document.body.innerHTML += "<div id=\"console\"></div><div id=\"input\"><input id=\"userTextInput\" type=\"text\" disabled /><button id=\"userTextButton\" disabled>Enter</button></div>";
        document.getElementById("userTextButton").addEventListener("click", function(e) {
            document.getElementById("userTextInput").disabled = true;
            document.getElementById("userTextButton").disabled = true;

            let userInput = document.getElementById("userTextInput").value;

            Output("> ", userInput, "BLUE");
            handleInput(userInput);
        });
        document.getElementById("userTextInput").addEventListener("keyup", function(event) {
            event.preventDefault();
            if(event.keyCode === 13) {
                document.getElementById("userTextButton").click();
            }
        });
        Output("Commands: inventory|pickup|location alongside the directions shown...", "\n", "BLUE");
    }

    currentLocation.display();

    Object.keys(currentLocation.linkLocations).forEach(element => {
        Output(currentLocation.linkLocations[element].direction + ":", locations[currentLocation.linkLocations[element].destination].name);
    });

    allowInput();
}

window.logOfTurnOutputs = "";
document.addEventListener('DOMContentLoaded', commenceTurn, false);

/*
# TO DO : Task 8 - Add a "map" command which shows all the places you have been and how they connect
*/