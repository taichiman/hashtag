class AddCountPostsToHashtag < ActiveRecord::Migration
  def change
    add_column :hashtags, :count_posts, :integer
  end
end
