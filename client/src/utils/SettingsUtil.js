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


export const postReflectionAjax = (auth0Id, reflections, callback) => {
  $.ajax({
    type: 'POST',
    url: `/api/users/${auth0Id}/reflections`,
    contentType: 'application/json',
    data: JSON.stringify(reflections),
    success: (data) => {
      console.log('SUCCESS: POSTED REFLECTIONS: ', data);
      callback(data);
    },
    error: (err) => { console.log('ERROR: COULD NOT POST REFLECTIONS', err); },
  });
};

export const getReflectionsAjax = (auth0Id, callback) => {
  $.ajax({
    type: 'GET',
    url: `/api/users/${auth0Id}/reflections`,
    success: (data) => {
      console.log('SUCCESS: OBTAINED REFLECTIONS: ', data);
      callback(data);
    },
    error: (err) => {
      console.log('ERROR: COULD NOT GET REFLECTIONS', err);
    }
  });
};
// export default SettingsUtil;
