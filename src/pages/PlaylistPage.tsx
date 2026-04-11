import { useEffect, useState } from "react";
import {
  getAllPlaylists,
  deletePlaylist,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import AddProblemToPlaylistModal from "../components/AddProblemToPlaylistModal";
import CreatePlaylistModal from "../components/CreatePlaylistModal";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);

  const navigate = useNavigate();

  const fetchPlaylists = async () => {
    try {
      const res = await getAllPlaylists();
      setPlaylists(res.data.playlists || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Delete this playlist?");
    if (!confirmDelete) return;

    await deletePlaylist(id);
    fetchPlaylists();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 pt-32">

   
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-machina-bold">Playlists</h1>

        <button
          onClick={() => setOpenCreate(true)}
          className="bg-[#f97316] px-5 py-2 rounded-xl 
          shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:bg-orange-500"
        >
          + Create Playlist
        </button>
      </div>

    
      {playlists.length === 0 ? (
        <div className="text-center text-white/40 mt-20">
          No playlists yet 📁
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {playlists.map((p) => (
            <div
              key={p.id}
              className="relative bg-white/5 border border-white/10 rounded-2xl p-5 
              hover:shadow-[0_0_25px_rgba(249,115,22,0.25)] transition group"
            >

          
              <button
                onClick={() => handleDelete(p.id)}
                className="absolute top-3 right-3 text-red-400 opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>

              <div
                onClick={() => navigate(`/playlist/${p.id}`)}
                className="cursor-pointer"
              >
                <h2 className="text-lg font-semibold group-hover:text-[#f97316]">
                  {p.name}
                </h2>

                <p className="text-white/50 text-sm mt-1 line-clamp-2">
                  {p.description}
                </p>

                <p className="text-white/40 text-xs mt-2">
                  {p.problems.length} problems
                </p>
              </div>

           
              <button
                onClick={() => setOpenModal(p.id)}
                className="mt-4 w-full bg-[#f97316]/10 border border-[#f97316]/30 px-3 py-2 rounded-xl text-[#f97316]"
              >
                + Add Problems
              </button>
            </div>
          ))}
        </div>
      )}

   
      {openModal && (
        <AddProblemToPlaylistModal
          playlistId={openModal}
          onClose={() => setOpenModal(null)}
        />
      )}

      {openCreate && (
        <CreatePlaylistModal
          onClose={() => setOpenCreate(false)}
          onSuccess={fetchPlaylists}
        />
      )}
    </div>
  );
}