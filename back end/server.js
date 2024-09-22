// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const path = require('path'); 

const User = require('./models/users');
const DesafioModel = require('./models/desafios');
const CarreraModel = require('./models/carreras');
const GrupoModel = require('./models/grupos');

// const initializePassport = require('./passport-config');
// initializePassport(
//   passport, 
//   async email => {
//     console.log("Buscando usuario por email:", email);
//     const user = await User.findOne({ email });
//     console.log("Usuario encontrado por email:", user.name); // Muestra el usuario encontrado por email
//     return user;
//   },
//    async id => {
//     console.log("Buscando usuario por _id:", id);
//     try{
//       const user = await User.findById(id);
//       if (!user) {
//         console.log(`No se encontró ningún usuario con el _id ${id}`);
//         return null;
//       }
//       console.log("Usuario encontrado por _id:", user.name); // Muestra el usuario encontrado por _id
//       return user;
//     }catch(err){
//       console.log("Error al buscar el usuario por _id:", err); 
//     }
//   }
// );

console.log('MONGODB_URI:', process.env.MONGODB_URI);
const app = express();
const port = process.env.PORT
const mongodb = process.env.MONGODB_URI
const MongoStore = require('connect-mongo');

app.use(cors({
  origin: 'http://localhost:3000', // Tu origen frontend
  credentials: true // Permite el uso de credenciales (cookies)
}));
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: false }
// }));
// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/Users" }),
  cookie: { secure: false } // Cambia a true si estás usando HTTPS
}));

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


mongoose.connect(mongodb);


////////// GET //////////

app.get('/api/saludo', (req, res) => {
  res.json({ name: 'Hola desde el backend!' });
});

app.get('/', (req,res)=>{
  //const userName = "cris jhgfgj";
  res.render('home');
  //console.log("name from home: ", userName);
  //console.log("req.user: " ,req.user)
})

app.get('/api/name', (req, res) => {
  // console.log('Sesión:', req.session);
  if (!req.session.userId) {
    return res.status(401).json({ mensaje: 'No autenticado' });
  }

  User.findById(req.session.userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      res.json({ name: user.name });
    })
    .catch(err => res.status(500).json({ mensaje: 'Error al obtener el usuario' }));
});

app.get('/carreras', async (req, res) => {
  CarreraModel.find()
  .then(carreras =>  res.json(carreras))
  .catch(err => res.json(err))
});

// app.get('/signup', (req,res)=>{
//   res.render('signup')
// })


app.get('/estudiantes', (req, res) => {
  User.find({ entity: 'Estudiante' })  // Filtrar solo los estudiantes
    .then(estudiantes => {
      res.json(estudiantes);
    })
    .catch(err => {
      res.status(500).json({ mensaje: 'Error al obtener los estudiantes', error: err });
    });
});

app.get('/grupos', async (req, res) => {
  try {
    const grupos = await GrupoModel.find().populate('estudiantes', 'name email');
    res.json(grupos);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener los grupos', error: err });
  }
});

app.get('/grupos/:estudianteRol', async (req, res) => {
  const { estudianteRol } = req.params;  // Obtener el rol del estudiante desde los parámetros de la ruta

  try {
    // Buscar grupos donde el array de estudiantes contenga el rol especificado
    const grupos = await GrupoModel.find({ estudiantes: estudianteRol });

    if (grupos.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron grupos para el estudiante especificado' });
    }

    // Extraer el nombre del desafío de los grupos encontrados
    const nombresDesafios = grupos.map(grupo => grupo.nombre);

    res.json(nombresDesafios); // Retornar los nombres de los desafíos
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener los grupos', error: err });
  }
});


app.get('/desafios', (req, res) => {
  DesafioModel.find()
    .then(desafios => {
      res.json(desafios);
    })
    .catch(err => {
      res.status(500).json({ mensaje: 'Error al obtener los desafíos', error: err });
    });
});

// app.get('/login', checkNotAuthenticated, (req,res)=>{
//   res.render('login')
// })


////////// POST //////////

app.post('/register', (req, res) => {
  const { name, email, password, phone, entity, rol, carrera  } = req.body;

  // Verificar si el usuario ya existe
  User.findOne({ email })
    .then(user => {
      if (user) {
        // Si el usuario ya existe, enviar un mensaje de error
        return res.status(400).json({ mensaje: 'El correo ya existe' });
      } 

      // Crear un nuevo usuario si no existe
      const newUser = new User({ 
        name, 
        email, 
        password, 
        phone, 
        entity,
        ...(entity === 'Estudiante' ? { rol, carrera } : {}) });

      newUser.save()
        .then(user => {
          res.json({ mensaje: 'Usuario registrado exitosamente', user });
        })
        .catch(err => {
          res.status(500).json({ mensaje: 'Error al registrar el usuario', error: err });
        });
    })
    .catch(err => {
      res.status(500).json({ mensaje: 'Error al buscar el usuario', error: err });
    });
});

// app.post('/login', checkNotAuthenticated ,passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/login',
//   failureFlash: true
// }));

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }

      user.comparePassword(password)
        .then(isMatch => {
          if (isMatch) {
            req.session.userId = user._id; // Guardar el ID del usuario en la sesión
            res.json({ mensaje: 'Usuario autenticado exitosamente' });
          } else {
            res.status(401).json({ mensaje: 'Contraseña incorrecta' });
          }
        })
        .catch(err => res.status(500).json({ mensaje: 'Error en la autenticación' }));
    })
    .catch(err => res.status(500).json({ mensaje: 'Error en la autenticación' }));
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al cerrar sesión' });
    }
    res.json({ mensaje: 'Sesión cerrada exitosamente' });
  });
});

app.post('/desafios', async (req, res) => {
  const { title, description, carreras } = req.body;
  console.log('Datos recibidos:', { title, description, carreras });

  if (!title || !description || !carreras) {
    return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
  }

  try {
    const desafioExistente = await DesafioModel.findOne({ title });
    if (desafioExistente) {
      return res.status(400).json({ mensaje: 'El desafío ya existe' });
    }

    const nuevoDesafio = new DesafioModel({ title, description, carreras });
    console.log('Desafío a registrar:', nuevoDesafio)
    const resultado = await nuevoDesafio.save();
    res.json({ mensaje: 'Desafío registrado exitosamente', desafio: resultado });
  } catch (err) {
    console.error('Error al registrar el desafío:', err);
    res.status(500).json({ mensaje: 'Error al registrar el desafío', error: err.message });
  }
});


app.post('/crear-grupo/:desafioId', async (req, res) => {
  try {
    const { desafioId } = req.params;
    const { estudiantes } = req.body;
    
    if (Array.isArray(estudiantes) && Array.isArray(estudiantes[0])) {
      estudiantes = estudiantes.flat(); // Aplana el array anidado
    }

    console.log('Datos recibidos:', estudiantes)

    const desafio = await DesafioModel.findById(desafioId);
    console.log('Desafío encontrado:', desafio.title);
    // Crear el grupo con los estudiantes
    const nuevoGrupo = new GrupoModel({
      id: desafioId,
      nombre: desafio.title,
      estudiantes: estudiantes // Mantén los IDs de estudiantes como strings
    });

    // Guardar el grupo
    await nuevoGrupo.save();

    res.json({ mensaje: 'Grupo creado exitosamente', grupo: nuevoGrupo });
  } catch (err) {
    console.error('Error al crear el grupo:', err);
    res.status(500).json({ mensaje: 'Error al crear el grupo', error: err.message });
  }
});



// function checkAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next()
//   }
//   res.redirect('/login')
// }

// function checkNotAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     console.log("req.isAuthenticated()")
//     return res.redirect('/')
//   } else{
//     console.log("NOT req.isAuthenticated()")
//   }
//   next()
// }

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
