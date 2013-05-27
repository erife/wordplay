#The environment variable DATABASE_URL should be in the following format:
# => postgres://{user}:{password}@{host}:{port}/path
configure :production, :development do
  db = URI.parse(ENV['DATABASE_URL'] || 'postgres://localhost/development')
 
  ActiveRecord::Base.establish_connection(
                                          :adapter => db.scheme == 'postgres' ? 'postgresql' : db.scheme,
                                          :host => db.host,
                                           :username => 'postgres',
                                          :password => '123abc',
                                          :database => 'development',
                                          :encoding => 'utf8'
                                          )
end
