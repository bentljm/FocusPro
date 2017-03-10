// export const getExtensionDataAjax = (blacklist, callback) => {
//   // const exData1 = {
//     url: 'facebook.com',
//     time_spent: 30,
//   };
//   const exData2 = {
//     url: 'pinterest.com',
//     time_spent: 60,
//   };
//   if (blacklist.url === exData1.url) {
//     callback(exData1);
//   }
//   if (blacklist.url === exData2.url) {
//     callback(exData2);
//   }
// };

export const getExtensionDataAjax = (auth0Id, callback, blacklist) => {
  console.log('blacklist passed', encodeURI(blacklist.url));
  $.ajax({
    type: 'GET',
    url: `/api/users/${auth0Id}/extension_data/${encodeURIComponent(blacklist.url)}`,
    success: (data) => {
      callback(data);
    },
    error: (err) => { console.log('ERROR: COULD NOT GET EXTENSION', err); },
  });
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

export const getSettingAjax = (auth0Id, callback) => {
  $.ajax({
    type: 'GET', // GET REQUEST
    url: `/api/users/${auth0Id}/setting`,
    success: (data) => {
      console.log('SUCCESS: OBTAINED SETTINGS: ', data.data[0]);
      callback(data.data[0]);
    },
    error: (err) => { console.log('ERROR: COULD NOT GET SETTINGS', err); },
  });
};
