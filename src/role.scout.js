\screeps
var roleScout = {
    run:
    function(creep)
    {
        //setup state machine
        //(1) - go towards scout flags
        //(2) - see if room can be reserved, if so, place a reserve flag
        if(!creep.memory.state) creep.memory.state = 1;
        
        for(flag in Game.flags)
        {
            console.log(flag);
        }
    }
}
module.exports = roleScout;
