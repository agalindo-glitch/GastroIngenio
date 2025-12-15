CREATE TABLE usuarios (id SERIAL PRIMARY KEY, nombre VARCHAR(15) NOT NULL, apellido VARCHAR(15) NOT NULL, edad INTEGER NOT NULL, usuario VARCHAR(15) NOT NULL, contrasena VARCHAR(15) NOT NULL);
CREATE TABLE recetas (id SERIAL PRIMARY KEY, id_usuario INTEGER, nombre VARCHAR(30) NOT NULL, descripcion TEXT NOT NULL, tiempo_preparacion INTEGER NOT NULL, categoria VARCHAR(20) NOT NULL, likes INTEGER DEFAULT 0, dislikes INTEGER DEFAULT 0, FOREIGN KEY (id_usuario) REFERENCES usuarios(id));
CREATE TABLE comentarios (id SERIAL PRIMARY KEY, id_usuario INTEGER, id_recetas INTEGER, descripcion TEXT NOT NULL, likes INTEGER DEFAULT 0, dislikes INTEGER DEFAULT 0, FOREIGN KEY (id_usuario) REFERENCES usuarios(id), FOREIGN KEY (id_recetas) REFERENCES recetas(id));

-insertar clientes de prueba-

INSERT INTO usuarios (nombre, apellido, edad, usuario, contrasena) VALUES ('ricardo', 'rodrigues', 23, 'tini', 'nose');
INSERT INTO recetas (id_usuario, nombre, descripcion, tiempo_preparacion, categoria, likes, dislikes) VALUES (1,'Pizza con queso','Hago una pizza casera simple de muzzarela', 35, 'comida', 5, 7);
INSERT INTO comentarios (id_usuario, id_recetas, descripcion, likes, dislikes) VALUES (1 , 1, 'muy buena la receta', 5, 8);

-comando para enviar una peticion HTTP POST desde la terminal-
(se envia un JSON como un body para poder probar el post)

//1- pruebo de forma ideal (pasa)
curl -X POST \
-d '{"nombre":"matias", "apellido":"zapata", "edad":23, "usuario":"sergio44", "contrasena":"todomas"}'\
-H "Content-Type: application/json" \
http://localhost:3000/usuarios

curl -X POST \
-d '{"id_usuario":1,"nombre":"Tarta de verdu","descripcion":"tarta echa con verdura","tiempo_preparacion":30,"categoria":"comida","likes":0,"dislikes":0}' \
-H "Content-Type: application/json" \
http://localhost:3000/recetas

curl -X POST \
-H "Content-Type: application/json" \
-d '{"id_usuario":1,"id_recetas":1,"descripcion":"Muy buena la receta","likes":0,"dislikes":0}' \
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
-d '{"id_usuario":1,"descripcion":"","tiempo_preparacion":30,"categoria":"comida", "likes":0,"dislikes":0}' \
http://localhost:3000/recetas


//2- pruebo erores de los comentarios, descripcion vacia (marca error 400)

curl -X POST \
-H "Content-Type: application/json" \
-d '{"id_usuario":1,"id_recetas":1,"descripcion":"","likes":0,"dislikes":0}' \
http://localhost:3000/comentarios




//3- pruebo errores del post en usuarios, no pongo el apellido (marca error)
curl -X POST \
-d '{"nombre":"aaaaa", "edad":20, "usuario":"gsgwg", "contrasena":"elmascapo"}' \
-H "Content-Type: application/json" \
http://localhost:3000/usuarios

//3- pruebo errores de la receta, falta un campo obligatorio, no pongo la descripcion ( se espera error 400 )
curl -X POST \
-H "Content-Type: application/json" \
-d '{"id_usuario":1,"tiempo_preparacion":30,"categoria":"comida", "likes":0,"dislikes":0}' \
http://localhost:3000/recetas

//3- receta con usuario indexistente (se espera error 400 o 404)

curl -X POST \
-H "Content-Type: application/json" \
-d '{"id_usuario":999,"nombre":"Error","descripcion":"No existe el usuario","tiempo_preparacion":10,"categoria":"comida"}' \
http://localhost:3000/recetas


//3- pruebo errores de los comentarios, falta la descripcion (se espera error 400 )
curl -X POST \

-H "Content-Type: application/json" \
-d '{"id_usuario":1,"id_recetas":1, "likes":0,"dislikes":0}' \
http://localhost:3000/comentarios

//3- POST comentario con receta inexistente (se espera error 400 o 404)
curl -X POST \
-H "Content-Type: application/json" \
-d '{"id_usuario":1,"id_recetas":999,"descripcion":"Prueba"}' \
http://localhost:3000/comentarios

//3 -usuario indexistente (se espera error 400 o 404)

curl -X POST \
-H "Content-Type: application/json" \
-d '{"id_usuario":999,"id_recetas":1,"descripcion":"Prueba"}' \
http://localhost:3000/comentarios




-comando para enviar una peticion HTTP DELETE desde la terminal-

//1- elimino un usuario de la base de datos

curl -X DELETE \
-d '{"id":4}' \
-H "Content-Type: application/json" \
http://localhost:3000/usuarios

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
-d '{"id_usuario":1,"nombre":"Pizza casera","descripcion": "Pizza casera mejorada","tiempo_preparacion": 40,"categoria": "comida","likes": 10,"dislikes": 2}' \
http://localhost:3000/recetas/1

//-1 modifico un comentario especifico de la base de datos 
curl -X PUT \
-H "Content-Type: application/json" \
-d '{"id_usuario":1,"id_recetas":1,"descripcion": "Excelente receta, muy clara", "likes": 3, "dislikes": 0}' \
http://localhost:3000/comentarios/1


