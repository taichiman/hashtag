  it("main function", function() {
    expect( create_hashtag_top() ).toBe('Hashtags has shown');
  });

describe("Feed getting", function() { 
  it("get_user_feed", function() {
    expect( Array.isArray( get_user_feed() ) ).toBe( true );
  });
  
  it("get_user_feed", function() {
    expect( Array.isArray( get_user_feed() ) ).toBe( true );
  });
  
});

