let directions = ["north","south","east","west"];
let inventory = [];

function Location(name, description) {
    let obj = {};
    obj.name = name;
    obj.description = description;
    obj.linkLocations = {};
    obj.getName = function() {
        return obj.name;
    }
    obj.addLink = function(direction, destination) {
        if(!directions.includes(direction)) {
            throw("Invalid direction");
        } else if (!locations[destination]) {
            throw("Invalid destination");
        } else {
            obj.linkLocations[direction] = {"direction": direction, "destination": destination};
        }
    }
    return obj;
}

let locations = {
    "woods": Location("The woods", "You are in the woods. There are a lot of trees."),
    "lake": Location("The lake", "You are by the lake. It is very watery.")
};

locations["woods"].addLink("north", "lake");
locations["lake"].addLink("south", "woods");

let currentLocation = locations["woods"];

while(true) {
    console.log(currentLocation.description);

    Object.keys(currentLocation.linkLocations).forEach(element => {
        console.log(currentLocation.linkLocations[element].direction, ":", locations[currentLocation.linkLocations[element].destination].name);
    });

    // ALLOW READING INPUT
    
    throw("EOF (intended)"); // END FOR NOW
}