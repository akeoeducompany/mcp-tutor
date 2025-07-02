import { CodeEditor } from "@/components/ui/code-editor";

export default function DemoOne() {
  const theme = "dark"; // simple toggle; replace with real context/theme later
  return (
    <div className={`p-6 min-h-screen flex flex-col ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
      <div className="flex-1 flex">
        <CodeEditor />
      </div>
    </div>
  );
} 