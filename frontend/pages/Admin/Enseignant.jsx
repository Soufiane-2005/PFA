import { useState } from 'react';
import '../../src/styleCss/modifierinfo.css';
import { apiRequest } from '../../utils/fetchapi';

export function Enseignant() {
    const [action, setAction] = useState('ajouter');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (action === 'ajouter') {
            try{
                const data = await apiRequest('/AjouterEnseignant', 'POST', {
                    prenom,
                    email,
                    password
                })
               
                alert(data.message)

            }catch(err){
                
                alert(err)
            }
            

        } else if (action === 'modifier') {
            try {
                const data = await apiRequest('/ModifierEnseignant', 'PUT', {
                    prenom,
                    email
                })
                alert(data.message)
                
            } catch (error) {
                alert(error)
                
            }
            


        } else if (action === 'supprimer') {
            try {
                const data = await apiRequest(`/SupprimerEnseignant/${email}`, 'DELETE',)
                alert(data.message)
                
            } catch (error) {
                alert(error)
                
            }
        }
    };

    return (
        <div className="modifier-container">
            <h1>Ajouter, Modifier, Supprimer enseignant</h1>
            <form className="modifier-form" onSubmit={handleSubmit}>
                
                <label>Action :</label>
                <select value={action} onChange={(e) => setAction(e.target.value)}>
                    <option value="ajouter">Ajouter</option>
                    <option value="modifier">Modifier</option>
                    <option value="supprimer">Supprimer</option>
                </select>

                {action !== 'supprimer' && (
                    <>
                        <label>Prénom :</label>
                        <input
                            type="text"
                            name="prenom"
                            placeholder="Entrez le prénom"
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                            required={action !== 'supprimer'}
                            
                        />
                    </>
                )}

                <label>Email :</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Entrez l'email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {action === 'ajouter' && (
                    <>
                        <label>Mot de passe :</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Entrez le mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </>
                )}

                <button type="submit">Soumettre</button>
            </form>
        </div>
    );
}
