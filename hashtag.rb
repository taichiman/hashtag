  require 'webrick'

  server = WEBrick::HTTPServer.new :Port => 8000

  trap 'INT' do server.shutdown end

  server.mount_proc '/' do |req, res|
    res.body = 'Hello, world My!'
  end

  server.start
