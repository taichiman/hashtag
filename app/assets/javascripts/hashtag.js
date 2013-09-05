  var timeLastHashtagsRequest= {};
  var appUserId;
  var appUserTimeZone;
  var allFeedItems = [];
  var allHashTags = {};
  // var arrayHashtagsSorted = [];
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

//   startInit();
// function startInit(){
//   var hashtags = getHashtagsFromServer();
// }

  start();

  function start() {
    VK.init(
      function() { 
        getUserId();
        // create_hashtag_top();
      }, 
      // TODO: reload_page
      function() {},
      '5.0'
    )
  }

 // TODO timezone - no need in this application
  function getUserId(){
    VK.api("users.get", { fields: 'timezone'}, 
      function(data){ 
        appUserId = data.response[0].id;
        appUserTimeZone = data.response[0].timezone;
        getHashtagsFromServerAndShow();
      }
    );
  }

  function create_hashtag_top(){
    var filters = 'post, photo, photo_tag, note'
    con( 'start get feed' );
    
    VK.api("execute", {  
    code:
    "var id = API.users.get()[0].id;\
    var timezone = API.users.get({\"user_ids\":id, \"fields\":\"timezone\"})[0].timezone;\
    var time = API.utils.getServerTime();\
    var response = API.newsfeed.get({count:100, filters:\"" + filters +"\", max_photos: 1}); \
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
return [ all_items, time, timezone ];"
     }, generate_array_allFeedItems );

    function generate_array_allFeedItems( data ){
      con('In generate..');
      timeLastHashtagsRequest = { 'time': data.response[ 1 ], 
        'timezone': data.response[ 2 ] };
      data.response = data.response[ 0 ];

      if (data.response) {
        con('Items received.');
        con( data.response );
        data.response.forEach( function( x ){
          allFeedItems = allFeedItems.concat( x )
        });        
        con( allFeedItems );
        parseFeed( allFeedItems );
        showFeedHashtags( 
          { countAllFeedItems: allFeedItems.length, 
            countPostWithHashtags: Object.keys( countPostWithHashtags ).length,
            time: timeLastHashtagsRequest.time,
            timezone: timeLastHashtagsRequest.timezone 
          }
        );
      }
      else {
       console.error( "Error respond:" + data.error );
       window.alert( 'There is some error when respond. See console.' );
      }
    }

    return [];
  }

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

  function createHashtagsTop(){
    var arrayHashtagsSorted = [];
    for ( p in allHashTags ) {
      c = allHashTags[p].count
      arrayHashtagsSorted.push( [c, p] );
    }
    arrayHashtagsSorted.sort( function( a, b ){ return (b[0] - a[0]); } );
    return arrayHashtagsSorted;
  }

  // function showFeedHashtags( countAllFeedItems, _countPostWithHashtags, arrayHashtagsSorted, time, timezone ) {
  function showFeedHashtags( output ) {
    // countAllFeedItems, _countPostWithHashtags, arrayHashtagsSorted, time, timezone 
    var date = new Date( output.time * 1000 )
    var hours = date.getHours(); // + output.timezone;
    var minutes = date.getMinutes();

    $('#response').append("<div class='hashtag_info' ><div>Постов было всего: "+ output.countAllFeedItems +
      "</div><div>Постов c хештегами: "+ 
      output.countPostWithHashtags +"</div>"+
    "<div>Время сканирования: "+ date.getDate() +"."+ date.getMonth()+"."+date.getFullYear()+" в "
    + hours + ":" + minutes + "</div></div>");
    
    $('#response').append("<br><textarea class='hashtag_info' cols= 60 rows=3></textarea></div>" );
    var el = $('#response>textarea');    
    
    if ( output.arrayHashtagsSorted === undefined ) { // sort for create hashtag top
      output.arrayHashtagsSorted = createHashtagsTop();
    }

    con( output.arrayHashtagsSorted );
    output.arrayHashtagsSorted.forEach( 
      function( v, i) {
        el.append( i+1+'. '+v[1]+' '+v[0]+'\n' );
      }
    );

    putHashtagsToServer(
      { 
        uid: appUserId,
        countAllFeedItems: output.countAllFeedItems, 
        countPostWithHashtags: output.countPostWithHashtags,
        hashtags: JSON.stringify( output.arrayHashtagsSorted ),
        time: output.time,
        timezone: output.timezone
      }
    );
  }

  // function showFeedHashtags( countAllFeedItems, countPostWithHashtags, arrayHashtagsSorted ) { 
  //   $('#response').append("<div>Постов было всего: "+ allFeedItems.length +"</div><div>Постов c хештегами: "+ Object.keys( countPostWithHashtags ).length +"</div>");
    
  //   $('#response').append("<br><textarea cols= 60 rows=10></textarea>" );
  //   var el = $('#response>textarea');    
  //   for ( p in allHashTags ) {
  //       c = allHashTags[p].count
  //       arrayHashtagsSorted.push( [c, p] );
  //   }
  //   arrayHashtagsSorted.sort( function( a, b ){ return (b[0] - a[0]); } );
  //   con( arrayHashtagsSorted );
  //   arrayHashtagsSorted.forEach( 
  //     function( v, i) {
  //       el.append( i+1+'. '+v[1]+' '+v[0]+'\n' );
  //     }
  //   );
  // }
  
/*debug functions*/
  function debug_create_json( x ){
    if ( $('#json').length == 0 ) { 
      $('#response').prepend("<br><textarea id=json cols= 10 rows=10></textarea>")
    }
    $("#json").append( JSON.stringify( x ) );
  }
/*debug functions*/