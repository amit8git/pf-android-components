module.exports = function () {
  var paths = {
    distRoot: './dist/',
    srcRoot: './src/',
    testsRoot: './tests/'
  },
    moduleName = 'nf.barcode-scanner',
    manifest = ['./bower.json', './package.json'],
    js = paths.srcRoot + '**/*.js',
    specs = paths.testsRoot + '**/*@(.|-|_)spec.js',
    css = paths.srcRoot + '**/*.css',
    images = paths.srcRoot + 'images/*',
    templates = 'templates/*.html',
    html = [paths.srcRoot + '**/*.html', templates],
    jsHint = [js, './*.js', specs],
    karma = {
      files: [].concat('bower_components/angular/angular.js',
        'bower_components/angular-mocks/angular-mocks.js',

        // If you wanna load template files in nested directories, you must use this
        templates,
        js,
        specs),
      exclude: [],
      preprocessors: {}
    };

  karma.preprocessors[templates] = 'ng-html2js';

  return {
    paths: paths,
    manifest: manifest,
    js: js,
    css: css,
    images: images,
    html: html,
    specs: specs,
    jsHint: jsHint,
    templates: templates,
    karma: karma,
    moduleName: moduleName
  };
};
