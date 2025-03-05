import Register from './components/Authorization/Register';
import Login from './components/Authorization/Login';
import ResetPassword from './components/Authorization/ResetPassword';
import Home from './components/Main/Home';
import Layout from './components/Main/Layout';
import Editor from './components/Appointments/Editor';
import Admin from './components/Users/Admin';
import Psychologist from './components/Users/Psychologist';
import Missing from './components/Main/Missing';
import Unauthorized from './components/Authorization/Unauthorized';
import TherapiesPage from './components/Therapies/TherapiesPage';
import CreateTherapyPage from './components/Therapies/CreateTherapy';
import EditTherapyPage from './components/Therapies/EditTherapy';
import CreateAppointment from './components/Appointments/CreateAppointment';
import MyAppointmentsPage from './components/Appointments/MyAppointments';
import EditAppointment from './components/Appointments/EditAppointment';
import AppointmentsPage from './components/Appointments/AppointmentsPage';
import AppointmentPage from './components/Appointments/AppointmentPage';
import TherapyPage from './components/Therapies/TherapyPage';
import RequireAuth from './components/Authorization/RequireAuth';
import NotesPage from './components/Notes/NotesPage';
import CreateNotePage from './components/Notes/CreateNote';
import EditNotePage from './components/Notes/EditNote';
import NotePage from './components/Notes/NotePage';
import { Routes, Route } from 'react-router-dom';

const ROLES = {
  'User': "Patient",
  'Editor': "Doctor",
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
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notes/:noteId" element={<NotePage />} />
          <Route path="/notes/createNote" element={<CreateNotePage />} />
          <Route path="/notes/:noteId/editNote" element={<EditNotePage />} />
          <Route path="/myAppointments" element={<MyAppointmentsPage />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Editor]} />}>
          <Route path="/" element={<Home />} />
          <Route path="/therapies" element={<TherapiesPage />} />
          <Route path="/resetPassword" element={<ResetPassword />} />          
          <Route path="/therapies/:therapyId" element={<TherapyPage />} />
          <Route path="/therapies/:therapyId/appointments" element={<AppointmentsPage />} />
          <Route path="/therapies/:therapyId/appointments/:appointmentId" element={<AppointmentPage />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>          
          <Route path="/therapies/createTherapy" element={<CreateTherapyPage />} />
          <Route path="/therapies/:therapyId/editTherapy" element={<EditTherapyPage />} />
          <Route path="/therapies/:therapyId/appointments/createAppointment" element={<CreateAppointment />} />
          <Route path="/therapies/:therapyId/appointments/:appointmentId/editAppointment" element={<EditAppointment />} />         
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} doNotPassAdmin = {true}/>}>
          <Route path="editor" element={<Editor />} />
          <Route path="psychologist" element={<Psychologist />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="admin" element={<Admin />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;