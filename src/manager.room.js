var roomManager = 
{
    run: function(room)
    {
        //manage aspects of the room

        //setup memory if it's not
        if(!room.memory.spawnQueue) room.memory.spawnQueue = [];

        //1. check what creeps the room may need

        //check if there are enough miners to fill all sources
        if(room.memory.miners < room.memory.sources)
        {
            //make sure no miners are already in queue
            const miner = _.filter(room.memory.spawnQueue, (c) => c.role === "miner");

            if(miner.length === 0)
            {
                const creep =
                {
                    priority: 0,
                    role: "miner"
                };

                room.memory.spawnQueue.push(creep);
            }
        }

        //check for dropped resources - if there are some, spawn a cleaner if there isn't one spawned
        let resources = room.find(FIND_DROPPED_RESOURCES);
        if(resources.length > 0 && room.memory.cleaners <= 1)
        {
            //make sure no cleaner is already requested
            const cleaner = _.filter(room.memory.spawnQueue, (c) => c.role === "cleaner");
            
            if(cleaner.length === 0)
            {
                const creep =
                {
                    priority: 1,
                    role: "cleaner"
                };

                room.memory.spawnQueue.push(creep);
            }
        }

        //check for resources in storage area, if so - see if we need suppliers
        if(room.memory.suppliers === 0)
        {
            const supplier = _.filter(room.memory.spawnQueue, (c) => c.role === "supplier");

            if(supplier.length === 0)
            {
                let storageStructures = room.lookAtArea(room.storage.pos.y - 1,room.storage.pos.x - 1,room.storage.pos.y + 1,room.storage.pos.x + 1, {asArray: true});

                //filter out terrain
                storageStructures = _.filter(storageStructures, (s) => s.type === "structure");

                if(storageStructures.length > 0)
                {
                    //if there are storages then lets see if they have energy in them
                    storageStructures = _.filter(storageStructures, (s) => s.structure.store.getUsedCapacity() > 0);

                    if(storageStructures.length > 0)
                    {
                        const creep =
                        {
                            priority: 2,
                            role: "supplier"
                        };

                        room.memory.spawnQueue.push(creep);
                    }
                }
            }
        }

        //check for construction sites, if we have them, spawn builders
        if(room.memory.builders === 0)
        {
            const builders = _.filter(room.memory.spawnQueue, (c) => c.role === "builder");

            if(builders.length === 0)
            {
                const sites = room.find(FIND_CONSTRUCTION_SITES);

                if(sites.length > 0)
                {
                    const creep =
                    {
                        priority: 4,
                        role: "builder"
                    };

                    room.memory.spawnQueue.push(creep);
                }
            }
        }

        //check for decayed structures, if they exist, spawn some repairers
        if(room.memory.repairers === 0)
        {
            const repairers = _.filter(room.memory.spawnQueue, (c) => c.role === "repairer");

            if(repairers.length === 0)
            {
                const decayedStructures = room.find(FIND_STRUCTURES, 
                    {
                        filter: (s) =>
                        {
                            return (s.hits < s.hitsMax);
                        }
                    });

                if(decayedStructures.length > 0)
                {
                    const creep =
                    {
                        priority: 4,
                        role: "repairer"
                    };

                    room.memory.spawnQueue.push(creep);
                }
            }
        }

        //check if we need upgraders
        if(room.memory.upgraders === 0)
        {
            const upgraders = _.filter(room.memory.spawnQueue, (c) => c.role === "upgrader");

            if(upgraders.length === 0)
            {
                let upgradeContainers = room.lookAtArea(room.controller.pos.y - 3, room.controller.pos.x - 3, room.controller.pos.y + 3, room.controller.pos.x + 3, {asArray: true});
                upgradeContainers = _.filter(upgradeContainers, (s) => s.type === "structure");

                if(upgradeContainers.length > 0)
                {
                    upgradeContainers = upgradeContainers.map(s => s.structure);
                    upgradeContainers = _.filter(upgradeContainers, (s) => s.structureType === STRUCTURE_CONTAINER &&
                        s.store.getUsedCapacity(RESOURCE_ENERGY) > 0);

                    if(upgradeContainers.length > 0)
                    {
                        const creep =
                        {
                            priority: 3,
                            role: "upgrader"
                        };

                        room.memory.spawnQueue.push(creep);
                    }
                }
            }
        }
    }
}

module.exports = roomManager;
