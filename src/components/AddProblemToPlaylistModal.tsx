import { useEffect, useState } from "react";
import { getProblems, addProblemToPlaylist } from "../services/api";

export default function AddProblemToPlaylistModal({
  playlistId,
  onClose,
}: any) {
  const [problems, setProblems] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    getProblems().then((res) =>
      setProblems(res.data.problems || [])
    );
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleAdd = async () => {
    if (selected.length === 0) return;

    await addProblemToPlaylist(playlistId, selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50">

      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-[500px] p-6">

        <h2 className="text-xl mb-4">Add Problems</h2>

        <div className="max-h-80 overflow-y-auto space-y-2">
          {problems.map((p) => (
            <div
              key={p.id}
              onClick={() => toggle(p.id)}
              className={`p-3 rounded-xl cursor-pointer border ${
                selected.includes(p.id)
                  ? "border-[#f97316] bg-[#f97316]/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {p.title}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={onClose}
            className="text-white/50"
          >
            Cancel
          </button>

          <button
            onClick={handleAdd}
            className="bg-[#f97316] px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}