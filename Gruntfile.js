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
          }, {
            pattern: /<title>.*<\/title>/,
            replacement: ''
          },
          {
            pattern: ' fill="#000"',
            replacement: ''
          },
          {
            pattern: ' fill="none"',
            replacement: ''
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
      manifestStyleGuide: {
        files: {
          'manifest-styleguide.js': 'manifest-styleguide.js',
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
      },
      manifestHelper: {
        files: {
          'manifest-helper.js': 'manifest-helper.js',
        },
        options: {
          replacements: [{
            pattern: /<svg role="icon" class="svg-icon icon/g,
            replacement: 'public static SvgImage '
          }, {
            pattern: /" width=".*<\/svg>/g,
            replacement: ' { get; } = GetImage();'
          }, {
            pattern: /build\/.*\.svg/g,
            replacement: ''
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
      manifestStyleGuide: {
        src: ['build/**/*.svg'],
        dest: 'manifest-styleguide.js',
      },
      manifestHelper: {
        src: ['build/**/*.svg'],
        dest: 'manifest-helper.js',
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
  grunt.registerTask('default', ['clean', 'svgmin', 'string-replace:build', 'replace', 'string-replace:replaceSvg', 'concat:manifestStyleGuide', 'string-replace:manifestStyleGuide', 'concat:manifestHelper', 'string-replace:manifestHelper']);
};
