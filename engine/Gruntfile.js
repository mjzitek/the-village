/*global module:false*/
module.exports = function(grunt) {

	grunt.initConfig({
		jshint: {
			src: ['Gruntfile.js', 'src/app/**/*.js', 'src/config.js', 'tests/app/**/*.js'],
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true,
				globals: {
					require: true,
					define: true,
					requirejs: true,
					describe: true,
					expect: true,
					it: true
				}
			}
		},
		watch: {
			files: '<%= jshint.src %>',
			tasks: ['jshint']
		},
		mocha: {
			all: ['tests/test.js']
		}
	});

	// Load JSHint task
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mocha');

	// Default task.
	grunt.registerTask('default', [jshint','mocha']);


};