  start();

  function start() {
    VK.init(
      function() { 
        display_name();
        create_hashtag_top();    
      }, 
      function() {},
      '5.0'
    )
  }

  function display_name() {
    VK.api(
      "users.get", 
      {fields:"first_name, last_name", test_mode:"1"}, 
      function(data) { 
        var first_name = document.getElementById('response');
        first_name.textContent = "Привет, "+data.response[0].first_name + ', '+ data.response[0].last_name;
      }
    )
  }  
  var allFeedItems = [];

  function create_hashtag_top() {
    var feed = getUserFeed();
    // show( top_hashtag );
    return "Hashtags has shown";
  }

  function getUserFeed() {
    console.log( 'start get feed' );

    var count = 0;
    var counterPartsFeed = 1;

    VK.api(
      "newsfeed.get", 
      { count: 100, start_time: 1376837770 }, 
      get_part_feed
    );

    function get_part_feed( data ) {
      console.log( ' discover part feed :' + counterPartsFeed );
      if (data.response) { 
        if ( data.response.items.length>0 ) {
          console.debug( data.response );
          counterPartsFeed++;
          allFeedItems = allFeedItems.concat( data.response.items )
          console.info( allFeedItems );
          VK.api(
          "newsfeed.get", 
          { count: 100, offset: data.response.new_offset, start_time: 1376837770 }, 
          get_part_feed
          );
        }
        else{
          console.log( 'End requests.' );
          parseFeed( allFeedItems );
        }
      } 
      else {
       console.error( "Error respond:" + data.error );
       window.alert( 'There is some error when respond. See console.' );
      }
    }
    return [];
  }

  function parseFeed( feed ){
    console.log( 'In parse.' )
    console.log( allFeedItems )
    z=document.createElement('textarea')
    z.rows = 10;
    z.cols = 40;
    z.textContent = JSON.stringify( allFeedItems );
    k=document.getElementsByTagName('p')[0];
    k.appendChild( z );
    console.log( k, z );
    return 'Ary hashtags';
  }

  // function show( hashtags ) {
  //   $('#out').text( hashtags );
  // }