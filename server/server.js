const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv").config();

app.use(express.json());
app.use(cors());
app.listen(9000, () => {
    console.log(`Server started on port ${9000}`);
})

// Used to provide an example to the AI model
const exampleArticle = "NASA has announced a groundbreaking initiative to establish a nuclear fission power plant on the Moon by 2035, aiming to support long-term human missions and potential lunar colonization. The project, developed in collaboration with the Department of Energy and private industry, will provide a consistent energy source for astronauts, reducing reliance on solar power in the harsh lunar environment. Engineers plan to design a compact yet powerful reactor capable of operating in extreme temperatures and extended lunar nights.The system will be tested on Earth before deployment, ensuring safety and efficiency. Officials say this innovation could pave the way for Mars missions and further deep - space exploration.If successful, it may also accelerate nuclear advancements for sustainable energy on Earth.The first prototype is expected to launch for testing within the next decade."

// Used as a test article while the NewsAPI is being developed
const exampleArticle2 = "Spain Stuns Brazil in Thrilling 3-2 Victory — In a shocking upset, Spain defeated Brazil 3-2 in a high-intensity international friendly, showcasing their rising dominance in world football. The match, held in Madrid, saw Spain take an early lead with a stunning goal from Pedri in the 12th minute. Brazil responded quickly, with Vinícius Júnior equalizing before halftime. The second half was a fierce battle, with Álvaro Morata putting Spain ahead again in the 65th minute. Brazil fought back as Rodrygo netted another equalizer in the 78th, setting the stage for a dramatic finish. In the final moments, young sensation Lamine Yamal delivered the winning goal, sending the home crowd into a frenzy. Spain’s victory cements their status as serious contenders for upcoming international tournaments, while Brazil faces questions about their defense ahead of Copa América."

// Fetches OpenAI response
const fetchOpenAIResponse = async () => {
    const apiKey = process.env.OPENAI_API_KEY;
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
                    "content": `You are a quiz generator. Given the contents of an article from the user, generate a 5-10 question quiz, with 4 answers per question in json format. Example output with only 1 question: {'questions': [{'question': 'What was the article about?','answer1': 'Politics','answer2': 'Science','answer3': 'Sports','answer4': 'None of the above','correct': 'answer2'}]} with example article: ${exampleArticle}`
                },
                {
                    "role": "user",
                    "content": exampleArticle2
                }
            ],
            temperature: 0.7
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

// Returns a JSON containing the questions for the quiz
// ID parameter can be passed in (later in development) to get the contents of the article being read to give to the AI model
app.get("/quiz", async (req, res) => {
    const response = await fetchOpenAIResponse();
    res.send(response);
})