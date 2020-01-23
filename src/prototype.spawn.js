/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.spawners');
 * mod.thing == 'a thing'; // true
 */

/* OUTLINE
 * 1. Custom function for spawning creeps
 */

module.exports = function() {
    StructureSpawn.prototype.spawnCustomCreep = function(spawn, energyAvailable, roleName)
    {
        let creepBody = [];
        let minimalCost;
        let numberOfParts;

        //body part costs
        const workCost = 100;
        const carryCost = 50;
        const moveCost = 50;

        //the body structure changes based on the role so determine which creep we are spawning
        //  - general formula for # body parts = energyAvailable/minimalCost rounded down
        switch(roleName)
        {
            case "miner":
                //minimal body: [WORK,CARRY,MOVE]
                minimalCost = workCost + carryCost + moveCost;

                //miners will only ever have one carry part 
                //  - therefore (energyAvailable-carryCost)/(minimalCost-carryCost) is the # of [WORK,MOVE] parts that can be added
                //sources have 3000energy/300ticks therefore it is inefficient to have a miner with more than 6 WORK parts (compensate for travel, repair and transfer times).
                numberOfParts = Math.floor((energyAvailable-carryCost)/(minimalCost-carryCost));
                numberOfParts = (numberOfParts <= 6) ? numberOfParts : 6;

                for(let i = 0; i < numberOfParts; i++) creepBody.push(WORK);
                if(numberOfParts !== 0) creepBody.push(CARRY);
                for(let i = 0; i < numberOfParts; i++) creepBody.push(MOVE);
                break;
            case "hauler":
            case "cleaner":
            case "supplier":
                //minimal body: [CARRY,MOVE]
                minimalCost = carryCost + moveCost;
                numberOfParts = Math.floor(energyAvailable/minimalCost);
                numberOfParts = (numberOfParts <= 14) ? numberOfParts : 14;

                for(let i = 0; i < numberOfParts; i++) creepBody.push(CARRY);
                for(let i = 0; i < numberOfParts; i++) creepBody.push(MOVE);
                break;
            case "builder":
            case "upgrader":
            case "repairer":
                //upgraders, builders and repairers all have the same configuration
                //minimal body: [WORK,CARRY,MOVE,MOVE]
                minimalCost = workCost + carryCost + (moveCost * 2);
                numberOfParts = Math.floor(energyAvailable/minimalCost);

                for(let i = 0; i < numberOfParts; i++) creepBody.push(WORK);
                for(let i = 0; i < numberOfParts; i++) creepBody.push(CARRY);
                for(let i = 0; i < (numberOfParts*2); i++) creepBody.push(MOVE);
                break;
            default:
                break;
        }

        let err = spawn.spawnCreep(creepBody, roleName + Game.time, {memory: {role: roleName}});

        switch(err)
        {
            case OK:
                return 0;
                break;
            default:
                return -1;
                break;
        }
    }
};