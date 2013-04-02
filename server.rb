require 'sinatra'
require 'sinatra/json'
require 'multi_json'

set :static => true
set :public_folder, File.expand_path(File.dirname(__FILE__) + '/public')

# WORDS = 
# %w(
# fat
# man
# net 
# rig
# fast 
# high
# faster 
# higher 
# magnet 

# WORDS =
# %w(
#      after
#      are
#      art
#      arts
#      ate
#      ear
#      ears
#      east
#      eat
#      eats
#      far
#      fare
#      fares
#      farts
#      fast
#      faster
#      fat
#      fate
#      fates
#      fear
#      fears
#      feast
#      feat
#      fret
#      par
#      pare
#      pares
#      parse
#      part
#      parts
#      past
#      paste
#      pat
#      pats
#      pea
#      pear
#      pears
#      peas
#      pert
#      pest
#      pet
#      pets
#      raft
#      rafts
#      rap
#      rapt
#      rat
#      rate
#      rates
#      rats
#      ref
#      rep
#      rest
#      safe
#      safer
#      sap
#      sat
#      sea
#      sear
#      seat
#      set
#      spa
#      spar
#      spare
#      spat
#      spear
#      star
#      stare
#      step
#      strafe
#      strap
#      tap
#      tape
#      taper
#      tapers
#      tapes
#      tar
#      tarp
#      tarps
#      tea
#      tear
#      tears
#      trap
#      traps
# )

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

def get_resultwords(maxwordlength)
  all_words = File.new("TWL_2006_ALPHA.txt").to_a.map{|word| word.chomp}
  seed_words = all_words.select{|word| word.length == maxwordlength}
  seed_word = seed_words.sample(1).first
  available_letters = seed_word.split("")
  subwords = all_words.select do |word|
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
  resultwords = resultwords.sort.sort_by(&:length)
  json :result_words => resultwords, :availableletters => available_letters
end

