module.exports = function(grunt) {

  require('jit-grunt')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: true,
        force: true
      },
      src: {
        src: ['src/xprecise.js']
      }
    },

    uglify: {
      js: {
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
          'xprecise.min.js': ['src/jquery-ui.min.js', 'src/jquery.cookie.js', 'src/xprecise.js']
        }
      }
    },

    cssmin: {
      css: {
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        files: {
          'xprecise.min.css': ['src/xprecise.css']
        }
      }
    }

  });

  grunt.registerTask('build', [
    'jshint',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
