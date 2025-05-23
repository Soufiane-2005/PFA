const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const connection = require('../config/db')
const express = require('express')
const isAuthenticated = require('../middlewares/auth')
const router = express.Router()

require('dotenv').config()

router.post('/register', async (req, res)=>{
    const {prenom, email, password} = req.body
    const query = 'INSERT INTO users (prenom, email, password, role) values (?,?,?,?)'

    const hashpassword = await bcrypt.hash(password, 10)

    connection.query(query, [prenom, email, hashpassword, "etudiant"], (err, result)=>{
        if(err){
            return res.status(500).json({message: 'une erreur de serveur'})
        }else{
          
            return res.status(200).json({message: "l'utilisateur a ete bien inscrit!! "})

        }
    })

})


router.post('/login',(req, res)=>{
    const {email , password} = req.body
    const query = 'Select * from users where email=?'
    connection.query(query, [email], async (err, result)=>{
        if(err){
            return res.status(500).json({message: "une erreur de serveur"})
        }else if(result.length==0){
            return res.status(400).json({message: "cette email n'existe pas!! "})
        }else{
            const user = result[0]
            const valid = await bcrypt.compare(password, user.password)
            if(!valid){
                return res.status(500).json({message: "le mots passe est incorrecte", password: user.password})
            }else{
                const token = jwt.sign({userId : user.id,
                    nom: user.nom,
                    role: user.role,
                    email: user.email,
                    prenom: user.prenom,
                    numero_tele: user.numero_telephone}, process.env.secret_key, {expiresIn: '1h'})
                console.log(user)
                res.cookie("token", token, {
                    httpOnly: false,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: 3600000
                })
                res.status(200).json({ message: "Connexion réussie", token : token, role: user.role });
            }
        }

    })
})











// des routes que j'ai pas encore utliser===============================================
router.post('/login/Admin', isAuthenticated, async (req, res)=>{
    const {nom, email, password} = req.body
    const query = 'INSERT INTO users (nom, email, password, role) values (?,?,?,?)'

    const hashpassword = await bcrypt.hash(password, 10)

    connection.query(query, [nom, email, hashpassword, "enseignant"], (err, result)=>{
        if(err){
            return res.status(500).json({message: 'une erreur de serveur'})
        }else{
            return res.status(200).json({message: "l'utilisateur a ete bien inscrit!! "})

        }
    })

})



// ===================================================================================






// cette partie est commun par tous les utilisateurs:%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5
router.post('/logout', (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // true en production avec HTTPS
      sameSite: "lax",
    });
    return res.status(200).json({ message: "Déconnexion réussie" });
  });



  // modifier les infos:
router.put('/modifier-info', isAuthenticated, (req,res)=>{
    const {prenom, nom, email, numero_telephone} = req.body;
    const id = req.user.userId
    console.log(id)
    const query2 = 'UPDATE users SET prenom = ?, nom = ?, email = ?, numero_telephone = ? WHERE id = ?';
    const query1 = 'Select * from users where id = ?'
    connection.query(query1, [id], (err, result)=>{
        if(err) return res.status(500).json({message: "Erreur de serveur"});
        connection.query(query2, [prenom, nom, email, numero_telephone, id], (err, result)=>{
            if(err) return res.status(400).json({message: "cette email existe deja"}) // j'ai fait 400 car cette requete ne soit pas
            // fausse sauf qu'il y'a deja un utilisateur avec cette nouvelle email.
            return res.status(200).json({message: "Informations modifiées avec succès."})
        })
       
    })
})

  
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%




// cette partie est dedie a l'Admin &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&










//Enseignant: 
//eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee

//ajouter des enseignant: 
router.post('/AjouterEnseignant', isAuthenticated, async (req, res) => {
    const { prenom, email, password } = req.body;

    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    connection.query(checkQuery, [email], async (checkErr, results) => {
        if (checkErr) {
            return res.status(500).json({ message: 'Erreur serveur lors de la vérification.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
        }

        const hashpassword = await bcrypt.hash(password, 10);
        const insertQuery = 'INSERT INTO users (prenom, email, password, role) VALUES (?, ?, ?, ?)';

        connection.query(insertQuery, [prenom, email, hashpassword, "enseignant"], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur serveur lors de l\'insertion.' });
            } else {
                return res.status(200).json({ message: "L'enseignant a été bien ajouté !" });
            }
        });
    });
});




//modifier enseignant: 

router.put('/ModifierEnseignant', isAuthenticated, (req, res) => {
    const { prenom, email } = req.body;

   
    const checkQuery = 'SELECT * FROM users WHERE email = ? AND role = "enseignant"';
    
    connection.query(checkQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur lors de la vérification' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Aucun enseignant trouvé avec cet email." });
        }

        
        const updateQuery = 'UPDATE users SET prenom = ? WHERE email = ? AND role = "enseignant"';
        
        connection.query(updateQuery, [prenom, email], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
            } else {
                return res.status(200).json({ message: "L'enseignant a été bien modifié !" });
            }
        });
    });
});




//supprimer Enseignant: 

router.delete('/SupprimerEnseignant/:email', isAuthenticated, (req, res) => {
    const email = req.params.email;

    const checkQuery = 'SELECT * FROM users WHERE email = ? AND role = "enseignant"';
    connection.query(checkQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur lors de la vérification.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Aucun enseignant trouvé avec cet email." });
        }

        const deleteQuery = 'DELETE FROM users WHERE email = ? AND role = "enseignant"';
        connection.query(deleteQuery, [email], (deleteErr, deleteResult) => {
            if (deleteErr) {
                return res.status(500).json({ message: 'Erreur serveur lors de la suppression.' });
            }

            return res.status(200).json({ message: "L'enseignant a été supprimé avec succès." });
        });
    });
});

//eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee





//Alerts: 
//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa


const findIdByEmail = require('../utils/findidbyemail')

//Ajouter une alerte

router.post('/Alerts', isAuthenticated, async (req, res) => {
    const { titre, contenu, email } = req.body;

    try {
        const userId = await findIdByEmail(email);

        if (typeof userId !== 'number') {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const query = `INSERT INTO alerts (titre, contenu, created_at, user_id) VALUES (?, ?, NOW(), ?)`;
        connection.query(query, [titre, contenu, userId], (err, result) => {
            if (err) {
                console.error("Erreur d'insertion :", err);
                return res.status(500).json({ message: "Erreur serveur lors de la création de l'alerte." });
            }

            return res.status(200).json({ message: "Alerte créée avec succès." });
        });

    } catch (error) {
        console.error("Erreur :", error);
        return res.status(500).json({ message: error });
    }
});



//afficher les alertes: 


router.get('/Alerts/:email',isAuthenticated, async (req, res)=>{
    const email = req.params.email
    const id = await findIdByEmail(email)
    const query = 'Select * from Alerts where user_id= ?'
    connection.query(query, [id], (err, result)=>{
        if(err){
            return res.status(500).json({message: "Erreur de serveur !!"})
        }
        return res.status(200).json(result)
    })
})


//supprimer les alertes: 

router.delete('/Alerts/:id', isAuthenticated, async (req,res)=>{
    const id = req.params.id;
    const query = 'Delete from Alerts where id = ?';
    connection.query(query, [id], (err, result)=>{
        if(err) return res.status(500).json({message: "Erreur de serveur !!"});
        return res.status(200).json({message: "l'alerte a ete bien supprimer !!"})
    })
})


// modifier les alerts: 

router.put('/Alerts/:id', isAuthenticated, (req, res)=>{
    const id = req.params.id;
    const {titre, contenu} = req.body;
    const query = 'Update Alerts set titre = ? , contenu = ? where id = ?'
    connection.query(query, [titre, contenu, id], (err, result)=>{
        if(err) return res.statut(500).json({message: "Erreur de serveur!! "});
        return res.status(200).json({message: "L'alerte a ete bien modifiee "})
    })
})

//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa


//Notifications:
//nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn


//Ajouter notification:

router.post('/Notifications', isAuthenticated, async (req, res) => {
    const { message, email } = req.body;

    try {
        const userId = await findIdByEmail(email);

        if (typeof userId !== 'number') {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const query = `INSERT INTO Notifications (message, created_at, user_id) VALUES (?, NOW(), ?)`;
        connection.query(query, [message, userId], (err, result) => {
            if (err) {
                console.error("Erreur d'insertion :", err);
                return res.status(500).json({ message: "Erreur serveur lors de la création de la notification." });
            }

            return res.status(200).json({ message: "Notification créée avec succès." });
        });

    } catch (error) {
        console.error("Erreur :", error);
        return res.status(500).json({ message: error });
    }
});


//Afficher les notifications

router.get('/Notifications/:email',isAuthenticated, async (req, res)=>{
    const email = req.params.email
    const id = await findIdByEmail(email)
    const query = 'Select * from Notifications where user_id= ?'
    connection.query(query, [id], (err, result)=>{
        if(err){
            return res.status(500).json({message: "Erreur de serveur !!"})
        }
        return res.status(200).json(result)
    })
})

// supprimer notification: 
router.delete('/Notifications/:id', isAuthenticated, async (req,res)=>{
    const id = req.params.id;
    const query = 'Delete from Notifications where id = ?';
    connection.query(query, [id], (err, result)=>{
        if(err) return res.status(500).json({message: "Erreur de serveur !!"});
        return res.status(200).json({message: "la notification a ete bien supprimer !!"})
    })
})

// modifier notification: 

router.put('/Notifications/:id', isAuthenticated, (req, res)=>{
    const id = req.params.id;
    const {message} = req.body;
    const query = 'Update Notifications set message = ? where id = ?'
    connection.query(query, [message, id], (err, result)=>{
        if(err) return res.statut(500).json({message: "Erreur de serveur!! "});
        return res.status(200).json({message: "La notificatino a ete bien modifiee "})
    })
})


//nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn

















module.exports = router;