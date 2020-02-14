const sendReq = function(method, url, body, callback) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    if (this.status < 400) {
      return callback(this.responseText);
    }
  };
  req.open(method, url);
  let content = body;
  if (body) {
    req.setRequestHeader('Content-Type', 'application/json');
    content = JSON.stringify(body);
  }
  req.send(content);
};

const sendHttpGetReq = function(url, callback) {
  sendReq('GET', url, '', callback);
};

const sendHttpPostReq = function(url, body, callback) {
  sendReq('POST', url, body, callback);
};

const sendHttpPatchReq = function(url, body, callback) {
  sendReq('PATCH', url, body, callback);
};

const sendHttpDeleteReq = function(url, body, callback) {
  sendReq('DELETE', url, body, callback);
};
