import { useNavigate } from "react-router-dom"
import { apiRequest } from "../utils/fetchapi"
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import Cookies from "js-cookie";




export function Dashboard(){
    const { user} = useContext(AuthContext);

    const navigate = useNavigate()

    console.log(user)




    const handleLogout = async ()=>{
        try{

            const data = await apiRequest('/logout', 'POST')
            alert(data.message)

            navigate('/login')

        }catch(err){
            alert(err.message)

        }
        
        
    }




    return (
        <>

        <h1>Salut🖐 {user.prenom}</h1>
        <p>your information are: </p>

        <p>{JSON.stringify(user, null, 2)}</p>
   



        <div>je suis dans le dashboard</div>


        <button onClick={handleLogout}>se </button>
        </>

    )

}