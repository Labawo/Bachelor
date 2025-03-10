import Register from './components/Authorization/Register';
import Login from './components/Authorization/Login';
import ResetPassword from './components/Authorization/ResetPassword';
import Home from './components/Main/Home';
import Layout from './components/Main/Layout';
import Admin from './components/Users/Admin';
import Missing from './components/Main/Missing';
import Unauthorized from './components/Authorization/Unauthorized';
import RequireAuth from './components/Authorization/RequireAuth';
import NotesPage from './components/Notes/NotesPage';
import TrainingPage from './components/Training/TrainingPage';
import QuizPage from './components/Quiz/QuizPage';
import TypingPage from './components/SpeedTyping/TypingPage';
import LevelsPage from './components/Levels/LevelsPage';
import BadgesPage from './components/Badges/BadgesPage';
import CreateLevel from './components/Levels/CreateLevel';
import { Routes, Route } from 'react-router-dom';

const ROLES = {
  'User': "Student",
  'Admin': "Admin"
}

function App() {

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* we want to protect these routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.User]} doNotPassAdmin = {true}/>}>
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/tests" element={<QuizPage />} />
          <Route path="/speedTyping" element={<TypingPage />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path="/" element={<Home />} />
          <Route path="/resetPassword" element={<ResetPassword />} />          
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="admin" element={<Admin />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/levelsPage" element={<LevelsPage />} />
          <Route path="/badgesPage" element={<BadgesPage />} />
          <Route path="/createLevel" element={<CreateLevel />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;