import { useEffect, useRef, useState } from "react";
import OpenAI from "openai";

// import create from './chat/create';
import assisstantretrieve from "./ai/assisstantretrieve.js";

const openai = new OpenAI({
  apiKey: "sk-proj-wyQ78iR7VQf9R2woJveuT3BlbkFJVvSxiC233zgagLGgskrc",
  dangerouslyAllowBrowser: true,
});

function Chat() {
  const threadId = useRef(null);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);
  const [fetching, setFetching] = useState(false);

  const chatDiv = useRef(null);
  const inputDiv = useRef(null);

  const breed = "short hair"
  const age = "10"
  const behaviour = "lazy"

  useEffect(() => {
    // Btw, don't fucking delete this function; useEffect is a bitch and won't allow asyncronous functions as paramters but fine as long as it is a async function inside of the function
    const createThread = async () => {
      // Handle user per thread logic here
      // This is to create a new thread every time the page is load; assumes that the user is a new user
      await assisstantretrieve();
      threadId.current = await openai.beta.threads.create().then((d) => d.id);
    };
    createThread();
  }, []);

  useEffect(() => {
    if (chatDiv.current === null) {
      return;
    }

    chatDiv.current.scrollTop = chatDiv.current.scrollHeight;
  }, [messages])

  const sendMessageHandler = async (e) => {
    e.preventDefault();

    // Handling if threadId is not yet retrived
    if (threadId.current == null) {
      return;
    }

    // Handling if user didn't send anything
    if (message.trim() === "") {
      return;
    }

    setFetching(true);

    const messageThread = await openai.beta.threads.messages.create(
      threadId.current,
      {
        role: "user",
        content: `${message}`,
      }
    );

    const runId = await openai.beta.threads.runs
      .create(threadId.current, {
        assistant_id: "asst_dswZtS0kAmNrBn2au3RCJEF2",
        instructions: `This follow information is information regarding the user's pet \n\n\nBreed: ${breed}, Age: ${age}, Behaviour: ${behaviour}`
      })
      .then((d) => d.id);

    const checkRunStatus = async () => {
      let runStatus = await openai.beta.threads.runs.retrieve(
        threadId.current,
        runId
      );
      while (runStatus.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
        runStatus = await openai.beta.threads.runs.retrieve(
          threadId.current,
          runId
        );
        console.log(await openai.beta.threads.messages.list(
          threadId.current
        ));
      }
      // console.log(runStatus);
    };

    await checkRunStatus();

    const completion = await openai.beta.threads.messages.list(
      threadId.current
    );

    setFetching(false);
    setMessage("");
    setMessages(completion.body.data.reverse());
  };

  // const DUMMY_OPENAI_RESPONSE = [
  //   {
  //     role: "assistant",
  //     content: [
  //       {
  //         type: "text",
  //         value: "I am a submissive

  return (
    <div className="bg-neutral-900 h-screen px-16 mt-0 pb-32 relative">
      <div ref={chatDiv} className="flex flex-col gap-6 pt-8 overflow-scroll" style={{ height: "90vh" }}>
        {messages.map((msg) => {
          console.log(msg.role);
          return (
            <div className="text-white">
              <p className="font-bold text-xl">{msg.role === "assistant" ? "Assistant" : "User"}</p>
              <p className="font-medium mt-1">{msg.content[0].text.value}</p>
            </div>
          );
        })}
      </div>
      <div ref={inputDiv} className="fixed bottom-0 right-0 w-full px-16" style={{ backdropFilter: "blur(8px)" }}>
        <form onSubmit={sendMessageHandler} className="py-4 flex gap-4">
          <input
            type="text"
            name="question"
            placeholder="Enter question here..."
            disabled={fetching}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-neutral-900 ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-md flex w-full resize-none bg-transparent px-3 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 text-sky-400 border-b-2 border-gray-300"
          />
          <button
            value="Send"
            disabled={fetching}
            className="block bg-primary text-secondary rounded p-1 bg-gray-300 w-10 h-10"
          >
            ⋏
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
