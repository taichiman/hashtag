  function create_hashtag_top() {
    console.log('hello from func');
    var feed = get_user_feed();
    var top_hashtag = parse( feed );
    show( top_hashtag );
  }

  function get_user_feed() {
    return 'Feed';
  }

  function parse( feed ){
    return 'Ary hashtags';
  }

  function show( hashtags ) {
    $('#out').text( hashtag );
  }