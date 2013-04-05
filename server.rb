require 'sinatra'
require 'sinatra/json'
require 'multi_json'

set :static => true
set :public_folder, File.expand_path(File.dirname(__FILE__) + '/public')

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

ALLWORDS = File.new("TWL_2006_ALPHA.txt").to_a.map{|word| word.chomp}


def get_resultwords(maxwordlength)
  seed_words = ALLWORDS.select{|word| word.length == maxwordlength}
  seed_word = seed_words.sample(1).first
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
  max_word = 6
  available_letters,  resultwords = get_resultwords(max_word)
  available_letters = available_letters.shuffle
  resultwords = resultwords.sort_by{|x| [x.length, x]}
  json :result_words => resultwords, :availableletters => available_letters
end

