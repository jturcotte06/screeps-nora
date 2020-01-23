/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roler.courier');
 * mod.thing == 'a thing'; // true
 */

/* ROLE OUTLINE
 * 
 * FIND PRIORITY
 * 1. Dropped energy
 * 2. Energy in miner containers
 * 
 * DEPOSIT PRIORITY
 * 1. Spawns
 * 2. Extensions
 * 3. Towers
 * 3. Upgrade containers
 * 4. Storage
 */

require('prototype.findEnergy')();

var roleHauler = {
    run: function(creep) {
        var target;
        var err;
        
        if(creep.carry.energy == 0) creep.memory.full = false;
        else if(creep.carry.energy == creep.carryCapacity) creep.memory.full = true;

        if(!creep.memory.full)
        {
            target = Game.getObjectById(creep.memory.target);

            if(!target)
            { 
                var targetId = creep.room.t_findEnergy(creep);

                if (targetId != 0)
                {
                    creep.memory.target = targetId;
                    target = Game.getObjectById(targetId);
                }
            }

            //get decaying resource
            err = creep.pickup(target);
        }
        else
        {
            //look for structure to give energy to, following priorities
            var targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (t) => {
                    return (t.structureType == STRUCTURE_SPAWN &&
                            t.energy < t.energyCapacity)
                }
            });
            if(targets.length < 1)
            {
                targets = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (t) => {
                        return (t.structureType == STRUCTURE_EXTENSION &&
                                t.energy < t.energyCapacity)
                    }
                });
                if(targets.length < 1)
                {
                    targets = creep.room.find(FIND_MY_STRUCTURES, {
                        filter: (t) => {
                            return (t.structureType == STRUCTURE_TOWER &&
                                    t.energy < t.energyCapacity)
                        }
                    });
                }
            }

            if(targets.length > 0)
            {
                target = creep.pos.findClosestByPath(targets);

                //deliver resource
                err = creep.transfer(target, RESOURCE_ENERGY);
            }
        }

        switch(err)
            {
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    break;
                default:
                    creep.memory.target = ""
            }
    }
}

module.exports = roleHauler;