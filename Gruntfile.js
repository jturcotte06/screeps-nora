module.exports = function(grunt)
{
    const config = require("./.screeps.json");

    const email = grunt.option('email') || config.email;
    const password = grunt.option('password') || config.password;
    const branch = grunt.option('branch') || config.branch;
    const ptr = grunt.option('ptr') ? true : config.ptr;

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig(
        {
            screeps: 
            {
                options: 
                {
                    email: email,
                    password: password,
                    branch: branch,
                    ptr: ptr
                },
                dist: 
                {
                    src: ['src/*.js']
                }
            }
        }
    );
}