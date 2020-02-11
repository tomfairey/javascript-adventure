// Define array of valid directions the player can choose
let directions = ["north","south","east","west"];
// Define an empty array to be used to hold the inventory contents later
let inventory = [];
// Define an empty array to be used to store the name of all visited locations
let visited = [];

// Define an ES6 Class (no compat with Edge) for a location
class Location {
    // Set the initial properties of the class
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
    // Return the name of this location
    getName = function() {
        return this.name;
    }
    // Add a link between this location and another
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
    // Print all linked locations 
    display = function() {
        Output(this.description);
        if(this.visited === false) {
            Output("This is somewhere new...", "YELLOW")
            this.visited = true;
            visited.push(this.name);
        } else {
            Output("You have been here before...", "YELLOW")
        }
        /* <COMPLETE> Task 4 - Add an Item to a location and make it seen in the display() */
        // If there is an item then print the details of that item
        if(this.item) {
            // If the item has already been picked up then do not print it anymore
            if(!this.item.pickedUp) {
                Output("There is a \""+this.item.name+"\"!", "YELLOW");
            }
        }
        return true;
        /* </COMPLETE> */
    }
    /* </COMPLETE> */
}

/* <COMPLETE> Task 3 - Add an Item class that has a name */

// Define an ES6 Class (no compat with Edge) for an item
class Item {
    // Set the initial properties of the class
    constructor(name, canPickUp) {
        this.name = name;
        if(canPickUp === false) {
            this.pickedUp = true;
        } else {
            this.pickedUp = false;
        }
    }
    // Allow the item to be picked up via a function
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

// An output function that allows colour formatting of the outputs including storing a log of all output(s)
function Output() {
    // Define the current output to be empty
    let string = "";
    // Define a boolean to close the colour formatting tag as false
    let stringEndSpan = false;
    // Define an array with all the arguments passed to the function
    let argumentArray = Array.from(arguments);
    // Define an array of all colours allowed
    let colourArray = ["RED", "YELLOW", "BLUE"];
    // For each argument passed through to the function
    argumentArray.forEach(function(arg) {
        // If the string is not empty
        if(string !== "") {
            string += " ";
            if(colourArray.includes(argumentArray[argumentArray.length - 1])) {
                if(arg !== argumentArray[argumentArray.length - 1]) {
                    string += arg;
                }
            } else {
                string += arg;
            }
        } else { // Else if the string is empty
            // Open a new code tag for the current output
            string += "<code>";
            // If the last argument is a valid colour then 'activate' colour formatting
            if(colourArray.includes(argumentArray[argumentArray.length - 1])) {
                // Add a contained element with a colour to change the colour of the text
                string += "<span style=\"color: "+argumentArray[argumentArray.length - 1]+"\">";
                // Mark that the tag needs closing on the last argument
                stringEndSpan = true;
                // If the argument array does not have just one argument
                if((argumentArray.length - 1) !== 0) {
                    // Print the argument
                    string += arg;
                }
            } else { // Else if no colour formatting is required
                // Print the first argument
                string += arg;
            }
        }
    })
    // If the colour formatting tag needs closing
    if(stringEndSpan) {
        // Close the formatting tag
        string += "</span>";
    }
    // Close the code tag and add a new line to ensure it is readable
    string += "</code><br />\n";

    // Get the element with id "console"
    let consoleHTML = document.getElementById("console");
    // Append to the HTML code within the element
    consoleHTML.innerHTML += string;
    // Scroll the element to the bottom so that the user always has the latest output in view
    consoleHTML.scrollTop = consoleHTML.scrollHeight;

    // Append the output to the log of outputs
    window.logOfTurnOutputs += string;

    // Return true so the caller knows this is complete
    return true;
}

// Allow the user to use the input mechanism(s)
function allowInput() {
    // Set the current command as nothing
    document.getElementById("userTextInput").value = "";
    // Enable the command entry field
    document.getElementById("userTextInput").disabled = false;
    // Enable the button to execute the command
    document.getElementById("userTextButton").disabled = false;
    // Focus the browser on the input box (mainly for convenience and to assist mobile devices)
    document.getElementById("userTextInput").focus();
}

// Parse the user input to execute the commands
function handleInput(userInput = "") {
    // Set the current input to a lower case version of itself
    userInput = userInput.toLowerCase();

    // If the allowed locations array includes the input of the user
    if(directions.includes(userInput)) {
        // Define a blank array of locations to choose from
        let availableLinkLocations = [];
        // For each linked location of the current location
        Object.keys(currentLocation.linkLocations).forEach(element => {
            // Append each linked location to the availableLinkedLocations array
            availableLinkLocations.push(currentLocation.linkLocations[element].direction);
        });
        // If the user tries to go in a direction that the current location does not support
        if(!availableLinkLocations.includes(userInput)) {
            // Print that the user may not got that way
            Output("You cannot go that way", "RED");
        } else { // Else if the direction is valid
            // Get the key for the object of locations
            let newLocationID = currentLocation.linkLocations[userInput].destination
            // Set the current location to the array of locations using the key
            currentLocation = locations[newLocationID]
        }
    } else if(userInput === "location") { // Else if the user command is to repeat the location
        // Define a blank string for the output
        let string = "";
        // Loop for 5 times
        for(i = 0; i < 5; i++) {
            // Add the location name to the output string
            string += currentLocation.getName()+". ";
        }
        // Output the complete output string
        Output(string);
    } else if(userInput === "inventory") { /* <COMPLETE> Task 6 - Add a command list the inventory */ // Else if the user command is to list the inventory contents
        // If the inventory is not empty
        if(inventory.length !== 0) {
            // Print out to the user that 
            Output("In your inventory is:", "YELLOW");
            // For each item in the inventory
            for(i = 0; i <= (inventory.length - 1); i++) {
                // If this item isn't the last one
                if((inventory.length - 1) !== i) {
                    // Output the current location with a comma for formatting and correct grammar
                    Output(inventory[i] + ",", "YELLOW");
                } else { // If this item is the last one
                    // Output the current location without a comma for formatting and correct grammar
                    Output(inventory[i], "YELLOW");
                }
            }
        } else { // Else if the inventory is empty
            // Output to the user that the inventory is empty
            Output("Your inventory is empty!", "YELLOW");
        }
        /* </COMPLETE> */
    } else if(userInput === "pickup") { /* <COMPLETE> Task 5 - Add a command to pick up an item and add it to the inventory */ // Else if the user command is to pick up an item
        // Run the pickup command for the item of the current location
        currentLocation.item.pickUp();
        /* </COMPLETE> */
    } else { // Else if the command is not an accepted one
        // Output to the user to try one of the directions
        let string = "Try one of: ";
        i = 0;
        // For each direction add it the a string
        directions.forEach(function(direction) {
            i++;
            string += direction;
            if(i !== directions.length) {
                string += ", "
            }
        });
        // Output the string of locations
        Output(string, "YELLOW");
    }
    // Start new turn for the player
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