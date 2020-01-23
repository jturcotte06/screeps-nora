require('prototype.spawn')();

var spawnManager =
{
    run: function(spawn)
    {
        //if currently spawning -> display what is being spawned and return
        if(spawn.spawning) 
        { 
            var spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn.pos.x + 1, 
                spawn.pos.y, 
                {align: 'left', opacity: 0.8});
            
            return;
        }

        //check queue for wanted creeps
        const spawnQueue = spawn.room.memory.spawnQueue;
        if(spawnQueue.length > 0)
        {
            //find highest priority request
            let creep;
            let err = -1;

            for(let i = 0; i < spawnQueue.length; i++)
            {
                if(!creep) 
                    creep = spawnQueue[i];
                else if(spawnQueue[i].priority < creep.priority)
                    creep = spawnQueue[i];
            }
            //spawn creep
            if(spawn.room.energyAvailable >= 300)
            {
                err = spawn.spawnCustomCreep(spawn, spawn.room.energyAvailable, creep.role);
            }

            switch(err)
            {
                case OK:
                    _.pull(spawn.room.memory.spawnQueue, creep);
                    break;
                default:
                    break;
            }
        }

    }
}

module.exports = spawnManager;