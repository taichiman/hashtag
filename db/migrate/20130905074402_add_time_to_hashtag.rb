class AddTimeToHashtag < ActiveRecord::Migration
  def change
    add_column :hashtags, :time, :integer
  end
end
