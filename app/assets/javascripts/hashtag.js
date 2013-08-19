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
    console.log('hello from func');
    var feed = get_user_feed();
    // var top_hashtag = parse( feed );
    // show( top_hashtag );
    return "Hashtags has shown";
  }

  function get_user_feed() {
    VK.api(
      "newsfeed.get", 
      { start_time: 1376870400 }, 
      function(data) { 
        console.log( 'start get feed' );
        if (data.response) { 
         // data.response is object 
         console.debug( data.response );         
        } 
        else {
         console.error( data.error );         
        }
      }
    )
    return [];
  }

  // function parse( feed ){
  //   return 'Ary hashtags';
  // }

  // function show( hashtags ) {
  //   $('#out').text( hashtags );
  // }