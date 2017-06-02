module.exports = function(grunt) {
  // Project configuration.  
  grunt.initConfig({
    clean: ["build"],
    svgmin: {
      options: {
        plugins: [{
          // Unfortunately, adding attributes doesn't play well with removing
          // them. For reasons™, we can't rely on our Svg.cs helper to add
          // them for us. We'll use a find and replace after SVGmin on each
          // of these built SVGs.
          //
          // addAttributesToSVGElement: {
          //   attributes: ['class="icon"', 'role="icon"']
          // },
          removeAttrs: {
            attrs: ['xmlns', 'fill-rule']
          },
          collapseGroups: true,
        }]
      },
      build: {
        files: [{
          expand: true,
          cwd: 'src',
          src: '*.svg',
          dest: 'build',
        }]
      }
    },
    'string-replace': {
      build: {
        files: [{
          expand: true,
          cwd: 'build/',
          src: '**/*',
          dest: 'build/'
        }],
        options: {
          replacements: [{
            pattern: '<svg',
            replacement: '<svg role="icon" class="svg-icon icon@@__TARGET_FILENAME__"'
          }]
        }
      },
      replaceSvg: {
        files: [{
          expand: true,
          cwd: 'build/',
          src: '**/*',
          dest: 'build/'
        }],
        options: {
          replacements: [{
            pattern: '.svg',
            replacement: ''
          }]
        }
      },
      manifest: {
        files: {
          'manifest.js': 'manifest.js',
        },
        options: {
          replacements: [{
            pattern: /<svg/g,
            replacement: '<div class="-item" data-core><i><svg'
          }, {
            pattern: /<\/svg>build\//g,
            replacement: '</svg></i><code>@Svg.'
          }, {
            pattern: /\.svg/g,
            replacement: '</code></div>'
          }]
        }
      }
    },
    replace: {
      dist: {
        files: [{
          expand: true,
          cwd: 'build/',
          src: '**/*',
          dest: 'build/'
        }]
      }
    },
    concat: {
      options: {
        process: function(src, filename) {
          return src.replace(/\.svg/g, '') + filename;
        }
      },
      dist: {
        src: ['build/**/*.svg'],
        dest: 'manifest.js',
      },
    },
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['clean', 'svgmin', 'string-replace:build', 'replace', 'string-replace:replaceSvg', 'concat', 'string-replace:manifest']);
};