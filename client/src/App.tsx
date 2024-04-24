import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import AuthProvider from "./contexts/auth/AuthProvider";
import Groups from "./pages/Groups";
import { GroupsProvider } from "./contexts/groups/GroupsProvider";

function App() {
  return (
    <AuthProvider>
      <GroupsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/groups" element={<Groups />} />
          </Routes>
        </Router>
      </GroupsProvider>
    </AuthProvider>
  );
}

export default App;
