Package.describe({
  name: 'avatar-uploader',
  version: '0.0.1',
  summary: '头像上传',
  git: '',
  documentation: 'README.md'
});

Npm.depends({
  'qiniu': '6.1.8'
});


Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.use([
    'templating',
    'meteorhacks:npm@1.4.0'
  ]);

  api.addFiles('server/qiniu-node-sdk.js', 'server');
  api.export('QiniuNodeSDK', 'server');

  api.addFiles([
    'client/css/img-upload.css',
    'client/css/jquery.guillotine.css',
    'client/lib/jquery.guillotine.min.js',
    'client/lib/img-upload.js'
  ], 'client');

  api.addFiles([
    'client/avatar-upload.html',
    'client/avatar-upload.js',
    'client/avatar-upload.css'
  ], 'client');

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('avatar-uploader');
  api.addFiles('avatar-uploader-tests.js');
});
