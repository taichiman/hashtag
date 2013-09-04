class AddCountPostsWithHashtagToHashtag < ActiveRecord::Migration
  def change
    add_column :hashtags, :count_posts_with_hashtag, :integer
  end
end
