var loopback = require('loopback');
var boot = require('loopback-boot');
var app = module.exports = loopback();
var bodyParser = require('body-parser');

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(loopback.context());

process.env.HOST = process.env.HOST || '0.0.0.0';
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
process.env.EMAILS_ENABLED = process.env.EMAILS_ENABLED || false; //emails off by default

app.set('host', process.env.HOST);
//process.env.EMAILS_ENABLED = true;
app.set('emailsEnabled', process.env.EMAILS_ENABLED);
app.set('env', process.env.NODE_ENV);

console.log('host set to: ' + app.get('host'));
console.log('emails enabled: ' + app.get('emailsEnabled'));
console.log('env: ' + app.get('env'));


// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname);

app.start = function () {
  // start the web server
  return app.listen(function () {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
