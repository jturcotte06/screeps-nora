require('prototype.findEnergy')();

var roleRepairer =
{
    run: function(creep)
    {
        var target;
        var err;

        if(creep.carry.energy == 0)
        {
            creep.memory.full = false;
            creep.memory.target = undefined;
        }
        else if(creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.full = true;
            creep.memory.target = undefined;
        }

        if(!creep.memory.full)
        {
            //Look for energy in storage
            //Look for energy in containers near storage
            //Look for energy in other containers

            //look for energy on the ground
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
        else
        {
            let targets;

            target = Game.getObjectById(creep.memory.target);

            if(!target || creep.memory.cooldown <= 0 || target.hits === target.hitsMax)
            {
                //Repair everything except walls
                targets = creep.room.find(FIND_STRUCTURES, 
                    {
                        filter: (s) => 
                        {
                            return (s.structureType !== STRUCTURE_WALL &&
                                   s.hits < s.hitsMax)
                        }
                    }
                );

                if(targets.length === 0)
                {
                    //Repair walls
                    targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (s) => {
                            return (s.structureType === STRUCTURE_WALL && 
                                    s.hits < s.hitsMax);
                        }
                    });
                }

                if(targets.length > 0)
                {
                    //repair weakest structure
                    for(let i = 0; i < targets.length; i++)
                    {
                        if(!target) target = targets[i];
                        if(targets[i].hits < target.hits) target = targets[i];
                    }

                    creep.memory.target = target.id;
                    creep.memory.cooldown = 10;
                }
            }

            err = creep.repair(target);
        }

        switch(err)
        {
            case OK:
                creep.memory.cooldown--;
                break;
            case ERR_NOT_IN_RANGE:
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                break;
            default:
                creep.memory.target = undefined;
                break;
        }
    }
}

module.exports = roleRepairer;