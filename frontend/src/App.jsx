
import { Register } from '../pages/register'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Login} from '../pages/Login'
import {Adminregister} from '../pages/Adminregister'
import { Dashboard } from '../pages/Dashboard'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { AuthContext } from '../context/AuthContext'
import { Enseignant } from '../pages/Admin/Enseignant'
import { Notifications } from '../pages/Admin/Notifications'
import { Alerts } from '../pages/Admin/Alerts'
import { Modifierinfo } from '../pages/Admin/Modifierinfo'
import { Classetudiant } from '../pages/Admin/Classetudiant'


function App() {

  

  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Register/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/Admin' element={<ProtectedRoute allowedRoles={['admin']}>
                  <Adminregister/>
            </ProtectedRoute>}></Route>

            <Route path='/dashboard' element={<ProtectedRoute allowedRoles={['etudiant','enseignant']}>
                <Dashboard/>
              </ProtectedRoute>}> </Route>
              <Route path='/unauthorized' element={<h2>Accès refusé</h2>} />

                



            <Route path='/Admin/Enseignant' element={<ProtectedRoute allowedRoles={['admin']}>
                  <Enseignant/>
            </ProtectedRoute>}></Route>
            <Route path='/Admin/Notifications' element={<ProtectedRoute allowedRoles={['admin']}>
                  <Notifications/>
            </ProtectedRoute>}></Route>
            <Route path='/Admin/Alerts' element={<ProtectedRoute allowedRoles={['admin']}>
                  <Alerts/>
            </ProtectedRoute>}></Route>
            <Route path='/Admin/modifier-info' element={<ProtectedRoute allowedRoles={['admin']}>
                  <Modifierinfo/>
            </ProtectedRoute>}></Route>
            <Route path='/Admin/ClasseEtudiant' element={<ProtectedRoute allowedRoles={['admin']}>
                  <Classetudiant/>
            </ProtectedRoute>}></Route>


          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
