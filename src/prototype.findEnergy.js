/* OUTLINE
 * Functions for finding energy 
 */

module.exports = function() 
{
    //Finds dropped resources and sets the creeps target to the first one
    //Return 0 - SUCCESS, -1 - FAILURE
    Room.prototype.t_findEnergy = function(creep)
    {
        //find energy on the ground
        var targets = creep.room.find(FIND_DROPPED_RESOURCES);

        if(targets.length > 0)
        {
            let target; 

            for(let i = 0; i < targets.length; i++)
            {
                if(!target) target = targets[i];
                if(target.energyAvailable < targets[i].energyAvailable) target = targets[i];
            }
            //let target = creep.pos.findClosestByPath(targets);
            return (target.id);
        }

        return (-1);
    }
}