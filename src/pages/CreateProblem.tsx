import { useState } from "react";
import { createProblem } from "../services/api";

export default function CreateProblemPage() {
  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    difficulty: "Easy",
    tags: "",
    constraints: "",
    examples: [{ input: "", output: "", explanation: "" }],
    testcases: [{ input: "", output: "" }],
    codeSnippets: {
      javascript: "",
      python: "",
      cpp: "",
    },
    referenceSolutions: {
      javascript: "",
      python: "",
      cpp: "",
    },
  });

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleArrayChange = (
    field: string,
    index: number,
    key: string,
    value: string
  ) => {
    const updated = [...form[field]];
    updated[index][key] = value;
    setForm({ ...form, [field]: updated });
  };

  const addItem = (field: string, emptyObj: any) => {
    setForm({ ...form, [field]: [...form[field], emptyObj] });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t: string) => t.trim()),
      };

      const res = await createProblem(payload);
      alert("✅ Problem Created");
      console.log(res.data);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || "Error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 pt-28">

      <h1 className="text-3xl font-bold mb-6">Create Problem</h1>

      {/* BASIC INFO */}
      <div className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/10">
        <input
          placeholder="Title"
          className="w-full p-3 bg-black/50 rounded"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full p-3 bg-black/50 rounded h-32"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <input
          placeholder="Tags (comma separated)"
          className="w-full p-3 bg-black/50 rounded"
          value={form.tags}
          onChange={(e) => handleChange("tags", e.target.value)}
        />

        <select
          className="p-3 bg-black/50 rounded"
          value={form.difficulty}
          onChange={(e) => handleChange("difficulty", e.target.value)}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <textarea
          placeholder="Constraints"
          className="w-full p-3 bg-black/50 rounded"
          value={form.constraints}
          onChange={(e) => handleChange("constraints", e.target.value)}
        />
      </div>

      {/* EXAMPLES */}
      <Section title="Examples">
        {form.examples.map((ex: any, i: number) => (
          <div key={i} className="space-y-2">
            <textarea
              placeholder="Input"
              value={ex.input}
              onChange={(e) =>
                handleArrayChange("examples", i, "input", e.target.value)
              }
              className="w-full p-2 bg-black/50 rounded"
            />
            <textarea
              placeholder="Output"
              value={ex.output}
              onChange={(e) =>
                handleArrayChange("examples", i, "output", e.target.value)
              }
              className="w-full p-2 bg-black/50 rounded"
            />
            <input
              placeholder="Explanation"
              value={ex.explanation}
              onChange={(e) =>
                handleArrayChange("examples", i, "explanation", e.target.value)
              }
              className="w-full p-2 bg-black/50 rounded"
            />
          </div>
        ))}
        <button
          onClick={() =>
            addItem("examples", { input: "", output: "", explanation: "" })
          }
          className="text-orange-400"
        >
          + Add Example
        </button>
      </Section>

      {/* TESTCASES */}
      <Section title="Testcases">
        {form.testcases.map((tc: any, i: number) => (
          <div key={i} className="space-y-2">
            <textarea
              placeholder="Input"
              value={tc.input}
              onChange={(e) =>
                handleArrayChange("testcases", i, "input", e.target.value)
              }
              className="w-full p-2 bg-black/50 rounded"
            />
            <textarea
              placeholder="Output"
              value={tc.output}
              onChange={(e) =>
                handleArrayChange("testcases", i, "output", e.target.value)
              }
              className="w-full p-2 bg-black/50 rounded"
            />
          </div>
        ))}
        <button
          onClick={() => addItem("testcases", { input: "", output: "" })}
          className="text-orange-400"
        >
          + Add Testcase
        </button>
      </Section>

      {/* CODE SNIPPETS */}
      <Section title="Starter Code">
        {["javascript", "python", "cpp"].map((lang) => (
          <textarea
            key={lang}
            placeholder={`${lang} starter code`}
            className="w-full p-3 bg-black/50 rounded mb-2"
            value={form.codeSnippets[lang]}
            onChange={(e) =>
              setForm({
                ...form,
                codeSnippets: {
                  ...form.codeSnippets,
                  [lang]: e.target.value,
                },
              })
            }
          />
        ))}
      </Section>

      
      <Section title="Reference Solutions">
        {["javascript", "python", "cpp"].map((lang) => (
          <textarea
            key={lang}
            placeholder={`${lang} solution`}
            className="w-full p-3 bg-black/50 rounded mb-2"
            value={form.referenceSolutions[lang]}
            onChange={(e) =>
              setForm({
                ...form,
                referenceSolutions: {
                  ...form.referenceSolutions,
                  [lang]: e.target.value,
                },
              })
            }
          />
        ))}
      </Section>
 
      <button
        onClick={handleSubmit}
        className="mt-6 bg-orange-500 px-6 py-3 rounded-xl"
      >
        Create Problem
      </button>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="mt-6 bg-white/5 p-6 rounded-xl border border-white/10">
      <h2 className="text-xl mb-4">{title}</h2>
      {children}
    </div>
  );
}