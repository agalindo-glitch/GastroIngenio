CREATE TABLE usuarios (id SERIAL PRIMARY KEY, nombre VARCHAR(15) NOT NULL, apellido VARCHAR(15) NOT NULL, edad INTEGER NOT NULL, usuario VARCHAR(15) NOT NULL, contrasena VARCHAR(15) NOT NULL);
CREATE TABLE recetas (id SERIAL PRIMARY KEY, id_usuarios INTEGER, nombre TEXT NOT NULL, descripcion TEXT NOT NULL, tiempo_preparacion INTEGER NOT NULL, categoria VARCHAR(20) NOT NULL, likes INTEGER, dislikes INTEGER, FOREIGN KEY (id_usuarios) REFERENCES usuarios(id));
CREATE TABLE comentarios (id SERIAL PRIMARY KEY, id_usuarios INTEGER, id_recetas INTEGER, descripcion TEXT NOT NULL, likes INTEGER, dislikes INTEGER, FOREIGN KEY (id_usuarios) REFERENCES usuarios(id), FOREIGN KEY (id_recetas) REFERENCES recetas(id));

-insertar clientes de prueba-

INSERT INTO usuarios (id, nombre, apellido, edad, usuario, contrasena) VALUES ("ricardo", "rodrigues", 23, "tini", "nose");

-comando para enviar una peticion HTTP POST desde la terminal-
(se envia un JSON como un body parra poder probar el post)

//1- pruebo de forma ideal (pasa)
curl -X POST \
-d '{"nombre":"matias", "apellido":"zapata", "edad":23, "usuario":"sergio44", "contrasena":"todomas"}'\
-H "Content-Type: application/json" \
http://localhost:3000/usuarios

//2- pruebo errores del post en usuarios, dejo un espacio en blanco en apellido (marca error)
curl -X POST \
-d '{"nombre":"aaaaa", "apellido":"", "edad":20, "usuario":"gsgwg", "contrasena":"elmascapo"}' \
-H "Content-Type: application/json" \
http://localhost:3000/usuarios


//3- pruebo errores del post en usuarios, no pongo el apellido (marca error)
curl -X POST \
-d '{"nombre":"aaaaa", "edad":20, "usuario":"gsgwg", "contrasena":"elmascapo"}' \
-H "Content-Type: application/json" \
http://localhost:3000/usuarios



