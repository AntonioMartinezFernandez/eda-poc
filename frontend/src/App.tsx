import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css'
import Index from './components';
import Error from './components/error';
import DeviceDashboard from './components/device-dashboard';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <Error />,
  },
  {
    path: "/device/:deviceId",
    element: <DeviceDashboard />,
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
