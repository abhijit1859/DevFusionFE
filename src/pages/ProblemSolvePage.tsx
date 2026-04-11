import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProblemById, executeCode } from "../services/api";
import CodeEditor from "../components/CodeEditor";

export default function ProblemSolvePage() {
  const { id } = useParams();

  const [problem, setProblem] = useState<any>(null);
  const [code, setCode] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");

  const languageMap: any = {
    javascript: 63,
    python: 71,
    cpp: 54,
  };

  const safeParse = (data: any) => {
    try {
      if (!data) return [];
      if (typeof data === "string") return JSON.parse(data);
      if (Array.isArray(data)) return data;
      return [data];
    } catch {
      return [];
    }
  };

  // 🔥 ADD THIS (STATS)
  const getStats = () => {
    try {
      if (!results) return { time: "-", memory: "-" };

      const times = JSON.parse(results.time || "[]").map((t: string) =>
        parseFloat(t)
      );

      const memory = JSON.parse(results.memory || "[]").map((m: string) =>
        parseInt(m)
      );

      return {
        time: times.length ? Math.min(...times).toFixed(3) + " s" : "-",
        memory: memory.length ? Math.max(...memory) + " KB" : "-",
      };
    } catch {
      return { time: "-", memory: "-" };
    }
  };

  const stats = getStats();

  useEffect(() => {
    if (!id) return;

    getProblemById(id)
      .then((res) => {
        const prob = res.data.problem;
        setProblem(prob);

        if (prob?.codeSnippets?.[language]) {
          setCode(prob.codeSnippets[language]);
        } else if (prob?.referenceSolutions?.[language]) {
          setCode(prob.referenceSolutions[language]);
        } else {
          setCode("// Write your code here");
        }
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!problem) return;

    if (problem?.codeSnippets?.[language]) {
      setCode(problem.codeSnippets[language]);
    } else if (problem?.referenceSolutions?.[language]) {
      setCode(problem.referenceSolutions[language]);
    }
  }, [language]);

  const runCode = async () => {
    try {
      const testcases = safeParse(problem?.testcases);

      if (!testcases.length) {
        alert("No testcases found");
        return;
      }

      setLoading(true);
      setResults(null);

      const res = await executeCode({
        source_code: code,
        language_id: languageMap[language],
        stdin: testcases.map((t: any) => t.input),
        expected_outputs: testcases.map((t: any) => t.output),
        problemId: id,
      });

      setResults(res.data.submission);
    } catch (err) {
      console.error(err);
      alert("Run failed");
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async () => {
    try {
      const testcases = safeParse(problem?.testcases);

      if (!testcases.length) {
        alert("No testcases found");
        return;
      }

      setLoading(true);
      setResults(null);

      const res = await executeCode({
        source_code: code,
        language_id: languageMap[language],
        stdin: testcases.map((t: any) => t.input),
        expected_outputs: testcases.map((t: any) => t.output),
        problemId: id,
      });

      const submission = res.data.submission;
      setResults(submission);

      if (submission.status === "Accepted") {
        alert("✅ Accepted");
      } else {
        alert("❌ Wrong Answer");
      }

    } catch (err) {
      console.error(err);
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (!problem) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        Loading problem...
      </div>
    );
  }

  const examples = safeParse(problem.examples);

  const difficultyColor =
    problem.difficulty === "Easy"
      ? "text-green-400"
      : problem.difficulty === "Medium"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white pt-20">

      {/* LEFT PANEL */}
      <div className="w-1/2 border-r border-white/10 flex flex-col">

        <div className="p-6 border-b border-white/10 bg-white/5">
          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <span className={difficultyColor}>{problem.difficulty}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 text-white/70">
          <p>{problem.description}</p>

          <h3 className="mt-6 text-white font-semibold">Examples</h3>

          {examples.map((ex: any, i: number) => (
            <div key={i} className="bg-white/5 p-4 mt-3 rounded-xl">
              <p><b>Input:</b> {ex.input}</p>
              <p><b>Output:</b> {ex.output}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-1/2 flex flex-col">

        <div className="flex justify-between items-center px-4 py-3 border-b border-white/10 bg-white/5">

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-black/50 border border-white/10 px-3 py-1 rounded-xl"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>

          <div className="flex gap-3">
            <button
              onClick={runCode}
              className="bg-white/10 px-5 py-2 rounded-xl hover:bg-white/20"
            >
              {loading ? "Running..." : "Run"}
            </button>

            <button
              onClick={submitCode}
              className="bg-[#f97316] px-5 py-2 rounded-xl text-white"
            >
              Submit
            </button>
          </div>
        </div>

        {/* EDITOR */}
        <div className="h-[60%]">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
          />
        </div>

        {/* RESULTS */}
        <div className="flex-1 overflow-y-auto p-4 border-t border-white/10">

          {results?.status && (
            <div
              className={`p-3 mb-3 rounded-xl font-semibold ${
                results.status === "Accepted"
                  ? "bg-green-900/30 text-green-400"
                  : "bg-red-900/30 text-red-400"
              }`}
            >
              {results.status}
            </div>
          )}

          {!results && (
            <p className="text-gray-400">
              Run or submit your code to see results
            </p>
          )}

          {results?.testResults?.map((r: any, i: number) => (
            <div
              key={i}
              className={`p-3 my-2 rounded-xl border ${
                r.passed
                  ? "bg-green-900/20 border-green-500/30"
                  : "bg-red-900/20 border-red-500/30"
              }`}
            >
              <p>Test {i + 1}: {r.status}</p>
              <p>Output: {r.stdout}</p>
              <p>Expected: {r.expected}</p>

              {/* 🔥 ONLY ADDITION */}
              {results?.time && results?.memory && (
  <div className="text-xs text-white/60 mt-1 flex gap-4">
    <span>
      ⏱ {JSON.parse(results.time || "[]")[i] || "-"}
    </span>
    <span>
      💾 {JSON.parse(results.memory || "[]")[i] || "-"}
    </span>
  </div>
)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}