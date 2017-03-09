const getUserAjax = (auth0Id, callback) => {
  $.ajax({
    type: 'GET',
    url: `api/users/${auth0Id}`,
    success: (data) => {
      callback(data);
    },
    error: (err) => {
      console.log('ERROR: COULD NOT GET USERID', err);
    },
  });
};

export default getUserAjax;
