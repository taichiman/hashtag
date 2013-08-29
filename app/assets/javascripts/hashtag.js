  var allFeedItems = [];
  var allHashTags = {};
  var arrayHashtagsSorted = [];
  var countPostWithHashtags = {};
  /*debug*/
  //show all feed items in console
  var debug_SHOW_ALL_POSTS = true;
  //create json <textarea> with all feed items
  var debug_CREATE_JSON = false;
  var debug_LOG_TO_CONSOLE = false;
  var debug_START_TIME = ''; //'1376587824';
  var debug_END_TIME = ''; //1377507611';
  /*debug*/

  start();

  function start() {
    VK.init(
      function() { 
        create_hashtag_top();    
      }, 
      // TODO: reload_page
      function() {},
      '5.0'
    )
  }

  function create_hashtag_top(){
    var filters = 'post, photo, photo_tag, note'
    con( 'start get feed' );
    
    VK.api("execute", {  
    code:
    "var response = API.newsfeed.get({count:100, filters:\"" + filters +"\", max_photos: 1}); \
var all_items = [response.items];\
var offset = response.new_offset;\
var from = response.new_from;\
\
while ( response.items.length>0 ){ \
  response = API.newsfeed.get({count:100, filters:\"" + filters +"\",  max_photos: 1, offset: offset, from: from}); \
  all_items = all_items + [ response.items ]; \
  offset = response.new_offset; \
  from = response.new_from;\
} \
\
return all_items;"
     }, generate_array_allFeedItems );

    function generate_array_allFeedItems( data ){
      con('In generate..');
      
      if (data.response) {
        con('Items received.');
        con( data.response );
        data.response.forEach( function( x ){
          allFeedItems = allFeedItems.concat( x )
        });        
        con( allFeedItems );
        parseFeed( allFeedItems );
        showFeedHashtags();
      }
      else {
       console.error( "Error respond:" + data.error );
       window.alert( 'There is some error when respond. See console.' );
      }
    }

    return [];
  }

  /* non-optimized version */
/*  function _slow_version_create_hashtag_top() {
    con( 'start get feed' );

    var filters = 'post, photo, photo_tag, note'

    VK.api(
      "newsfeed.get", 
      { filters: filters, max_photos: 1, count: 100, start_time: debug_START_TIME, end_time: debug_END_TIME }, 
      get_part_feed
    );

    function get_part_feed( data ) {
      if (data.response) { 
        if ( data.response.items.length>0 ) {
          allFeedItems = allFeedItems.concat( data.response.items )
          VK.api(
          "newsfeed.get", 
          { filters: filters, max_photos: 1, count: 100, offset: data.response.new_offset, start_time: debug_START_TIME, end_time: debug_END_TIME }, 
          get_part_feed
          );
        }
        else{
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
  }*/

  function parseFeed( feed ){
    con( 'Start parse.' );
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
    if ( debug_LOG_TO_CONSOLE ) console.debug( val );
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