class Hashtag < ActiveRecord::Base
  scope :last_hashtags, ->( uid ) { where( [ "uid = ?", uid.to_s ] ).order('created_at DESC').limit(1)  }
end
