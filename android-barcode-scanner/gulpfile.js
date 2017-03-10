var gulp = require('gulp'),
  plug = require('gulp-load-plugins')({ lazy: true }),
  config = require('./gulp.config')(),
  del = require('del'),
  yargs = _configureYargs(require('yargs'));

gulp.task('help', plug.taskListing);

gulp.task('default', ['help']);

gulp.task('clean', function (callback) {
  log('Cleaning dist folder');

  del(config.paths.distRoot + '/**/*').then(function () { callback(); });
});

gulp.task('release', ['analyze', 'clean'], function () {
  log('Minifying js and css to dist-folder');

  var cssFilter = plug.filter('**/*.css', { restore: true }),
    jsFilter = plug.filter('**/*.js', { restore: true });

  return gulp.src([config.js, config.css])
    .pipe(_handleErrors())
    .pipe(_printVerbose())
    .pipe(cssFilter)
    .pipe(plug.csso())
    .pipe(cssFilter.restore)
    .pipe(jsFilter)
    .pipe(plug.uglify())
    .pipe(jsFilter.restore)
    .pipe(gulp.dest(config.paths.distRoot));
});

gulp.task('analyze', ['analyze-js', 'analyze-html']);

gulp.task('analyze-js', function () {
  log('Analyzing javascript files');

  return gulp.src(config.jsHint)
    .pipe(_handleErrors())
    .pipe(_printVerbose())
    .pipe(plug.jshint())
    .pipe(plug.jshint.reporter('jshint-stylish'))
    .pipe(plug.if(yargs.fail, plug.jshint.reporter('fail')))
    .pipe(plug.jscs())
    .pipe(plug.jscs.reporter())
    .pipe(plug.if(yargs.fail, plug.jscs.reporter('fail')));
});

gulp.task('analyze-html', function () {
  log('Analyzing html files');

  return gulp.src(config.html)
    .pipe(_handleErrors())
    .pipe(_printVerbose())
    .pipe(plug.htmlLint())
    .pipe(plug.htmlLint.format())
    .pipe(plug.if(yargs.fail, plug.htmlLint.failAfterError()));
});

/**
 * Usage:
 * gulp version [--type=<major|minor|patch>] [--version=<1.2.3>] [--verbose]
 * Default (without type or version args) is --type=patch.
 */
gulp.task('version', function () {
  log('Updating version');

  return updateVersion(config.manifest, './');

  function updateVersion(source, destination) {
    var version = yargs.version,
      type = yargs.type,
      options = {};

    if (version) {
      options.version = version;
    } else if (type) {
      options.type = type;
    }

    log(options);

    return gulp.src(source)
      .pipe(_printVerbose())
      .pipe(_handleErrors())
      .pipe(plug.bump(options))
      .pipe(gulp.dest(destination));
  }
});

gulp.task('watch', function () {
  log('Watching for changes in js files');

  gulp.watch(config.jsHint, ['analyze-js']);
});

/*********************************************************************************************/

function _configureYargs(yargs) {
  return yargs.usage('gulp <command> [options]')
    .command('version', 'Bump version', function (argv) {
      yargs = argv.usage('Usage: gulp version [--type=<choice>] [--version=<version>] [--verbose]')
        .options({
          type: {
            choices: ['major', 'minor', 'patch'],
            describe: 'Bump selected type of version, <major.minor.patch>',
            type: 'string'
          },
          version: {
            describe: 'Specify explicit version, e.g. 1.2.3',
            type: 'string'
          }
        })
        .help('help')
        .alias('h', ['?', 'help'])
        .argv;
    })
    .options('v', {
      alias: 'verbose',
      describe: 'Print verbose output',
      type: 'boolean'
    })
    .help('help')
    .alias('h', ['?', 'help'])
    .argv;
}

function _printVerbose() {
  return plug.if(yargs.verbose, plug.print());
}

function _handleErrors() {
  return plug.if(!yargs.fail, plug.plumber(onError));

  function onError(error) {
    plug.util.log(
      plug.util.colors.cyan('Plumber') + plug.util.colors.red(' found unhandled error:\n'),
      error.toString());

    // This line of code solves the watcher crashing on some errors.
    this.emit('end');
  }
}

function log(message) {
  if (typeof (message) === 'object') {
    for (var item in message) {
      if (message.hasOwnProperty(item)) {
        plug.util.log(plug.util.colors.yellow(message[item]));
      }
    }
  } else {
    plug.util.log(plug.util.colors.yellow(message));
  }
}
