require 'sinatra'
require 'sinatra/json'
require 'multi_json'

set :static => true
set :public_folder, File.expand_path(File.dirname(__FILE__) + '/public')

WORDS = 
%w(
fat
man
net 
rig
fast 
high
faster 
higher 
magnet 
)

get "/" do
erb :index
end

get "/data" do
  json :words => WORDS, :availableletters => %w(f a s t e r)
end

