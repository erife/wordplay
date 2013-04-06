require 'sinatra'
require 'sinatra/json'
require 'multi_json'

set :static => true
set :public_folder, File.expand_path(File.dirname(__FILE__) + '/public')

MAXWORDLENGTH = 6;
ALLWORDS = File.new("TWL_2006_ALPHA.txt").to_a.map{|word| word.chomp}
SEED_WORDS = ALLWORDS.select{|word| word.length == MAXWORDLENGTH}

def valid_subword(available_letters, word)
  letters = word.split("")
  my_available_letters = available_letters.dup
  return false if word.length > available_letters.size || word.length < 3
  letters.each do |letter|
    if idx = my_available_letters.index(letter)
      my_available_letters.delete_at(idx)
    else 
      return false
    end
  end
  return true
end

def get_resultwords()
  seed_word = SEED_WORDS.sample(1).first
  available_letters = seed_word.split("")
  subwords = ALLWORDS.select do |word|
    valid_subword(available_letters, word)
  end
  return [available_letters, subwords]
end

get "/" do
erb :index
end

get "/data" do
  resultwords = [];
  while resultwords.length < 20 do
    available_letters,  resultwords = get_resultwords()
  end
  available_letters = available_letters.shuffle
  resultwords = resultwords.sort_by{|x| [x.length, x]}
  json :result_words => resultwords, :availableletters => available_letters
end

