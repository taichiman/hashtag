class CreateHashtags < ActiveRecord::Migration
  def change
    create_table :hashtags do |t|
      t.text :hashtags

      t.timestamps
    end
  end
end
