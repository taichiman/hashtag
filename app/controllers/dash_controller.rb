class DashController < ApplicationController
  def index
    if params[ :api_result ]
      r = JSON.parse(params[ :api_result ])
      @first_name = r['response'][0]['first_name']
      @last_name = r['response'][0]['last_name']
    end
  end

  def show    
    r = Hashtag.last_hashtags( params[ :uid ] )
    render json: { 
                  uid: r.uid, 
                  timezone: r.timezone,
                  count_posts: r.count_posts,
                  count_posts_with_hashtag: r.count_posts_with_hashtag,
                  hashtags: r.hashtags
                 }
  end

  # save hashtags from client to db
  def create
    hashtag = Hashtag.create( { uid: params[ :uid ] ,
      timezone: params[:timezone],
      count_posts: params[ :countAllFeedItems ],
      count_posts_with_hashtag: params[ :countPostWithHashtags ],
      hashtags: params[ :hashtags ] } )
    hashtag.save ? saved = true : saved = false
    render json: { saved: saved }
  end
end
