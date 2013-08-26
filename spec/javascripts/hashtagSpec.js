describe("Feed parsing", function() { 
  it("Get all hashtags from property. get_hashtags().", function() {
    // str = 'Hi  #ken #sdHello World #omsk Good #my #Denis- #Де_нисQross buy #ved` ';
    // var strJson = {'#ken': { count: 1 },'#sdHello': { count: 1 },'#omsk': { count: 1 },'#my': { count: 1 },'#Де_нисQross': { count: 1 }};
    str = 'Hi  #ken #sdHello World #omsk Good #my #Denis- #Де_нисQross buy #authenticfolk, #ved` ';
    var strJson = {'#ken': { count: 1 },'#sdHello': { count: 1 },'#omsk': { count: 1 },'#my': { count: 1 },'#Де_нисQross': { count: 1 }, '#authenticfolk': { count: 1 }};
    expect( JSON.stringify( get_hashtags( str ) ) ).toBe(JSON.stringify( strJson ));
  });

  it("Add hashtag object to global object allHashTags. addHashtags().", function() {
    hashtag_obj = { '#foo':{count:1}, '#bar':{count:2}};
    var pseudo_allHashTag = {'#bar':{count:3},'#ken': { count: 1 },'#sdHello': { count: 1 },'#omsk': { count: 1 },'#my': { count: 1 },'#Де_нисQross': { count: 1 }};
    var result_allHashTag = {'#foo':{count:1},'#bar':{count:5},'#ken': { count: 1 },'#sdHello': { count: 1 },'#omsk': { count: 1 },'#my': { count: 1 },'#Де_нисQross': { count: 1 }};
    addHashtags( pseudo_allHashTag, hashtag_obj ); //there mutate global pseudo_allHashTag
    expect( _.isEqual( pseudo_allHashTag , result_allHashTag )).toBeTruthy();
    // console.debug( pseudo_allHashTag ); 
    // console.debug( result_allHashTag );
  });
});
