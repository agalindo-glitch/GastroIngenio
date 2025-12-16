# GastroIngenio
Pagina web para recetas ingeniosas.

marcos@Ubuntu:~/Desktop/Desarrollo-de-aplicaciones/GastroIngenio/backend$ docker compose up -d
[+] Running 2/2
 ✔ Network backend_default  Created                                        0.0s 
 ✔ Container backend-db-1   Started                                        0.4s 
marcos@Ubuntu:~/Desktop/Desarrollo-de-aplicaciones/GastroIngenio/backend$ docker ps
CONTAINER ID   IMAGE         COMMAND                  CREATED              STATUS              PORTS                                         NAMES
6a050872299f   postgres:17   "docker-entrypoint.s…"   About a minute ago   Up About a minute   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp   backend-db-1
marcos@Ubuntu:~/Desktop/Desarrollo-de-aplicaciones/GastroIngenio/backend$ docker exec -it 6a050872299f -d postgres
OCI runtime exec failed: exec failed: unable to start container process: exec: "-d": executable file not found in $PATH: unknown
marcos@Ubuntu:~/Desktop/Desarrollo-de-aplicaciones/GastroIngenio/backend$ docker exec -it 6a050872299f bash
root@6a050872299f:/# psql -U posgres -d gastroingenio
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  role "posgres" does not exist
root@6a050872299f:/# psql -U postgres -d gastroingenio
psql (17.7 (Debian 17.7-3.pgdg13+1))
Type "help" for help.

gastroingenio=# INSERT INTO usuarios (nombre, apellido, edad, usuario, contrasena) VALUES ('ricardo', 'rodrigues', 23, 'tini', 'nose');
INSERT 0 1
gastroingenio=# \d usuarios
gastroingenio=# SELECT * FROM usuarios
gastroingenio-# SELECT * FROM usuarios
gastroingenio-# ^C
gastroingenio=# 


marcos@Ubuntu:~/Desktop/Desarrollo-de-aplicaciones/GastroIngenio/backend$ npm run dev

> backend@1.0.0 dev
> node --watch src/index.js

[dotenv@17.2.3] injecting env (1) from .env -- tip: ⚙️  override existing env vars with { override: true }
Servidor corriendo en http://localhost:3000


