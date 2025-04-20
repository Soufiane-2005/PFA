

import {useContext, useState } from "react"
import { apiRequest } from "../utils/fetchapi"
import { useNavigate , Link} from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import Cookies               from "js-cookie";





export function Login(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const {loadUser} = useContext(AuthContext)


    const hasndlesubmit = async (e)=>{
        e.preventDefault()

        

        try {
            const data = await apiRequest("/Login", "POST", {email, password})
            alert(data.message)


              await loadUser()



            if (data.role == 'admin'){
                
               
                console.log("eiowry")
                navigate('/Admin')
            }else if(data.role == 'etudiant' || data.role == 'enseignant'){
                console.log('owefn')
                navigate('/dashboard')
            }
            


        }catch(err){
            alert(err.message)

        }

    



    }

    const style = {
        border: '1px solid black',
        padding : '50px',
        fontSize: '20px',
        backgroundColor: 'rgb(12,12,50, 0.3)'
    }







    return (
        <div style={{ width: '100%', maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <form onSubmit={hasndlesubmit}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' , color: 'white'}}>Login</h1>

        <div style={style}>
          <label htmlFor="email">Entrer votre email :</label><br/>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          /><br/><br/>

          <label htmlFor="password">Entrer votre mot de passe :</label><br/>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          /><br/><br/>

          <button type="submit">Se connecter</button>
        </div>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Pas de compte ?{' '}
          <Link to="/" style={{ color: '#646cff', textDecoration: 'underline' }}>
            Inscrivez‑vous ici
          </Link>
        </p>
      </form>
    </div>

    )
}