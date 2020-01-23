require("prototype.findEnergy");

var roleCleaner = 
{
    run: function(creep)
    {
        const PICKUP = 1;
        const DEPOSIT = 2;

        let target;
        let err;

        //setup state machine
        //(1)->Pickup resources on the ground
        //(2)->Deposit resources into the storage area

        //Change to state 1 when nothing is being held
        //Change to state 2 when capacity is full
        if(creep.store.getUsedCapacity() === creep.store.getCapacity())
            creep.memory.state = DEPOSIT;
        else if(creep.store.getUsedCapacity() === 0)
            creep.memory.state = PICKUP;

        //get target if it exists
        target = Game.getObjectById(creep.memory.target);
        
        //state 1: pickup resources on the ground
        if(creep.memory.state === PICKUP)
        {
            if(!target)
            {
                //find resources on the ground
                let targetId = creep.room.t_findEnergy(creep);

                if(target === -1);
                else
                {
                    //pick them up
                    creep.memory.target = targetId;
                    target = Game.getObjectById(targetId);
                }
            }

            err = creep.pickup(target);
        }
        else if(creep.memory.state === DEPOSIT)
        {
            //find storage area
            if(!target)
            {
                target = creep.room.storage;
                if(!target)
                {
                    let targets = creep.room.find(FIND_STRUCTURES, 
                        {
                            filter: (s) => 
                            {
                                s.structureType === STRUCTURE_CONTAINER &&
                                s.store.getFreeCapacity() > 0;
                            }
                        });

                    if(targets.length === 0)
                    {
                        //if no storage area, find spawns & extensions
                        targets = creep.room.find(FIND_STRUCTURES, 
                            {
                                filter: (s) =>
                                {
                                    (s.structureType === STRUCTURE_SPAWN ||
                                    s.structureType === STRUCTURE_EXTENSION) &&
                                    s.store.getFreeCapacity() > 0;
                                }
                            });

                        if(!(targets.length === 0))
                        {
                            target = creep.room.findClosestByPath(targets);
                            creep.memory.target = target.id;
                        }
                    }
                    else
                    {
                        //use closest container
                        target = creep.room.findClosestByPath(targets);
                        creep.memory.target = target.id;
                    }
                }

                //deposit resource
                for(let resource in creep.store)
                {
                    err = creep.transfer(target, resource);
                }
            }
        }

        switch(err)
        {
            case OK:
                creep.memory.target = undefined;
                break;
            case ERR_NOT_IN_RANGE:
                creep.moveTo(target);
                break;
            case ERR_INVALID_TARGET:
                creep.memory.target = undefined;
                break;
            default:
                creep.say("🇨🇦");
                break;
        }
    }
}

module.exports = roleCleaner;