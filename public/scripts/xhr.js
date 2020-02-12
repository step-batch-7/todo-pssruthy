const sendReq = function(method, url, body, callback) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    if (this.status === 200) {
      return callback(this.responseText);
    }
  };
  req.open(method, url);
  req.send(body);
};

const sendHttpGetReq = function(url, callback) {
  sendReq('GET', url, '', callback);
};

const sendHttpPostReq = function(url, body, callback) {
  sendReq('POST', url, JSON.stringify(body), callback);
};
