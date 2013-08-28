require 'rubygems'
require 'sinatra'
require 'sinatra/activerecord'
require 'sinatra/json'
require 'multi_json'
require 'set'
require './config/environments'
require './models/highscore'

set :static => true
set :public_folder, File.expand_path(File.dirname(__FILE__) + '/public')

MAXWORDLENGTH = 6
MINSUBWORDCOUNT = 20
MAXSUBWORDCOUNT = 120
ALLWORDS = Set.new(File.new("TWL_2006_ALPHA.txt").to_a.map{|word| word.chomp})
SEED_WORDS = ALLWORDS.select{|word| word.length == MAXWORDLENGTH}
MAXHIGHSCOREINDEX = 9



def get_resultwords()
  seed_word = SEED_WORDS.sample(1).first
  available_letters = seed_word.split("")
  permutation_words = []
  (2..available_letters.length).each do |n|
    permutation_words += available_letters.permutation(n+1).to_a.map(&:join)
  end
  subwords = permutation_words.uniq.select do |word|
    ALLWORDS.include?(word)
  end
  return subwords
end

get "/" do
erb :index
end

get "/wordlist" do
  resultwords = []
  while resultwords.length <= MINSUBWORDCOUNT || resultwords.length >= MAXSUBWORDCOUNT do
     resultwords = get_resultwords()
  end
  resultwords = resultwords.sort_by{|x| [x.length, x]}
   json resultwords
end

post "/name" do
  puts params.inspect
  result = Highscore.create(:name => params["name"], :score =>params["score"])
  puts result.inspect
return nil
end

def gethighscores 
  Highscore.all(:order => "score DESC")
end

get "/validhighscore" do
  lowestscore = gethighscores[9]
  lowscore = (lowestscore && lowestscore.score) || 0
  valid = params["score"].to_i > lowscore
  json :valid => valid
end


#load high scores from file into array format
#sort array by high score
#return updated scores


get "/highscore" do
  scores = gethighscores
  puts "scores = #{scores}"
  highscore = scores[0..9].map do |data|
    {:name => data.name, :score => data.score} 
  end
  puts highscore
  json :high_score => highscore
end

# write new high scores to a file
# sort high scores
  
