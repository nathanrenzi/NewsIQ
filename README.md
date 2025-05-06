## Setup

- Go into both client and server directories and run 'npm install'
- Create a file named '.env' in the server directory
- Add this to the .env file: OPENAI_API_KEY=(put api key here, with no parentheses)
- Add this to the .env file: NEWS_API_KEY=(put api key here, with no parentheses)
- Run client with 'npm start' while in client directory, and run server with 'npm run dev' while in server directory

## APIs Used

- [NewsAPI](https://newsapi.org/) - Used for news article searching
- [OpenAI](openai.com) - Used for quiz generation and article categorization
