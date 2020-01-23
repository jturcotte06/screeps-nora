var roleSupplier =
{
    run: function(creep)
    {
        let err;
        let target;

        //state machine:
        //(1) -> find energy in storage area
        //(2) -> deliver to spawns & extensions, upgrader containers, towers
        const FILL = 1;
        const SUPPLY = 2;

        if(creep.store.getUsedCapacity() === 0)
            creep.memory.state = FILL;
        else if(creep.store.getUsedCapacity() === creep.store.getCapacity())
            creep.memory.state = SUPPLY;

        target = Game.getObjectById(creep.memory.target);

        //FILL:
        if(creep.memory.state === FILL)
        {
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
        //SUPPLY:
        else if(creep.memory.state === SUPPLY)
        {
            if(!target)
            {
                //fill spawns & extensions
                let targets = creep.room.find(FIND_MY_STRUCTURES, 
                    {
                        filter: (s) => 
                        {
                            return ((s.structureType === STRUCTURE_EXTENSION ||
                                s.structureType === STRUCTURE_SPAWN) &&
                                s.store.getCapacity(RESOURCE_ENERGY) > s.store.getUsedCapacity(RESOURCE_ENERGY))
                        }
                    });
                
                if(targets.length === 0)
                {       
                    //then fill upgrader container (if it exists)
                    targets = creep.room.lookAtArea(creep.room.controller.pos.y - 3, creep.room.controller.pos.x - 3, creep.room.controller.pos.y + 3, creep.room.controller.pos.x + 3, {asArray: true});
                    targets = _.filter(targets, (s) => s.type === "structure");
                    targets = targets.map(t => t.structure);
                    targets = _.filter(targets, (s) => s.structureType === STRUCTURE_CONTAINER &&
                        s.store.getFreeCapacity() > 0);

                    if(targets.length === 0)
                    {
                        //then fill towers
                        targets = creep.room.find(FIND_MY_STRUCTURES, 
                            {
                                filter: (s) =>
                                {
                                    return (s.structureType === STRUCTURE_TOWER &&
                                        s.store.getUsedCapacity(RESOURCE_ENERGY) < s.store.getCapacity(RESOURCE_ENERGY))
                                }
                            });
                    }
                }

                if(targets.length > 0)
                {
                    target = creep.pos.findClosestByPath(targets);
                    creep.memory.target = target.id;
                }
            }

            err = creep.transfer(target, RESOURCE_ENERGY);
        }

        switch(err)
        {
            case OK:
                creep.memory.target = undefined;
                break;
            case ERR_NOT_IN_RANGE:
                creep.moveTo(target);
                break;
            default:
                break;
        }
    }
}

module.exports = roleSupplier;