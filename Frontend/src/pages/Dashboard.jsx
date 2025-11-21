import { Film } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-3xl">
            <Film className="w-16 h-16 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Dashboard - Coming Soon
        </h1>
        <p className="text-xl text-purple-200 max-w-md mx-auto">
          Get ready for an amazing movie discovery experience!
        </p>
        <div className="pt-4">
          <div className="inline-block bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-full px-6 py-3">
            <p className="text-purple-300 font-medium">
              Your FlickPick journey begins here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
