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

def get_resultwords
 all_words = File.new("TWL_2006_ALPHA.txt").map{|word| word.chomp}
end


get "/" do
erb :index
end

get "/data" do
  json :words => WORDS, :availableletters => %w(f a s t e r)
end

