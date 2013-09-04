class Hashtag < ActiveRecord::Base
  scope :last_hashtags, ->( uid ) { where( [ "uid = ?", uid ] ).last }
end
