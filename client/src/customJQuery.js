$( document ).ready(function() {
  // Collapsible
  $('.collapsible').collapsible();

  //Sidebar
  // Initialize collapse button
    $('.button-collapse').sideNav({
      //menuWidth: 200, // Default is 300
      //edge: 'left', // Choose the horizontal origin
      // closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true // Choose whether you can drag to open on touch screens

    }
  );
  //For textarea
  $('#textarea1').val('');
  $('#textarea1').trigger('autoresize');
});