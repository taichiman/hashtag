class AddUidToHashtag < ActiveRecord::Migration
  def change
    add_column :hashtags, :uid, :string
  end
end
