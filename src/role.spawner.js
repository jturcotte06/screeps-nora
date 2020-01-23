require('prototype.spawn')();

var roleSpawner = 
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
        }

        //300 if there are no miners since that is the highest a room will accumulate over time
        let roomEnergyCapacity = spawn.room.energyCapacityAvailable;
        let roomEnergyAvailable = spawn.room.energyAvailable;

        if(spawn.room.memory.miners === 0 || spawn.room.memory.haulers === 0) roomEnergyCapacity = 300;

        //only spawn when we have maximum energy or if there are no miners
        if(roomEnergyAvailable >= roomEnergyCapacity)
        {
            if(spawn.room.memory.miners < spawn.room.memory.minersMax)
                spawn.spawnCustomCreep(spawn, roomEnergyAvailable, "miner");
            else if(spawn.room.memory.haulers < spawn.room.memory.haulersMax)
                spawn.spawnCustomCreep(spawn, roomEnergyAvailable, "hauler");
            else if(spawn.room.memory.upgraders < spawn.room.memory.upgradersMax)
                spawn.spawnCustomCreep(spawn, roomEnergyAvailable, "upgrader");
            else if(spawn.room.memory.builders < spawn.room.memory.buildersMax)
                spawn.spawnCustomCreep(spawn, roomEnergyAvailable, "builder");
            else if(spawn.room.memory.repairers < spawn.room.memory.repairersMax)
                spawn.spawnCustomCreep(spawn, roomEnergyAvailable, "repairer");
        }
    }
}

module.exports = roleSpawner;