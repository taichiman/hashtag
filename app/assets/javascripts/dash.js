function getHashtagsFromServerAndShow(){
  console.debug ('Hi from send' )
  console.debug ( appUserId );
  $.ajax(
          { 
            url: "/dash/show",
            data:{ 
              "uid": appUserId 
            } 
          }
        ).done( 
    function( r ) {
      if( r.result != false){
        showFeedHashtags( r.count_posts, r.count_posts_with_hashtag, JSON.parse( r.hashtags ));
      }
      else{
        create_hashtag_top();
      }        
    }
  );
};

function putHashtagsToServer( hashtagsData ){
  $.ajax(
          { 
            url: "/dash/create",
            type: 'POST',
            data: hashtagsData 
          }
        ).done( 
    function( response ) {
      if ( response.saved == true ){
        console.debug( 'putHashtagsToServer, put hashtags success' );
      }
      else{
        alert("error putHashtagsToServer, hashtags not saved");
      }
    }
  );
};
