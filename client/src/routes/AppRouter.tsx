import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../features/auth/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ChatsPage from '../pages/ChatsPage';
import GroupList from '../features/groups/GroupList';
import FileList from '../features/files/FileList';
import NotificationList from '../features/notifications/NotificationList';
import CourseList from '../features/courses/CourseList';
import CourseDetail from '../features/courses/CourseDetail';
import ProfilePage from '../features/profile/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/chats" element={<ChatsPage />} />
            <Route path="/chats/:chatId" element={<ChatsPage />} />
            <Route path="/groups" element={<GroupList />} />
            <Route path="/files" element={<FileList />} />
            <Route path="/notifications" element={<NotificationList />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}