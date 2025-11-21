import { Link } from "react-router-dom";
import MoodSelector from "../components/mood/MoodSelector";
import Navigation from "../components/layout/Navigation";

const MoodPage = () => {
  return (
    <>
      <Navigation />
      <MoodSelector />

      {/* TMDB Test Button - Floating Bottom Right */}
      <Link
        to="/test-tmdb"
        className="fixed bottom-8 right-8 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-6 py-3 rounded-full shadow-2xl hover:scale-110 transition-all z-50 flex items-center gap-2"
      >
        🧪 Test TMDB
      </Link>
    </>
  );
};

export default MoodPage;
