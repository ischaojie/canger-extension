import App from "@pages/content/ui/app"
import { createRoot } from "react-dom/client"
import refreshOnUpdate from "virtual:reload-on-update-in-view"
import injectedStyle from "./injected.css?inline"

refreshOnUpdate("pages/content")

const root = document.createElement("div")
root.id = "canger-root"
document.body ? document.body.append(root) : document.documentElement.append(root)

const rootIntoShadow = document.createElement("div")
rootIntoShadow.id = "canger-input-container"

const transContainerEle = document.createElement("div")
transContainerEle.id = "canger-trans-container"

// 内容流容器
const contentflowContainerEle = document.createElement("div")
contentflowContainerEle.id = "canger-contentflow-container"

// create shadow root
const shadowRoot = root.attachShadow({ mode: "open" })
shadowRoot.appendChild(rootIntoShadow)
shadowRoot.appendChild(transContainerEle)
shadowRoot.appendChild(contentflowContainerEle)

// append style
const styleElement = document.createElement("style")
styleElement.innerHTML = injectedStyle
shadowRoot.appendChild(styleElement)

/**
 * https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/pull/174
 *
 * In the firefox environment, the adoptedStyleSheets bug may prevent contentStyle from being applied properly.
 * Please refer to the PR link above and go back to the contentStyle.css implementation, or raise a PR if you have a better way to improve it.
 */

createRoot(root).render(<App />)

// Toggle the color mode
const colorSchema = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
chrome.runtime.sendMessage({ type: "colormode", message: colorSchema })
