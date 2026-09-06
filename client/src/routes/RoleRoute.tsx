import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../features/auth/useAuth';



interface RoleRouteProps {

  allowedRoles: ('student' | 'teacher' | 'admin')[];

}



export default function RoleRoute({ allowedRoles }: RoleRouteProps) {

  const { user } = useAuth();



  if (!user || !allowedRoles.includes(user.role)) {

    return <Navigate to="/dashboard" replace />;

  }



  return <Outlet />;

}