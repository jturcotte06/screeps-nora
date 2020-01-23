/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.miner');
 * mod.thing == 'a thing'; // true
 */

/* ROLE OUTLINE
 * 1. Move towards its designated source
 * 2. Static mine at source for eternity
 * 3. IF there are no haulers, deliver energy to the spawn
 * 4. IF there is a container nearby, store energy in container
 * 5. IF there is a container nearby, repair container ~ MAYBE
 */

var roleMiner = {
    run: function(creep) {
        //get source from memory
        let source = Game.getObjectById(creep.memory.sourceId);

        //assign miner a source if it doesn't have one
        if(!source)
        {
            const currentRoom = creep.room;
            const sources = currentRoom.find(FIND_SOURCES);

            for(let currentSource in sources)
            {
                //check if another creep has this source
                let isSourceTaken = _.filter(Game.creeps, (c) => c.memory.sourceId === sources[currentSource].id);

                if(isSourceTaken.length === 0) 
                {
                    creep.memory.sourceId = sources[currentSource].id;
                    source = currentSource;
                }
            }
        }
        
        if(!(creep.carry.energy < creep.carryCapacity))
        {
            //check for haulers
            var haulers = creep.room.find(FIND_MY_CREEPS, {
                filter: (hCreep) => {
                    return (hCreep.memory.role == 'hauler')
                }
            })
            if(haulers.length === -1)
            {
                //bring source energy to a spawn
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_EXTENSION) &&
                                structure.energy < structure.energyCapacity)
                    }
                });
                var closestTarget = creep.pos.findClosestByPath(targets);

                var err = creep.transfer(closestTarget, RESOURCE_ENERGY);
                switch(err)
                {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(closestTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                        break;
                }
            }
            else
            {
                //check for nearby containers
                var target = creep.room.lookForAtArea(LOOK_STRUCTURES, creep.pos.y + 1, creep.pos.x - 1, 
                                                    creep.pos.y - 1, creep.pos.x + 1);
                if(target.length > 0)
                {
                    //check if nearby structure is container
                    //deposit energy into container
                }
                else
                {
                    //move towards source and harvest source
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
        else
        {
            //move towards source and harvest source
            if(creep.harvest(source) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
}

module.exports = roleMiner;