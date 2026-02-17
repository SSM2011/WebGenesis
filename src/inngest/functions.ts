import { inngest } from "./client";
import { createAgent, openai, anthropic } from '@inngest/agent-kit';
import {Sandbox} from "@e2b/code-interpreter"
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {

    const sandboxId = await step.run("get-sandbox-id", async()=> {
      const sandbox = await Sandbox.create("dynocoder1/vibe-nextjs-test-2")
      return sandbox.sandboxId
    })

    // Run agents inside the Inngest function handler
    const codeAgent = createAgent({
      name: 'code-agent',
      system: 'You are an expert next.js developer. You write readale, maintainable code. You write simple Next.js & React snippets',
      model: openai({ model: 'gpt-4o-mini' }),
    });
    const { output } = await codeAgent.run(
      `Write the following snippet: ${event.data.value}`,
    );

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`
    })
   
    return {output, sandboxUrl};
  },
);