module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    lineNumbers: false
                },
                files: [{
                    expand: true,
                    cwd: 'static/css/scss',
                    src: ['*.scss'],
                    dest: 'static/css/compiled',
                    ext: '.css'
                }]
            }
        },
        prettify: {
            options: {
                indent: 4,
                indent_inner_html: false,
                preserve_newlines: true
            },
            all: {
                expand: true,
                cwd: 'html/ugly',
                ext: '.html',
                src: ['*.html'],
                dest: 'html/pretty'
            }
        },
        watch: {
            sass: {
                files: ['static/css/scss/*.scss', 'static/css/scss/bootstrap/*.scss'],
                tasks: ['sass']
            },
//            prettify: {
//                files: ['html/ugly/*.html'],
//                tasks: ['prettify']
//            },
            livereload: {
                files: ['static/css/compiled/*.css'],
                options: { livereload: true }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-prettify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['watch']);

};
