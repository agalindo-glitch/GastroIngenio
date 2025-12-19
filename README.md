
# Gastroingenio

#### Que es Gastroingenio?

GastroIngenio es una innovadora página web diseñada para facilitar el acceso a recetas de cocina de todo tipo. Esta plataforma está orientada a usuarios que buscan mejorar sus habilidades culinarias o descubrir nuevas ideas para sus menús diarios. A través de una interfaz intuitiva y atractiva, GastroIngenio ofrece una experiencia completa, desde la búsqueda de recetas hasta la visualización detallada de ingredientes y pasos de preparación.

## Backend

El proyecto está respaldado por un robusto backend donde se emplea un servidor Express.js, que gestiona las solicitudes y respuestas de la aplicación, asegurando una estructura de rutas flexible y optimizada para el manejo de las recetas. Se implementa el uso de CORS para permitir el acceso controlado a recursos desde diferentes dominios. Por otro lado, tambien usamos dotev donde permite cargar las variables de entorno desde un archivo `.env`. Y por ultimo, El paquete `pg` nos permite interactuar con la base de datos PostgreSQL

#### como se inicia el backend?

1- Debemos asegurarnos que las dependencias se encuentren en el proyecto.

Dependencias:

   - `cors`
   - `dotenv`
   - `express`
   - `pg`

Si no están instaladas, puedes ejecutarlas con el siguiente comando en la teminal:

    npm install

Asegurese de que las dependencias aparezcan en tu archivo `package.json`.

![App Screenshot](./assets/img/dependecias.png)

2- Levantamos el contenedor que contiene la base de datos usando el siguiente comando, desde la terminal, en el directorio donde se encuentra el `docker-compose.yml` del backend. 

Directorio: GastroIngenio/backend

    docker compose up -d

![App Screenshot](./assets/img/docker_backend.png)

3- Ingresamos a la base de datos ingresando los siguientes comandos.    
Ejecutamos el container donde se encuentra la base de datos

    docker exec -it bd_gastroingenio bash

![App Screenshot](./assets/img/dentro_del_container.png)

Luego accedemos a la base de datos con el siguiente comando

    psql -U postgres -d gastroingenio

![App Screenshot](./assets/img/dentro_bd.png)

4- Las tablas y la estructura de la base de datos están definidas en el archivo schemas.sql. Asegúrate de ejecutar las sentencias SQL para crear las tablas necesarias.

    CREATE TABLE usuarios (id SERIAL PRIMARY KEY, nombre VARCHAR(30) NOT NULL, apellido VARCHAR(30) NOT NULL, edad INTEGER NOT NULL, usuario VARCHAR(30) UNIQUE NOT NULL, contrasena VARCHAR(50) NOT NULL);

    CREATE TABLE recetas (id SERIAL PRIMARY KEY, id_usuario INTEGER, nombre VARCHAR(50) NOT NULL, descripcion TEXT NOT NULL, tiempo_preparacion INTEGER NOT NULL, categoria VARCHAR(50) NOT NULL, elegidos_comunidad BOOLEAN, review INTEGER DEFAULT 0, FOREIGN KEY (id_usuario) REFERENCES usuarios(id));

    CREATE TABLE comentarios (id SERIAL PRIMARY KEY, id_usuario INTEGER, id_receta INTEGER, descripcion TEXT NOT NULL, likes INTEGER DEFAULT 0, dislikes INTEGER DEFAULT 0, FOREIGN KEY (id_usuario) REFERENCES usuarios(id), FOREIGN KEY (id_receta) REFERENCES recetas(id));

5- Una vez configurada la base de datos, abri otra terminal en el directorio del backend y ejecuta el siguiente comando para levantar el servidor del backend.

    npm run dev

![App Screenshot](./assets/img/sv_levantado.png)

Con esto ya tendriamos el backend.

## Frontend

1- Levantamos el contenedor que contiene el Frontend con el siguiente comando en el directorio raiz.

    docker-compose up -d

![App Screenshot](./assets/img/docker_front.png)

2- Ingresamos en esta URL desde un navegador.

    http://localhost:8080/
