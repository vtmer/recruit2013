module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Configurable paths
		yeoman: {
			app: 'app',
			dist: 'dist'
		},

		watch: {
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= yeoman.app %>/*.html',
					'<%= yeoman.app %>/styles/{,*/}*.css',
					'<%= yeoman.app %>/scripts/{,*/}*.js',
					'<%= yeoman.app %>/images/{,*/}*.{gif,jpeg,jpg,png,svg,webp}'
				]
			}
		},

		connect: {
			options: {
				keepalive: true,
				port: 9000,
				livereload: 35729,
				hostname: 'localhost'
			},
			livereload: {
				options: {
					open: true,
					base: ['<%= yeoman.app %>']
				}
			}
		},

		uglify: {
			build: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>',
					src: 'scripts/*.js',
					dest: '<%= yeoman.dist %>'
				}]
			}
		},
		
		htmlmin: {
			build: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
					removeCommentsFromCDATA: true
				},
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>',
					src: '*.html',
					dest: '<%= yeoman.dist %>'
				}]
			}
		},

		copy: {
			init: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/bower_components/jquery/',
					src: 'jquery.min.js',
					dest: '<%= yeoman.app %>/scripts/',
					ext: '.js'
				}, {
					'<%= yeoman.app %>/scripts/require.js': 
					'<%= yeoman.app %>/bower_components/requirejs/require.js'
				}, {
					expand: true,
					cwd: '<%= yeoman.app %>/bower_components/sass-bootstrap/dist/js',
					src: '*.min.js',
					dest: '<%= yeoman.app %>/scripts/',
					ext: '.js'
				}, {
					expand: true,
					cwd: '<%= yeoman.app %>/bower_components/sass-bootstrap/dist/css',
					src: '*.min.css',
					dest: '<%= yeoman.app %>/styles/',
					ext: '.css'
				}, {
					'<%= yeoman.app %>/scripts/modernizr.js': 
					'<%= yeoman.app %>/bower_components/modernizr/modernizr.js'
				}, {
					expand: true,
					cwd: '<%= yeoman.app %>/bower_components/lxjwltwebapp/',
					src: '*.js',
					dest: '<%= yeoman.app %>/scripts'
				}, {
					expand: true,
					cwd: '<%= yeoman.app %>/bower_components/lxjwltwebapp/',
					src: '*.scss',
					dest: '<%= yeoman.app %>/scss/'
				}, {
					'<%= yeoman.app %>/styles/normalize.css': 
					'<%= yeoman.app %>/bower_components/normalize-css/normalize.css'
				}]
			},
			build: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>',
					src: [
						'fonts/{,*/}*.*',
						'images/{,*/}*.ico'
					],
					dest: '<%= yeoman.dist %>'
				}]
			}
		},

		// sass: {
		// 	expanded: {
		// 		options: {
		// 			style: 'expanded'
		// 		},
		// 		files: [{
		// 			expand: true,
		// 			cwd: '<%= yeoman.app %>/scss',
		// 			src: '*.scss',
		// 			dest: '<%= yeoman.app%>/styles',
		// 			ext: '.css'
		// 		}]
		// 	},
		// 	compressed: {
		// 		options: {
		// 			style: 'compressed'
		// 		},
		// 		files: [{
		// 			expand: true,
		// 			cwd: '<%= yeoman.app %>/scss',
		// 			src: '*.scss',
		// 			dest: '<%= yeoman.dist %>/styles',
		// 			ext: '.css'
		// 		}]
		// 	}
		// },

		imagemin: {
			build: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/images',
					src: '{,*/}*.{gif,jpeg,jpg,png}',
					dest: '<%= yeoman.dist %>/images'
				}]
			}
		},

		clean: {
			build: {
				src: ['<%= yeoman.dist %>']
			}
		},

		compass: {
			options: {
				// debugInfo: true,
				imagesDir: '<%= yeoman.app %>/images',
				httpGeneratedImagesPath: '../images'
			},
			compile: {
				options: {
					outputStyle: 'expanded',
					sassDir: '<%= yeoman.app %>/scss',
					cssDir: '<%= yeoman.app %>/styles'
				}
			},
			server: {
				options: {
					watch: true,
					outputStyle: 'expanded',
					sassDir: '<%= yeoman.app %>/scss',
					cssDir: '<%= yeoman.app %>/styles'
				}
			},
			build: {
				options: {
					outputStyle: 'compressed',
					force: true,
					sassDir: '<%= yeoman.app %>/scss',
					cssDir: '<%= yeoman.dist %>/styles'
				}
			}
		},

		concurrent: {
			options: {
				logConcurrentOutput: true
            },
			server: [
				'connect',
				'watch', 
				'compass:server'
			],
			build: [
				'uglify', 
				// 'sass:compressed', 
				'compass:build', 
				'htmlmin',
				'copy:build',
				'imagemin'
			]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.registerTask('default', ['copy:init']);
	grunt.registerTask('build', [
		'clean:build',
		'concurrent:build'
	]);
	grunt.registerTask('server', [
		'concurrent:server'
	]);
};