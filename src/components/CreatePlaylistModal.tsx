import { useState } from "react";
import { createPlaylist } from "../services/api";

export default function CreatePlaylistModal({ onClose, onSuccess }: any) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !description.trim()) {
      alert("Name and Description are required");
      return;
    }

    try {
      setLoading(true);

      await createPlaylist({
        name,
        description,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50">

      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-[420px] p-6">

        <h2 className="text-xl mb-5">Create Playlist</h2>

        <input
          placeholder="Playlist name"
          className="w-full mb-3 px-4 py-2 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#f97316]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full mb-4 px-4 py-2 bg-black/50 border border-white/10 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-[#f97316]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-white/50">
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="bg-[#f97316] px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)]"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}