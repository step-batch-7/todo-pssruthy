const sendHttpGetReq = function(url, callback){
  const req = new XMLHttpRequest();
  req.onload = function(){
    if(this.status === 200) {
      return callback(this.responseText);
    }
  };
  req.open('GET', url);
  req.send();
};

const sendHttpPostReq = function(url, callback, body){
  const req = new XMLHttpRequest();
  req.onload = function(){
    if(this.status === 200) {
      return callback(this.responseText);
    }
  };
  req.open('POST', url);
  req.send(body);
};
