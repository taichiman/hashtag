class DashController < ApplicationController
  def index
    r = JSON.parse(params[ :api_result ])
    @first_name = r['response'][0]['first_name']
    @last_name = r['response'][0]['last_name']
  end
end
