/* ROLE OUTLINE
 * 1. Get resources from all access containers if available
 * 2. Get resources from ground if required
 * 3. Choose a construction site and build it
 * 4. Only build one construction site at a time
 * 5. IF board - repair ~ WIP
 */

require('prototype.findEnergy')();
var roleRepairer = require('role.repairer');

var roleBuilder = {
    run: function(creep) 
    {
        var target;
        var err;

        //carry check
        if(creep.carry.energy == 0)
        {
            creep.memory.full = false;
        }
        else if(creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.full = true;
        }

        //check for container ~ WIP
        //get energy from ground
        if(creep.memory.full == false)
        {
            target = Game.getObjectById(creep.memory.target);

            if(!target)
            {
                //find the storage area, take energy from the closest storage/container
                let storageStructures = creep.room.lookAtArea(creep.room.storage.pos.y - 1,creep.room.storage.pos.x - 1,creep.room.storage.pos.y + 1,creep.room.storage.pos.x + 1, {asArray: true});

                //filter out terrain
                storageStructures = _.filter(storageStructures, (s) => s.type === "structure");

                if(storageStructures.length > 0)
                {
                    //if there are storages then lets see if they have energy in them
                    storageStructures = _.filter(storageStructures, (s) => s.structure.store.getUsedCapacity() > 0);
                    storageStructures = storageStructures.map(a => a.structure);

                    if(storageStructures.length > 0)
                    {
                        //goto closest
                        target = creep.pos.findClosestByPath(storageStructures);
                        creep.memory.target = target.id;
                    }
                }
            }

            err = creep.withdraw(target, RESOURCE_ENERGY);
        }
        //construct current target
        else
        {
            target = Game.getObjectById(creep.memory.buildTarget);

            if(!target)
            {
                //find a construction site
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

                if(targets.length > 0)
                {
                    var closestTarget = creep.pos.findClosestByPath(targets);

                    creep.memory.buildTarget = closestTarget.id;
                    target = closestTarget;
                }
                else
                {
                    roleRepairer.run(creep);
                }
            }

            err = creep.build(target);
        }
        
        switch(err)
        {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                break;
        }
    }
}

module.exports = roleBuilder;