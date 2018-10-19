const Xray = require('x-ray');
const x = Xray();


/**
* @param context {WebtaskContext}
*/
module.exports = function(context, cb) {

  let uri, className, id, limit;

  if (context.query.uri.includes("http://") || context.query.uri.includes("https://")) {
    uri = context.query.uri || 'https://www.google.com.ar';
  } else {
    uri = "https://" + context.query.uri || 'https://www.google.com.ar';
  }

  let selectorArray = [];

  if (context.query.className) {
    className = "." + context.query.className + "@html";
    selectorArray.push(className);
  }

  if (context.query.id) {
    id = "#" + context.query.id + "@html";
    selectorArray.push(id);
  }

  limit = context.query.limit && !isNaN(parseInt(context.query.limit)) ? parseInt(context.query.limit) : 100;

  x(uri, selectorArray)
    .limit(limit)
    .then(function (res) {
      cb(null, {
        selectorArray,
        amount: res && res.length ? res.length : 0,
        limit,
        data: res });
    })
    .catch(function (err) {
      delete err.stack;
      cb(err, null);
    });

};
