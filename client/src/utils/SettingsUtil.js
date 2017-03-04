export const getExtensionDataAjax = (blacklist, callback) => {
  const exData1 = {
    url: 'facebook.com',
    time_spent: 30,
  };
  const exData2 = {
    url: 'pinterest.com',
    time_spent: 60,
  };
  if (blacklist.url === exData1.url) {
    callback(exData1);
  }
  if (blacklist.url === exData2.url) {
    callback(exData2);
  }
};


export const getBlacklistAjax = (auth0Id, callback) => {
  $.ajax({
    type: 'GET', // GET REQUEST
    url: `/api/users/${auth0Id}/blacklist`,
    success: (data) => {
      console.log('SUCCESS: OBTAINED BLACKLIST: ', data.data);
      callback(data);
    },
    error: (err) => { console.log('ERROR: COULD NOT GET BLACKLIST', err); },
  });
};

// export default SettingsUtil;
