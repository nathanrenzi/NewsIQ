const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv").config();
const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");
const axios = require("axios");
const sanitizeHtml = require("sanitize-html")

app.use(express.json());
app.use(cors());
app.listen(9001, () => {
    console.log(`Server started on port ${9001}`);
})
console.log("Server is starting...");

// Used to provide an example to the AI model
const exampleArticle = "NASA has announced a groundbreaking initiative to establish a nuclear fission power plant on the Moon by 2035, aiming to support long-term human missions and potential lunar colonization. The project, developed in collaboration with the Department of Energy and private industry, will provide a consistent energy source for astronauts, reducing reliance on solar power in the harsh lunar environment. Engineers plan to design a compact yet powerful reactor capable of operating in extreme temperatures and extended lunar nights.The system will be tested on Earth before deployment, ensuring safety and efficiency. Officials say this innovation could pave the way for Mars missions and further deep - space exploration.If successful, it may also accelerate nuclear advancements for sustainable energy on Earth.The first prototype is expected to launch for testing within the next decade."

// Fetches OpenAI response
const fetchOpenAIResponse = async (url) => {
    const apiKey = process.env.OPENAI_API_KEY;
    const content = await getArticleContent(url);
    if (!content) {
        return {error: "Article content is null."}
    }
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    "role": "developer",
                    "content": `You are a quiz generator. Given the contents of an article from the user, generate a 3-10 question quiz depending on the length of the input article, with 4 answers per question in json format. Example output with only 1 question: {"questions": [{"question": "What was the article about?","answer1": "Politics","answer2": "Science","answer3": "Sports","answer4": "None of the above","correct": "answer2"}]} with example article: "${exampleArticle}". Do not wrap your output in any characters other than the braces used for JSON. The output must be a usable json string.`
                },
                {
                    "role": "user",
                    "content": content
                }
            ],
            temperature: 0.7
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

app.get("/quiz/:url", async (req, res) => {
    const response = await fetchOpenAIResponse(req.params.url);
    res.send(response);
})

async function getArticleContent(url) {
    try {
        const articleResponse = await axios.get(url);
        const html = articleResponse.data;

        const dom = new JSDOM(html, { url });
        const articleReadability = new Readability(dom.window.document).parse();

        return articleReadability?.textContent ?? "";
    }
    catch (error) {
        console.log("Error parsing article: " + error);
        return "Error parsing article.";
    }
}

async function getArticleContentHtml(url) {
    try {
        const articleResponse = await axios.get(url);
        const data = articleResponse.data;

        const dom = new JSDOM(data, { url });
        const articleReadability = new Readability(dom.window.document).parse();

        const html = articleReadability.content;
        const sanitizedHtml = sanitizeHtml(html, {
            allowedTags: ["h1", "h2", "p"],
            allowedAttributes: {
            },
            allowedSchemes: ["http", "https", "data"],
            disallowedTagsMode: "discard"
        });
        return sanitizedHtml;
    }
    catch (error) {
        console.log("Error parsing article.");
        return "Error parsing article.";
    }
}

// Documentation for NewsAPI
// https://newsapi.org/docs

app.get('/fetchNewsApiKey', (req, res) => {
    res.json({ apiKey: process.env.NEWS_API_KEY });
  });
  

// Function to categorize article content
const categorizeArticle = async (content) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!content) {
        return "Uncategorized";
    }
    
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        "role": "system",
                        "content": "You are a content categorizer. Given the content of an article, categorize it into one of these broad categories: Politics, Technology, Science, Business, Entertainment, Sports, Health, or Other. Respond with ONLY the category name, nothing else."
                    },
                    {
                        "role": "user",
                        "content": content
                    }
                ],
                temperature: 0.3
            })
        });

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error categorizing article:", error);
        return "Uncategorized";
    }
}

const fetchArticle = async (title) => {
    const apiKey = process.env.NEWS_API_KEY;
    var url = "https://newsapi.org/v2/everything?" +
        `q=${encodeURIComponent(title)}&` +
        "sortBy=relevancy&pageSize=1&language=en&" +
        `apiKey=${apiKey}`
    const article = await fetch(new Request(url))
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            return data.articles[0];
        })
        .catch((error) => {
            if (error.status == 401) {
                console.log("NewsAPI authorization key is needed to access NewsAPI.");
                return null;
            }
        });
    if (!article) return null;
    const html = await getArticleContentHtml(article.url);
    const content = await getArticleContent(article.url);
    const category = await categorizeArticle(content);
    return {
        title: article.title,
        description: article.description,
        authors: article.source.name,
        url: article.url,
        urlToImage: article.urlToImage,
        html: html,
        category: category
    };
}

app.get("/article/:title", async (req, res) => {
    const article = await fetchArticle(req.params.title);
    if (article) {
        res.json(article);
    }
    else {
        res.status(404).send("No article found.");
    }
}) 