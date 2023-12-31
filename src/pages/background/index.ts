import reloadOnUpdate from "virtual:reload-on-update-in-background-script"
import "webextension-polyfill"
import chatGPTApiStorage from "@root/src/shared/storages/exampleThemeStorage"

const BG_PREFIX = "[background]"
const CHATGPT_API = "https://api.openai.com/v1/chat/completions"

reloadOnUpdate("pages/background")

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss")

console.info(`${BG_PREFIX} loaded :)`)

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.info(`${BG_PREFIX} receive message: ${request}`)
  if (request.sentence != "") {
    askChatGPT(request.sentence, request.kind).then(res => {
      console.info(`${BG_PREFIX} ChatGPT result: ${res}`)
      sendResponse({ result: res })
    })
  }

  return true
})

type PromptKind = "translator" | "writer"

interface Prompt {
  kind: PromptKind
  prompt: string
}

const PROMPTS: Prompt[] = [
  {
    kind: "translator",
    prompt: `I want you to act as an English translator, spelling corrector and improver.
        I will speak to you in any language and you will detect the language,
        translate it and answer in the corrected and improved version of my text, in English.
        I want you to replace my simplified A0-level words and sentences with more beautiful and elegant,
        upper level English words and sentences. Keep the meaning same, but make them more literary.
        I want you to only reply the correction, the improvements and nothing else, do not write explanations. My first sentence is: `,
  },
  {
    kind: "writer",
    prompt: `hello`,
  },
]

// ask ChatGPT
const askChatGPT = async (sentence: string, kind: PromptKind) => {
  const response = await fetch(CHATGPT_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${chatGPTApiStorage.get()}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: PROMPTS.find(p => p.kind === kind)?.prompt + sentence }],
      temperature: 1,
    }),
  })
  const data = await response.json().catch(err => {
    console.error(err)
  })
  return data.choices[0].message.content
}
