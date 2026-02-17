import { inngest } from "./client";
import { createAgent, openai, anthropic } from '@inngest/agent-kit';

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // Run agents inside the Inngest function handler
    const codeAgent = createAgent({
      name: 'code-agent',
      system: 'You are an expert next.js developer. You write readale, maintainable code. You write simple Next.js & React snippets',
      model: openai({ model: 'gpt-4o-mini' }),
    });
    const { output } = await codeAgent.run(
      `Write the following snippet: ${event.data.value}`,
    );

    console.log(output)
    
    return {output};
  },
);