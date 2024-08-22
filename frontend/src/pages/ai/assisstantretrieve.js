import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: "sk-proj-wyQ78iR7VQf9R2woJveuT3BlbkFJVvSxiC233zgagLGgskrc",
    dangerouslyAllowBrowser: true
});

async function assistant_retrieve() {
    const myAssistant = await openai.beta.assistants.retrieve(
        "asst_dswZtS0kAmNrBn2au3RCJEF2"
    );
}

export default assistant_retrieve;  