require 'sinatra'
require 'sinatra/json'
require 'multi_json'
require 'set'

set :static => true
set :public_folder, File.expand_path(File.dirname(__FILE__) + '/public')

MAXWORDLENGTH = 6;
MINSUBWORDCOUNT = 20;
MAXSUBWORDCOUNT = 120;
ALLWORDS = Set.new(File.new("TWL_2006_ALPHA.txt").to_a.map{|word| word.chomp})
SEED_WORDS = ALLWORDS.select{|word| word.length == MAXWORDLENGTH}

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
  return [available_letters, subwords]
end

get "/" do
erb :index
end

get "/data" do
  resultwords = [];
  while resultwords.length <= MINSUBWORDCOUNT || resultwords.length >= MAXSUBWORDCOUNT do
    available_letters,  resultwords = get_resultwords()
  end
  available_letters = available_letters.shuffle
  resultwords = resultwords.sort_by{|x| [x.length, x]}
   json :result_words => resultwords, :availableletters => available_letters
end

