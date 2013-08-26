  var allFeedItems = [];
  var allHashTags = {};
  var arrayHashtagsSorted = [];
  var countPostWithHashtags = {};
  /*debug*/
  //show all feed items in console
  var debug_SHOW_ALL_POSTS = true;
  //create json <textarea> with all feed items
  var debug_CREATE_JSON = false;
  var debug_START_TIME = ''; //'1376587824';
  var debug_END_TIME = ''; //1377507611';
  /*debug*/
  
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

  function create_hashtag_top() {
    console.log( 'start get feed' );

    var count = 0;
    var counterPartsFeed = 1;
    var filters = 'post, photo, photo_tag, note'

    VK.api(
      "newsfeed.get", 
      { filters: filters, max_photos: 1, count: 100, start_time: debug_START_TIME, end_time: debug_END_TIME }, 
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
          { filters: filters, max_photos: 1, count: 100, offset: data.response.new_offset, start_time: debug_START_TIME, end_time: debug_END_TIME }, 
          get_part_feed
          );
        }
        else{
          // console.log( 'End requests.' );
          parseFeed( allFeedItems );
          showFeedHashtags();
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
    console.debug( 'In parse.' );
    feed.forEach( 
      function( x ) { 
        // if ( x.date == 1376931089 ) { 
          if (debug_SHOW_ALL_POSTS == true) { 
            con ( x ); 
          }
          if ( debug_CREATE_JSON ) { debug_create_json( x ) };

          parseFeedItem( x );
        // };
      } 
    );
    con( allHashTags );
    con( allFeedItems );
    con( countPostWithHashtags );
    return feed;
  }

  function parseFeedItem( item ){
    
    for( p in item ){
      if ( item[p] instanceof Object){ //nested obj in property
        parseFeedItem( item[p] )
      }
      else {
        propertyHashtags = get_hashtags( item[p] );
        addHashtags( allHashTags, propertyHashtags );
        
        if ( Object.keys( propertyHashtags ).length != 0 ) {
          countPostWithHashtags[ item.date + '_' + item.source_id ]=''; // generate item keys, to rescue if are many hashtags in one feed item
        }
      }
    }
    return null;
  }

  /*Get hashtags from property.*/
  function get_hashtags( str ) {    
    var hashtags_obj = {};
    //TODO more precise regex later
    var reg = /\B(#[\w\u0400-\u04FF@]{2,})[\s,]/g;
    str = ' '+str+' ';
    var ary = reg.exec( str );
    while( ary != null ){
      addHashtag( hashtags_obj, ary[1] );
      reg.lastIndex--;
      ary = reg.exec( str );
    }
    return hashtags_obj;
  }
  /*Add many hashtags to obj */
  function addHashtags( obj, hashtags ){
    for ( h in hashtags ){
      for( i=1; i<=hashtags[h].count; i++ ){
        addHashtag( obj, h );
      }
    }  
  }

  /*test data:*/
  // allh = {};
  // addHashtag( allh, '#hello');
  // addHashtag( allh, '#julia');
  // addHashtag( allh, '#julia');
  // addHashtag( allh, '#maz');
  // con( allh );
  /* Add one hashtag*/
  function addHashtag( obj, hashtag ){
    if ( hashtag in obj) {
      obj[hashtag].count++;
    } 
    else{
      obj[hashtag] = { count: 1 };
    }
    return obj;
  }

  function con( val ){
    console.debug( val );
  }

  function showFeedHashtags() {
    
    $('#response').append("<div>Постов было всего: "+ allFeedItems.length +"</div><div>Постов c хештегами: "+ Object.keys( countPostWithHashtags ).length +"</div>");
    
    $('#response').append("<br><textarea cols= 60 rows=20></textarea>" );
    var el = $('#response>textarea');    
    for ( p in allHashTags ) {
        c = allHashTags[p].count
        arrayHashtagsSorted.push( [c, p] );
    }
    arrayHashtagsSorted.sort( function( a, b ){ return (b[0] - a[0]); } );
    con( arrayHashtagsSorted );
    arrayHashtagsSorted.forEach( 
      function( v, i) {
        el.append( i+1+'. '+v[1]+' '+v[0]+'\n' );
      }
    );

  }
  
/*debug functions*/
  function debug_create_json( x ){
    if ( $('#json').length == 0 ) { 
      $('#response').prepend("<br><textarea id=json cols= 10 rows=10></textarea>")
    }
    $("#json").append( JSON.stringify( x ) );
  }
/*debug functions*/