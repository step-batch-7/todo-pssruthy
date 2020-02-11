const getDataStorePath = function(){
  return process.env.STORAGE_FILE || `${__dirname}/dataStore/todoInfo.json`;
};

const config = {
  STORAGE_FILE: getDataStorePath()
};

module.exports = config;
