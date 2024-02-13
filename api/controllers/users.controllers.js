import Users from "../models/users.js";
import bcrypt from "bcrypt"


export const createUser = async (req, res) => { 
    
   const {name, email, password, rol} = req.body
   console.log(req.body)

   await Users.findOne({email})
             .then((user) => { 
               if(user) { 
                   res.json({message: "The email exist in our DataBase. Please, select other"})
               } else if (!name || !email || !password) { 
                   res.json({message: "Data is missing to be able to register. Please complete all fields"})
               } else { 
                   console.log(req.body)
                   bcrypt.hash(password, 10, (err, passwordHash) => { 
                       if(err) res.json({err})
                       else { 
                           const newUser = new Users ( { 
                               name: name,
                               password: passwordHash,                            
                               email: email,
                               rol: rol,
                           })
                            newUser.save()
                                   .then((user) => { 
                                       res.json({message: "Your Account has been created Succesfully. Now, we redirect you tu Login.", user})     
                                   })
                                   .catch((err) => console.log(err))               
                       }
                   })
               }
             })
}


export const login = async (req, res) => { 
  const {email, password} = req.body
  console.log(req.body)

  try {
     let checkUser = await Users.findOne({email: email})
     if(!checkUser) { 
        res.json({message: "El email no se encuentra registrado"})
     } else { 
        const hashedPassword = checkUser.password;
        bcrypt.compare(password, hashedPassword)
              .then((samePassword) => { 
                   if(samePassword) { 
                    const {_id, name, password, rol, email} = checkUser
                    res.json({
                        id: _id,
                        name: name,
                        password: password,
                        rol: rol,
                        email: email                   
                    })
                   } else { 
                    res.json({message: "La contraseña es incorrecta"})
                   }
              })
     }
  } catch (error) {
     res.send("The data entered is Incorrect. I cant find it")
       console.log(error)
  }
}

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

// Obtener un usuario por su ID
export const getUserById = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

// Actualizar un usuario existente
export const updateUser = async (req, res) => {
  console.log(req.params)
  const { userId } = req.params;
  const {email, name} = req.body

    try {
        Users.findByIdAndUpdate({ _id: userId }, { 
        username: username,
        name: name,
        email: email,
          
        })
        .then((newUserData) => {                                      
        res.json({message:"Usuario Modificado", newUserData})
        })
        .catch((err) => { 
        console.log(err)
        })
      } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error interno del servidor' });
      }
};


// Eliminar un usuario
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await Users.findByIdAndDelete(userId);
    if (deletedUser) {
      res.status(200).json({ message: 'Usuario eliminado correctamente', deleted: deletedUser });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};