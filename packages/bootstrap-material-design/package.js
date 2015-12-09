Package.describe({
	name: 'chenyuan:bootstrap-material-design',
  version: '0.5.4',
  // Brief, one-line summary of the package.
  summary: 'newest bootstrap-material-design version',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/FezVrasta/bootstrap-material-design.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use(['jquery', 'bootstrap'], 'client');
  api.addFiles(['bootstrap-material-design.css', 'ripples.css', 'material.js', 'ripples.js'], 'client');
});

Package.onTest(function(api) {
  api.use(['jquery', 'bootstrap'], 'client');
  api.use('tinytest');
  api.use('chenyuan:bootstrap-material-design');
  api.addFiles('bootstrap-material-design-tests.js');
});
