"use client"
// CodeEditor component (demo - fully self-contained)
import { useState, useRef, useEffect } from "react"
import { Copy, Check, Play, Download, Settings, Terminal } from "lucide-react"

export default function DemoCodeEditor() {
  const [code, setCode] = useState(`// Interactive Fibonacci Calculator
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function fibonacciSequence(count) {
  const sequence = [];
  for (let i = 0; i < count; i++) {
    sequence.push(fibonacci(i));
  }
  return sequence;
}

// Generate first 10 numbers
const result = fibonacciSequence(10);
console.log('Fibonacci sequence:', result);
console.log('Sum:', result.reduce((a, b) => a + b, 0));`)

  const [copied, setCopied] = useState(false)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [fontSize, setFontSize] = useState(12)
  const [language, setLanguage] = useState("javascript")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const codeExamples = {
    javascript: `// Interactive Fibonacci Calculator
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log('Fibonacci(10):', result);`,
    python: `# Python Example
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

result = fibonacci(10)
print(f'Fibonacci(10): {result}')`,
    html: `<!DOCTYPE html>
<html>
<head>
    <title>Demo Page</title>
    <style>
        body { font-family: Arial; }
        .highlight { color: #8B5CF6; }
    </style>
</head>
<body>
    <h1 class="highlight">Hello World!</h1>
</body>
</html>`,
  } as const

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.fontSize = `${fontSize}px`
    }
  }, [fontSize])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const runCode = async () => {
    if (language !== "javascript") return
    setIsRunning(true)
    setOutput("Running...")

    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      const logs: string[] = []
      const originalLog = console.log
      console.log = (...args) => {
        logs.push(args.join(" "))
      }

      // ⚠️ eval is unsafe – demo only
      // eslint-disable-next-line no-eval
      eval(code)
      console.log = originalLog

      setOutput(logs.join("\n") || "Code executed successfully!")
    } catch (error) {
      setOutput(`Error: ${error}`)
    }

    setIsRunning(false)
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code.${language === "javascript" ? "js" : language}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const loadExample = (lang: keyof typeof codeExamples) => {
    setLanguage(lang)
    setCode(codeExamples[lang])
    setOutput("")
  }

  return (
    <div className={`rounded-lg p-4 h-full flex flex-col text-sm ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className={`font-semibold flex items-center space-x-2 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
          <Terminal size={16} />
          <span>Code Editor Pro</span>
        </h3>
        <div className="flex items-center space-x-1">
          <select
            value={language}
            onChange={(e) => loadExample(e.target.value as keyof typeof codeExamples)}
            className={`text-xs p-1 rounded border ${
              theme === "dark" ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
            }`}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="html">HTML</option>
          </select>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`p-1 rounded transition-colors ${
              theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-1">
          <button
            onClick={handleCopy}
            className={`p-1 rounded transition-colors ${
              theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          <button
            onClick={downloadCode}
            className={`p-1 rounded transition-colors ${
              theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Download size={14} />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <label className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Size:</label>
          <input
            type="range"
            min="10"
            max="16"
            value={fontSize}
            onChange={(e) => setFontSize(Number.parseInt(e.currentTarget.value))}
            className="w-12 accent-purple-500"
          />
        </div>
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ fontSize: `${fontSize}px` }}
        className={`flex-1 p-2 rounded font-mono text-xs resize-none focus:outline-none focus:ring-1 focus:ring-purple-500 ${
          theme === "dark"
            ? "bg-gray-800 text-green-400 border border-gray-700"
            : "bg-gray-50 text-gray-800 border border-gray-300"
        } flex-1`}
        spellCheck={false}
      />

      {/* Run & Output */}
      <div className="mt-1 flex space-x-2">
        <button
          onClick={runCode}
          disabled={isRunning || language !== "javascript"}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-xs transition-colors flex items-center space-x-1"
        >
          <Play size={12} />
          <span>{isRunning ? "Running..." : "Run"}</span>
        </button>
        <div
          className={`flex-1 p-1 rounded text-xs font-mono min-h-[2rem] overflow-auto ${
            theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
          }`}
        >
          {output || "Output will appear here..."}
        </div>
      </div>

      {language !== "javascript" && (
        <div className="mt-1 text-xs text-yellow-600">Note: Only JavaScript can be executed in this demo</div>
      )}
    </div>
  )
}

export const CodeEditor = () => <DemoCodeEditor /> 