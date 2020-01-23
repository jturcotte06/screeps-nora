var roleTower =
{
    run: function(tower)
    {
        var target;
        var err;
        let targets;

        if(!tower.room.memory.repairMax || tower.room.memory.repairMax > 3000000000) tower.room.memory.repairMax = 1000;

        //check if existing target is valid
        target = Game.getObjectById(tower.room.memory.repairTarget);

        if(!target || target.hits > tower.room.memory.repairMax || target.structureType === STRUCTURE_WALL)
        {
            //try to repair owned structures
            targets = tower.room.find(FIND_MY_STRUCTURES, 
                {
                    filter: (s) => 
                    {
                        return (s.structureType !== STRUCTURE_RAMPART &&
                            s.hits < s.hitsMax)
                    }
                });

            if(targets.length === 0)
            {                
                //try to repair roads
                targets = tower.room.find(FIND_STRUCTURES, 
                    {
                        filter: (s) => 
                        {
                            return (s.structureType === STRUCTURE_ROAD &&
                                s.hits < s.hitsMax)
                        }
                    });
                    
                if(targets.length === 0)
                {
                    //try to repair ramparts
                    targets = tower.room.find(FIND_MY_STRUCTURES, 
                        {
                            filter: (s) => 
                            {
                                return (s.structureType === STRUCTURE_RAMPART &&
                                    s.hits < s.hitsMax && 
                                    s.hits < tower.room.memory.repairMax)
                            }
                        });
                    
                    if(targets.length === -1) //disabled wall repair code for now
                    {
                        //try to repair walls 
                        targets = tower.room.find(FIND_STRUCTURES, 
                            {
                                filter: (s) => 
                                {
                                    return (s.structureType === STRUCTURE_WALL &&
                                        s.hits < s.hitsMax && 
                                        s.hits < tower.room.memory.repairMax)
                                }
                            });

                        if(targets.length > 0)
                        {
                            target = targets[0];
                            tower.room.memory.repairTarget = target.id;
                        }
                        else 
                        {
                            tower.room.memory.repairMax *= 10;
                        }
                    }
                }
            }
        }

        err = tower.repair(target);

        switch(err)
        {
            default:
                break;
        }
    }
}

module.exports = roleTower;