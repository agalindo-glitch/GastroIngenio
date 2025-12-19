CREATE TABLE usuarios (id SERIAL PRIMARY KEY, nombre VARCHAR(30) NOT NULL, apellido VARCHAR(30) NOT NULL, edad INTEGER NOT NULL, usuario VARCHAR(30) UNIQUE NOT NULL, contrasena VARCHAR(50) NOT NULL, foto_perfil TEXT);

CREATE TABLE recetas (id SERIAL PRIMARY KEY, id_usuario INTEGER REFERENCES usuarios(id), nombre VARCHAR(50) NOT NULL, descripcion TEXT NOT NULL, tiempo_preparacion INTEGER NOT NULL, categoria VARCHAR(50) NOT NULL, comensales INTEGER, elegidos_comunidad BOOLEAN, review INTEGER DEFAULT 0, fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP, imagen_url TEXT);

CREATE TABLE comentarios (id SERIAL PRIMARY KEY, id_usuario INTEGER, id_receta INTEGER, descripcion TEXT NOT NULL, likes INTEGER DEFAULT 0, dislikes INTEGER DEFAULT 0, FOREIGN KEY (id_usuario) REFERENCES usuarios(id), FOREIGN KEY (id_receta) REFERENCES recetas(id));

CREATE TABLE seguidores (id SERIAL PRIMARY KEY, seguidor_id INT NOT NULL, seguido_id INT NOT NULL, fecha_seguimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP, CONSTRAINT fk_seguidor FOREIGN KEY (seguidor_id) REFERENCES usuarios(id) ON DELETE CASCADE, CONSTRAINT fk_seguido FOREIGN KEY (seguido_id) REFERENCES usuarios(id) ON DELETE CASCADE, CONSTRAINT unique_seguimiento UNIQUE (seguidor_id, seguido_id), CONSTRAINT no_auto_seguimiento CHECK (seguidor_id <> seguido_id));

CREATE TABLE bloqueados (id SERIAL PRIMARY KEY, bloqueador_id INT NOT NULL, bloqueado_id INT NOT NULL, fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP, CONSTRAINT fk_bloqueador FOREIGN KEY (bloqueador_id) REFERENCES usuarios(id) ON DELETE CASCADE, CONSTRAINT fk_bloqueado FOREIGN KEY (bloqueado_id) REFERENCES usuarios(id) ON DELETE CASCADE, CONSTRAINT unique_bloqueo UNIQUE (bloqueador_id, bloqueado_id), CONSTRAINT no_auto_bloqueo CHECK (bloqueador_id <> bloqueado_id));

CREATE TABLE mensajes (id SERIAL PRIMARY KEY, emisor_id INT NOT NULL, receptor_id INT NOT NULL, contenido TEXT NOT NULL, leido BOOLEAN DEFAULT FALSE, fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP, CONSTRAINT fk_emisor FOREIGN KEY (emisor_id) REFERENCES usuarios(id) ON DELETE CASCADE, CONSTRAINT fk_receptor FOREIGN KEY (receptor_id) REFERENCES usuarios(id) ON DELETE CASCADE, CONSTRAINT no_auto_mensaje CHECK (emisor_id <> receptor_id));

CREATE TABLE ingredientes (id SERIAL PRIMARY KEY, nombre VARCHAR(100) UNIQUE NOT NULL);

CREATE TABLE receta_ingredientes (id SERIAL PRIMARY KEY, id_receta INTEGER NOT NULL REFERENCES recetas(id) ON DELETE CASCADE, id_ingrediente INTEGER NOT NULL REFERENCES ingredientes(id), cantidad VARCHAR(50), unidad VARCHAR(50));

CREATE TABLE pasos_receta (id SERIAL PRIMARY KEY, id_receta INTEGER NOT NULL REFERENCES recetas(id) ON DELETE CASCADE, numero SMALLINT NOT NULL CHECK (numero BETWEEN 1 AND 15), descripcion TEXT NOT NULL, foto_url TEXT, CONSTRAINT pasos_unicos UNIQUE (id_receta, numero));


-insertar clientes de prueba-

INSERT INTO usuarios (nombre, apellido, edad, usuario, contrasena) VALUES ('ricardo', 'rodrigues', 23, 'tini', 'nose');
INSERT INTO recetas (id_usuario, nombre, descripcion, tiempo_preparacion, categoria, elegidos_comunidad, review) VALUES (1,'zapallo','zapallo del bueno', 35, 'comida', 'true', 7);
INSERT INTO comentarios (id_usuario, id_receta, descripcion, likes, dislikes) VALUES (1 , 1, 'muy buena la receta', 5, 8);

-comando para enviar una peticion HTTP POST desde la terminal-
(se envia un JSON como un body para poder probar el post)

//1- pruebo de forma ideal (pasa)
curl -X POST \
-d '{"nombre":"matias", "apellido":"zapata", "edad":23, "usuario":"sergio44", "contrasena":"todomas"}'\
-H "Content-Type: application/json" \
http://localhost:3000/usuarios

curl -X POST \
-d '{"id_usuario":1,"nombre":"Tarta de verdu","descripcion":"tarta echa con verdura","tiempo_preparacion":30,"categoria":"comida","elegidos_comunidad":"false","review":0}' \
-H "Content-Type: application/json" \
http://localhost:3000/recetas

curl -X POST \
-H "Content-Type: application/json" \
-d '{"id_usuario":1,"id_receta":1,"descripcion":"Muy buena la receta","likes":0,"dislikes":0}' \
http://localhost:3000/comentarios

curl -X POST -H \
"Content-Type: application/json" \
-d '{"usuario":"sergio44","contrasena":"todomas"}' \
http://localhost:3000/login





//2- pruebo errores del post en usuarios, dejo un espacio en blanco en apellido (marca error)
curl -X POST \
-d '{"nombre":"aaaaa", "apellido":"", "edad":20, "usuario":"gsgwg", "contrasena":"elmascapo"}' \
-H "Content-Type: application/json" \
http://localhost:3000/usuarios

//2- pruebo errores de recetas, descripcion vacia (se espera error 400)

curl -X POST \
-H "Content-Type: application/json" \
-d '{"id_usuario":1,"descripcion":"","tiempo_preparacion":30,"categoria":"comida", "elegidos_comunidad":"false","review":0}' \
http://localhost:3000/recetas


//2- pruebo erores de los comentarios, descripcion vacia (marca error 400)

curl -X POST \
-H "Content-Type: application/json" \
-d '{"id_usuario":1,"id_receta":1,"descripcion":"","likes":0,"dislikes":0}' \
http://localhost:3000/comentarios




//3- pruebo errores del post en usuarios, no pongo el apellido (marca error)
curl -X POST \
-d '{"nombre":"aaaaa", "edad":20, "usuario":"gsgwg", "contrasena":"elmascapo"}' \
-H "Content-Type: application/json" \
http://localhost:3000/usuarios

//3- pruebo errores de la receta, falta un campo obligatorio, no pongo la descripcion ( se espera error 400 )
curl -X POST \
-H "Content-Type: application/json" \
-d '{"id_usuario":1,"tiempo_preparacion":30,"categoria":"comida", "elegidos_comunidad":"false","review":0}' \
http://localhost:3000/recetas

//3- receta con usuario indexistente (se espera error 400 o 404)

curl -X POST \
-H "Content-Type: application/json" \
-d '{"id_usuario":999,"nombre":"Error","descripcion":"No existe el usuario","tiempo_preparacion":10,"categoria":"comida"}' \
http://localhost:3000/recetas


//3- pruebo errores de los comentarios, falta la descripcion (se espera error 400 )
curl -X POST \

-H "Content-Type: application/json" \
-d '{"id_usuario":1,"id_receta":1, "likes":0,"dislikes":0}' \
http://localhost:3000/comentarios

//3- POST comentario con receta inexistente (se espera error 400 o 404)
curl -X POST \
-H "Content-Type: application/json" \
-d '{"id_usuario":1,"id_receta":999,"descripcion":"Prueba"}' \
http://localhost:3000/comentarios

//3 -usuario indexistente (se espera error 400 o 404)

curl -X POST \
-H "Content-Type: application/json" \
-d '{"id_usuario":999,"id_receta":1,"descripcion":"Prueba"}' \
http://localhost:3000/comentarios




-comando para enviar una peticion HTTP DELETE desde la terminal-

//1- elimino un usuario de la base de datos

curl -X DELETE \
http://localhost:3000/usuarios/2

//-1 elimino una receta de la base de datos dado su id

curl -X DELETE \
-H "Content-Type: application/json" \
-d '{"id": 1}' \
http://localhost:3000/recetas

//-1 elimino un comentario de la base de datos dado su id

curl -X DELETE \
-H "Content-Type: application/json" \
-d '{"id": 2}' \
http://localhost:3000/comentarios

-comando para enviar una peticion HTTP PUT desde la terminal-

//1- modifico un usuario de la base de datos

curl -X PUT \
-H "Content-Type: application/json" \
-d '{"nombre": "Juan", "apellido": "Pérez", "edad": 25, "usuario": "juanperez", "contrasena": "nuevacontra"}' \
http://localhost:3000/usuarios/1

//-1 modifico una receta de la base de datos

curl -X PUT \
-H "Content-Type: application/json" \
-d '{"id_usuario":1,"nombre":"Pizza casera","descripcion": "Pizza casera mejorada","tiempo_preparacion": 40,"categoria": "comida","elegidos_comunidad":"false","review":0}' \
http://localhost:3000/recetas/1

//-1 modifico un comentario especifico de la base de datos 
curl -X PUT \
-H "Content-Type: application/json" \
-d '{"id_usuario":1,"id_receta":1,"descripcion": "Excelente receta, muy clara", "likes": 3, "dislikes": 0}' \
http://localhost:3000/comentarios/1


