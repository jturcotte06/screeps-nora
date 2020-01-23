var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
const roleCleaner = require('role.cleaner');
const roleSupplier = require('role.supplier');

var roleTower = require('role.tower');
const spawnManager = require('manager.spawn');

var roomManager = require('manager.room');

module.exports.loop = function () {
    //delete old memory
    for(var creep in Memory.creeps)
    {
        if(!Game.creeps[creep])
        {
            delete Memory.creeps[creep];
            console.log('Clearing non-existing creep memory: ', creep);
        }
    }

    //rooms execution
    for(let key in Game.rooms)
    {
        let currentRoom = Game.rooms[key];

        //skip room if it isn't owned by me
        if(!currentRoom.controller.my) continue;

        //set number of sources in room
        if(!currentRoom.memory.sources) currentRoom.memory.sources = currentRoom.find(FIND_SOURCES).length;

        //set max creep numbers
        currentRoom.memory.minersMax = currentRoom.memory.sources;
        currentRoom.memory.haulersMax = 1;
        currentRoom.memory.upgradersMax = 1;
        currentRoom.memory.buildersMax = 1;
        currentRoom.memory.repairersMax = 1;
        currentRoom.memory.cleanersMax = 1;
        currentRoom.memory.suppliersMax = 1;

        //tally current creep counts
        currentRoom.memory.miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner').length;
        currentRoom.memory.haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler').length;
        currentRoom.memory.upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
        currentRoom.memory.builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;
        currentRoom.memory.repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer').length;
        currentRoom.memory.cleaners = _.filter(Game.creeps, (c) => c.memory.role === "cleaner").length;
        currentRoom.memory.suppliers = _.filter(Game.creeps, (c) => c.memory.role === "supplier").length;

        //tally towers
        currentRoom.memory.towers = _.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_TOWER).length;

        //logistics output
        console.log(`[${currentRoom.name}]`);
        console.log(`Miners: ${currentRoom.memory.miners}/${currentRoom.memory.minersMax}`);
        console.log(`Haulers: ${currentRoom.memory.haulers}/${currentRoom.memory.haulersMax}`);
        console.log(`Upgraders: ${currentRoom.memory.upgraders}/${currentRoom.memory.upgradersMax}`);
        console.log(`Builders: ${currentRoom.memory.builders}/${currentRoom.memory.buildersMax}`);
        console.log(`Repairers: ${currentRoom.memory.repairers}/${currentRoom.memory.repairersMax}`);
        console.log(`Cleaners: ${currentRoom.memory.cleaners}/${currentRoom.memory.cleanersMax}`);
        console.log(`Suppliers: ${currentRoom.memory.suppliers}/${currentRoom.memory.suppliersMax}`);

        console.log(`Towers: ${currentRoom.memory.towers}`);

        //Execute RoomManager
        roomManager.run(currentRoom);
    }

    //structures execution
    for(let key in Game.structures)
    {
        const structure = Game.structures[key];
        const structType = structure.structureType;

        switch(structType)
        {
            case STRUCTURE_TOWER:
                roleTower.run(structure);
                break;
            case STRUCTURE_SPAWN:
                spawnManager.run(structure);
                break;
        }
    }

     //creep role execution
    for(let name in Game.creeps) 
    {
        var creep = Game.creeps[name];
        var creepRole = creep.memory.role;
        

        switch(creepRole)
        {
            case 'miner':
                roleMiner.run(creep);
                break;
            case 'hauler':
                roleHauler.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'repairer':
                roleRepairer.run(creep);
                break;
            case 'cleaner':
                roleCleaner.run(creep);
                break;
            case 'supplier':
                roleSupplier.run(creep);
                break;
            default:
                console.log('ERROR: UNKNOWN CREEP ROLE: ' + creepRole);
        }
    }
};