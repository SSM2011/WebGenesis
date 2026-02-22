import { inngest } from "./client";
import { createAgent, openai, anthropic, createTool, createNetwork, Agent, type Tool, type Message, createState } from '@inngest/agent-kit';
import { Sandbox } from "@e2b/code-interpreter"
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import z from "zod";
import { stderr } from "process";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompt";
import prisma from "@/lib/prisma";
import { Assistant } from "next/font/google";


interface AgentState {
  summary: string;
  files: { [path: string]: string };
};



export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {

    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("dynocoder1/vibe-nextjs-test-2")
      return sandbox.sandboxId
    });

    const previousMessages = await step.run("get-previous-messages", async () => {
      const formatedMessages: Message[] = [];

      const messages = await prisma.message.findMany({
        where: {
          projectId: event.data.projectId
        },
        orderBy: {
          createdAt: "desc", //TODO: change to "asc" if AI does not understand the latest message
        }
      });

      for (const message of messages) {
        formatedMessages.push({
          type: "text",
          role: message.role === "ASSISTANT" ? "assistant" : "user",
          content: `1 message: ${message.content}`,
        })
      }

      return formatedMessages;
    });

    const state = createState<AgentState>({
      summary: "",
      files: {},
    },
      {
        messages: previousMessages,
      },
    );

    // Run agents inside the Inngest function handler
    const codeAgent = createAgent<AgentState>({
      name: 'code-agent',
      description: "An expert coding agent",
      system: PROMPT,
      model: openai({
        model: 'gpt-4.1',
        defaultParameters: {
          temperature: 0.1,
        }
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  }
                });
                return result.stdout
              } catch (error) {
                console.error(
                  `Command failed: ${error} \nstdout: ${buffers.stdout}\nstderror: ${buffers.stderr}`,
                );
                return `Command failed: ${error} \nstdout: ${buffers.stdout}\nstderror: ${buffers.stderr}`;
              }
            })
          },
        }),
        createTool({
          name: "createorUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              }),
            ),
          }),
          handler: async (
            { files },
            { step, network }: Tool.Options<AgentState>
          ) => {
            const newFiles = await step?.run("createorUpdateFiles", async () => {
              try {
                const updateFiles = network.state.data.files || {};
                const sandbox = await getSandbox(sandboxId);
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updateFiles[file.path] = file.content;
                }

                return updateFiles
              } catch (error) {
                return "Error: " + error;
              }
            })

            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          }
        }),
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId)
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }

                return JSON.stringify(contents)
              } catch (error) {
                return "Error" + error;
              }
            })
          }
        })
      ],

      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);
          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText
            }
          }
          return result
        }
      }
    });

    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary

        if (summary) {
          return;
        }

        return codeAgent;
      }
    })

    const result = await network.run(event.data.value, { state: state })

    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "A fragment title generator",
      system: FRAGMENT_TITLE_PROMPT,
      model: openai({
        model: "gpt-4o",
      }),
    });


    const responseGenerator = createAgent({
      name: "response-generator",
      description: "A response generator",
      system: RESPONSE_PROMPT,
      model: openai({
        model: "gpt-4o",
      }),
    });

    const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(result.state.data.summary)
    const { output: responseOutput } = await responseGenerator.run(result.state.data.summary)

    const generateFragmentTitle = () => {

      const output = fragmentTitleOutput[0];
      if (output.type !== "text") {
        return "Fragment"
      }

      if (Array.isArray(output.content)) {
        return output.content.map((txt) => txt).join("")
      } else {
        return output.content
      }
    }

    const generateResponse = () => {

      const output = responseOutput[0]

      if (output.type !== "text") {
        return "Here you go"
      }

      if (Array.isArray(output.content)) {
        return output.content.map((txt) => txt).join("")
      } else {
        return output.content
      }
    }


    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`
    });

    await step.run("save-result", async () => {

      if (isError) {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Something went wrong. Please try again",
            role: "ASSISTANT",
            type: "ERROR"
          }
        })
      }

      return prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: generateResponse(),
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: generateFragmentTitle(),
              files: result.state.data.files,
            },
          }
        }
      })
    })

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary
    };
  },
);