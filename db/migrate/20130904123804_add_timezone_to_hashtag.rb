class AddTimezoneToHashtag < ActiveRecord::Migration
  def change
    add_column :hashtags, :timezone, :integer
  end
end
