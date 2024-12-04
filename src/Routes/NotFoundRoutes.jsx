
import Notfound from '../pages/Notfound';
import { Route, Routes } from 'react-router-dom';

export default function NotFoundRoutes() {
  return(
    <Routes>
        <Route path="*" element={<Notfound/>} />
    </Routes>
  )
}
