CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS movies (
  movie_id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_preferences (
  preference_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  genre_score JSONB,
  protagonist_score JSONB,
  director_score JSONB,
  UNIQUE(user_id)
);
