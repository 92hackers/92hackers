Package.describe({
  name: 'cy476571:material-design-lite-newest-version',
  version: '1.0.6',
  // Brief, one-line summary of the package.
  summary: 'newest version of material-design-lite',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/google/material-design-lite.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.addFiles(['material.css', 'material.js'], 'client');
});
