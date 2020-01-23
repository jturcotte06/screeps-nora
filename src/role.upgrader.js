/* ROLE OUTLINE
 * 1. Get resources from upgrade container if available
 * 2. Get resources from ground if required
 * 3. Upgrade room controller
 */

var roleUpgrader = 
{
    run: function(creep)
    {
        var target;
        var err;

        //init
        if(!creep.memory.full)
        {
            creep.memory.full = false;
        }

        //carry check
        if(creep.carry.energy == 0)
        {
            creep.memory.full = false;
        }
        else if(creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.full = true;
        }

        //see if container is near RC ~ LATER
        //check if carry is full
        if(creep.memory.full == false)
        {
            target = Game.getObjectById(creep.memory.target);

            //find the controller container
            if(!target)
            {
                let containers = creep.room.lookAtArea(creep.room.controller.pos.y - 3,creep.room.controller.pos.x - 3,creep.room.controller.pos.y + 3,creep.room.controller.pos.x + 3, {asArray: true});
                containers = _.filter(containers, (s) => s.type === "structure");
                containers = containers.map(s => s.structure);
                containers = _.filter(containers, (s) => s.structureType === STRUCTURE_CONTAINER);

                if(containers.length > 0)
                {
                    //if there are storages then lets see if they have energy in them
                    containers = _.filter(containers, (s) => s.store.getUsedCapacity(RESOURCE_ENERGY) > 0);

                    if(containers.length > 0)
                    {
                        //goto closest
                        target = creep.pos.findClosestByPath(containers);
                        creep.memory.target = target.id;
                    }
                }
            }

            err = creep.withdraw(target, RESOURCE_ENERGY);
        }
        else if(creep.memory.full == true)
        {
            //find controller
            target = creep.room.controller
            if(target)
            {
                err = creep.upgradeController(target);
            }
        }

        switch(err)
        {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                break;
            default:
                creep.memory.target = '';
        }
    }
}

module.exports = roleUpgrader;