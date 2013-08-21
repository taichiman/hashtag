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
    var filters = 'post, photo, photo_tag, note'

    VK.api(
      "newsfeed.get", 
      { filters: filters, max_photos: 1, count: 100, start_time: 1376837769, end_time: 1377000273 }, 
      get_part_feed
    );

    function get_part_feed( data ) {
      // console.log( ' discover part feed :' + counterPartsFeed );
      if (data.response) { 
        if ( data.response.items.length>0 ) {
          // console.debug( data.response );
          counterPartsFeed++;
          allFeedItems = allFeedItems.concat( data.response.items )
          // console.info( allFeedItems );
          VK.api(
          "newsfeed.get", 
          { filters: filters, max_photos: 1, count: 100, offset: data.response.new_offset, start_time: 1376837769, end_time: 1377000273 }, 
          get_part_feed
          );
        }
        else{
          // console.log( 'End requests.' );
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
    console.debug( 'In parse.' )
    // var toClass = {}.toString;
    // console.debug( toClass.call( feed[0] ) );
    // console.debug( feed[0].toString() );
    // console.debug( feed[0][1] instanceof Object );
    // feed.forEach( function(x){ console.debug( x ) } );
    
    console.debug( feed[0] );
    console.info( 'Follow lenght:' )

    // for( i=0; i<feed[0].length; i++ ){
    //   console.debug( feed[0][i] );
    // }
    for( p in feed[0] ){
      console.debug( p );
    }
    
    for( x=0; x<100; x++) { 
      console.debug( feed[x].attachments )  
    };
    
    // console.debug( feed );
    // console.debug( feed[1] );
    return feed;
  }

  // function show( hashtags ) {
  //   $('#out').text( hashtags );
  // }