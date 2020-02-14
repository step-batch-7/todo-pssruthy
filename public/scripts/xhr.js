const sendReq = function(method, url, callback) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    if (this.status === 200) {
      return callback(this.responseText);
    }
  };
  req.open(method, url);
  req.send();
};

const sendReqAsJson = function(method, url, body, callback) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    return callback(this.responseText);
  };
  req.open(method, url);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify(body));
};

const sendHttpGetReq = function(url, callback) {
  sendReq('GET', url, callback);
};

const sendHttpPostReq = function(url, body, callback) {
  sendReqAsJson('POST', url, body, callback);
};

const sendHttpPatchReq = function(url, body, callback) {
  sendReqAsJson('PATCH', url, body, callback);
};

const sendHttpDeleteReq = function(url, body, callback) {
  sendReqAsJson('DELETE', url, body, callback);
};
