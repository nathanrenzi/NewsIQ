# NewsIQ

To read an article and take a quiz on it, navigate to 'http://localhost:3000/article/' + your search term separated by dashes (like-this). This will not be possible in the final build, it is for testing only until we develop the article homepage / search. At the bottom of the page you can take a quiz on the article that you read.

## Setup

- Go into both client and server directories and run 'npm install'
- Create a file named '.env' in the server directory
- Add this to the .env file: OPENAI_API_KEY=(put api key here, with no parentheses)
- Add this to the .env file: NEWS_API_KEY=(put api key here, with no parentheses)
- Run client with 'npm start' while in client directory, and run server with 'npm run dev' (custom script that uses nodemon to auto-restart when changes are made) while in server directory
