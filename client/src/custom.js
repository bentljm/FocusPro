$( document ).ready(function() {
    console.log( "ready!" );
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  //$('.collapsible').collapsible();
  // Initialize collapse button
    $('.button-collapse').sideNav({
      // menuWidth: 200, // Default is 300
      // edge: 'left', // Choose the horizontal origin
      // closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      // draggable: true // Choose whether you can drag to open on touch screens
    }
  );
});