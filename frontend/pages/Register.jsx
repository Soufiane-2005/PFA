

import { useState } from "react"
import { apiRequest } from "../utils/fetchapi"
import { useNavigate , Link} from "react-router-dom"




export function Register(){
    const [prenom, setPrenom] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e)=>{
        e.preventDefault()
        

        try {
            const data = await apiRequest("/register", "POST", {prenom: prenom,email:  email, password: password})
            alert(data.message)
            navigate('/login')

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
                <form onSubmit={handleSubmit}>
                    <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' , color: 'white' }}>Inscription</h1>

                    <div style={style}>
                    <label htmlFor="name">Entrer votre prenom :</label><br/>
                    <input
                        type="text"
                        id="name"
                        value={prenom}
                        onChange={e => setPrenom(e.target.value)}
                        required
                    /><br/><br/>

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

                    <button type="submit">S'inscrire</button>
                    </div>

                    <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                    Déjà un compte ?{' '}
                    <Link to="/login" style={{ color: '#646cff', textDecoration: 'underline' }}>
                        Connectez-vous ici
                    </Link>
                    </p>
                </form>
            </div>


    )
}