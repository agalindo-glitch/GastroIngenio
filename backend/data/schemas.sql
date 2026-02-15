CREATE TABLE usuarios (id SERIAL PRIMARY KEY, nombre VARCHAR(30) NOT NULL, apellido VARCHAR(30) NOT NULL, edad INTEGER NOT NULL, usuario VARCHAR(30) UNIQUE NOT NULL, contrasena VARCHAR(50) NOT NULL, foto_perfil TEXT);

CREATE TABLE recetas (id SERIAL PRIMARY KEY, id_usuario INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE, nombre VARCHAR(50) NOT NULL, ingredientes TEXT[] NOT NULL, descripcion TEXT NOT NULL, tiempo_preparacion INTEGER CHECK (tiempo_preparacion >= 0), comensales INTEGER CHECK (comensales > 0), imagen_url TEXT, elegida_comunidad BOOLEAN DEFAULT FALSE, fecha_creacion TIMESTAMPTZ DEFAULT NOW());

CREATE TABLE pasos (id SERIAL PRIMARY KEY, id_receta INTEGER NOT NULL REFERENCES recetas(id), numero_paso INTEGER NOT NULL, descripcion TEXT NOT NULL, imagen_url TEXT);

CREATE TABLE comentarios (id SERIAL PRIMARY KEY, id_usuario INTEGER, id_receta INTEGER, descripcion TEXT NOT NULL, likes INTEGER DEFAULT 0, dislikes INTEGER DEFAULT 0, puntaje INTEGER DEFAULT 0, FOREIGN KEY (id_usuario) REFERENCES usuarios(id), FOREIGN KEY (id_receta) REFERENCES recetas(id));


-insertar clientes de prueba-

INSERT INTO usuarios (nombre, apellido, edad, usuario, contrasena, foto_perfil) VALUES ('Lucía','Fernández',22,'luciadev','pass1234','https://images.unsplash.com/photo-1494790108377-be9c29b29330'),('Mateo','Gómez',28,'mateog','pass1234','https://images.unsplash.com/photo-1500648767791-00dcc994a43e'),('Sofía','Ramírez',19,'sofiar','pass1234','https://images.unsplash.com/photo-1544005313-94ddf0286df2'),('Tomás','López',35,'tomasl','pass1234','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d'),('Valentina','Suárez',24,'valens','pass1234','https://images.unsplash.com/photo-1534528741775-53994a69daeb'),('Bruno','Martínez',31,'chefbruno','pass1234','https://images.unsplash.com/photo-1556910103-1c02745aae4d'),('Camila','Torres',27,'camilacocina','pass1234','https://images.unsplash.com/photo-1607631568010-a87245c0daf8'),('Julián','Pereyra',21,'julichef','pass1234','https://images.unsplash.com/photo-1583394293214-28ded15ee548'),('Martina','Castro',33,'martinarecetas','pass1234','https://images.unsplash.com/photo-1556911220-bff31c812dba'),('Ignacio','Ruiz',26,'nachocook','pass1234','https://images.unsplash.com/photo-1563720223185-11003d516935'),('Agustina','Molina',18,'agusm','pass1234','https://images.unsplash.com/photo-1524504388940-b1c1722653e1'),('Federico','Navarro',40,'feden','pass1234','https://images.unsplash.com/photo-1547425260-76bcadfb4f2c'),('Carolina','Ibarra',29,'caroi','pass1234','https://images.unsplash.com/photo-1488426862026-3ee34a7d66df'),('Nicolás','Silva',23,'nico_s','pass1234','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'),('Paula','Benítez',36,'paulab','pass1234','https://images.unsplash.com/photo-1544725176-7c40e5a2c9f9'),('Emiliano','Acosta',20,'emilac','pass1234','https://images.unsplash.com/photo-1527980965255-d3b416303d12'),('Florencia','Rojas',25,'florrr','pass1234','https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e'),('Leandro','Herrera',34,'leanh','pass1234','https://images.unsplash.com/photo-1552058544-f2b08422138a'),('Milagros','Vega',21,'mili_v','pass1234','https://images.unsplash.com/photo-1517841905240-472988babdf9'),('Ramiro','Quiroga',38,'ramq','pass1234','https://images.unsplash.com/photo-1542178243-bc20204b769f'),('Daniela','Paz',24,'dani_p','pass1234','https://images.unsplash.com/photo-1499951360447-b19be8fe80f5'),('Sebastián','Ortega',30,'sebaort','pass1234','https://images.unsplash.com/photo-1504257432389-52343af06ae3'),('Rocío','Luna',19,'rociol','pass1234','https://images.unsplash.com/photo-1548142813-c348350df52b'),('Guido','Santos',45,'guidos','pass1234','https://images.unsplash.com/photo-1502767089025-6572583495b0'),('Belén','Correa',27,'belec','pass1234','https://images.unsplash.com/photo-1544005316-04ce1d3c0d40'),('Franco','Delgado',22,'frandel','pass1234','https://images.unsplash.com/photo-1541534401786-2077eed87a72'),('Lorena','Méndez',37,'lorem','pass1234','https://images.unsplash.com/photo-1487412720507-e7ab37603c6f'),('Axel','Fuentes',18,'axelf','pass1234','https://images.unsplash.com/photo-1519345182560-3f2917c472ef'),('Noelia','Campos',26,'noecam','pass1234','https://images.unsplash.com/photo-1520813792240-56fc4a3765a7'),('Hernán','Salas',41,'hernans','pass1234','https://images.unsplash.com/photo-1502685104226-ee32379fefbe');
INSERT INTO recetas (id_usuario, nombre, ingredientes, pasos, descripcion, tiempo_preparacion, comensales, imagen_url, elegida_comunidad) VALUES (1,'Pasta Cremosa','{Pasta,Crema,Ajo,Queso}','{Hervir pasta,Saltear ajo,Agregar crema,Mezclar}','Una pasta suave y deliciosa',25,2,'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb',true),(2,'Hamburguesa Clásica','{Pan,Carne,Queso,Lechuga}','{Cocinar carne,Armar hamburguesa}','La burger de siempre',20,1,'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',false),(3,'Ensalada Fresh','{Lechuga,Tomate,Palta}','{Cortar ingredientes,Mezclar}','Ligera y saludable',10,1,'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',false),(4,'Pizza Casera','{Harina,Tomate,Queso}','{Preparar masa,Hornear}','Pizza estilo hogar',40,3,'https://images.unsplash.com/photo-1513104890138-7c749659a591',true),(5,'Tostadas Gourmet','{Pan,Queso,Huevo}','{Tostar pan,Agregar toppings}','Ideal desayuno',15,1,'https://images.unsplash.com/photo-1525351484163-7529414344d8',false),(6,'Risotto de Hongos','{Arroz,Hongos,Caldo}','{Cocinar arroz,Agregar caldo}','Cremoso y elegante',35,2,'https://images.unsplash.com/photo-1473093295043-cdd812d0e601',true),(7,'Tarta de Verduras','{Masa,Zapallito,Cebolla}','{Preparar relleno,Hornear}','Perfecta para almuerzo',30,3,'https://images.unsplash.com/photo-1604908176997-4318cfe0d6d8',false),(8,'Ramen Casero','{Fideos,Caldo,Huevo}','{Preparar caldo,Hervir fideos}','Reconfortante',45,2,'https://images.unsplash.com/photo-1557872943-16a5ac26437e',true),(9,'Brownie Chocolatoso','{Chocolate,Manteca,Huevos}','{Mezclar,Hornear}','Explosión de chocolate',35,4,'https://images.unsplash.com/photo-1606313564200-e75d5e30476c',true),(10,'Wrap Saludable','{Tortilla,Pollo,Vegetales}','{Armar wrap}','Rápido y rico',12,1,'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',false),(11,'Smoothie Frutal','{Banana,Frutilla,Leche}','{Licuar}','Refrescante',5,1,'https://images.unsplash.com/photo-1505252585461-04db1eb84625',false),(12,'Asado Argentino','{Carne,Sal,Carbón}','{Prender fuego,Cocinar carne}','Clásico nacional',90,5,'https://images.unsplash.com/photo-1558030006-450675393462',true),(13,'Milanesa Crujiente','{Carne,Huevo,Pan rallado}','{Empanar,Fritar}','Favorita de todos',25,2,'https://images.unsplash.com/photo-1604908554165-e0baf6f0d3d0',false),(14,'Sushi Simple','{Arroz,Pescado,Alga}','{Armar rolls}','Minimalista',50,2,'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',true),(15,'Cheesecake','{Queso crema,Galletas,Manteca}','{Preparar base,Refrigerar}','Postre cremoso',60,6,'https://images.unsplash.com/photo-1533134242443-d4fd215305ad',true),(16,'Omelette Fit','{Huevos,Queso}','{Batir huevos,Cocinar}','Proteico',8,1,'https://images.unsplash.com/photo-1510693206972-df098062cb71',false),(17,'Panqueques','{Harina,Leche,Huevos}','{Mezclar,Cocinar}','Desayuno perfecto',15,2,'https://images.unsplash.com/photo-1528207776546-365bb710ee93',false),(18,'Empanadas','{Masa,Carne,Cebolla}','{Preparar relleno,Hornear}','Bien criollas',45,4,'https://images.unsplash.com/photo-1601050690597-df0568f70950',true),(19,'Helado Casero','{Leche,Azúcar,Vainilla}','{Congelar}','Dulce placer',120,3,'https://images.unsplash.com/photo-1563805042-7684c019e1cb',false),(20,'Sandwich Completo','{Pan,Jamón,Queso}','{Armar sandwich}','Simple pero efectivo',6,1,'https://images.unsplash.com/photo-1528731708534-816fe59f90cb',false),(21,'Tacos','{Tortillas,Carne,Salsa}','{Rellenar tacos}','Picantes y sabrosos',20,2,'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b',true),(22,'Pollo al Horno','{Pollo,Papas,Especias}','{Hornear}','Dominguero',70,4,'https://images.unsplash.com/photo-1604908177522-4024a7d182d4',false),(23,'Budín','{Harina,Azúcar,Huevos}','{Hornear}','Ideal merienda',40,5,'https://images.unsplash.com/photo-1606312619344-8f33b6b6dadd',false),(24,'Paella','{Arroz,Mariscos,Azafrán}','{Cocinar ingredientes}','Festiva',55,4,'https://images.unsplash.com/photo-1534080564583-6be75777b70a',true),(25,'Bagel','{Bagel,Queso crema}','{Armar}','Estilo café',5,1,'https://images.unsplash.com/photo-1550507992-eb63ffee0847',false),(26,'Nachos','{Nachos,Queso,Salsa}','{Derretir queso}','Snack ideal',10,3,'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d',false),(27,'Sopa Casera','{Verduras,Caldo}','{Hervir}','Reconfortante',30,2,'https://images.unsplash.com/photo-1547592180-85f173990554',false),(28,'Hot Dog','{Pan,Salchicha,Salsas}','{Armar}','Street food vibes',7,1,'https://images.unsplash.com/photo-1550547660-d9450f859349',false),(29,'Waffles','{Harina,Huevos,Leche}','{Cocinar en wafflera}','Desayuno top',18,2,'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0',true),(30,'Parrillada','{Carne,Chorizo,Morcilla}','{Cocinar en parrilla}','Para compartir',80,5,'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba',true);
INSERT INTO comentarios (id_usuario,id_receta,descripcion,likes,dislikes,puntaje) VALUES (1,1,'Me salvó la cena',10,1,5),(2,1,'Rica pero le faltó sal',3,2,2),(3,1,'Muy cremosa',6,0,4),(4,1,'No me convenció',1,4,1),(5,2,'Clásica y efectiva',5,0,4),(6,2,'La carne quedó seca',2,3,1),(7,2,'Buenísima',7,0,5),(8,2,'Normalita',1,1,3),(9,3,'Súper fresca',4,0,4),(10,3,'Muy simple',1,2,2),(11,3,'Ideal para dieta',6,0,5),(12,3,'No es lo mío',0,3,0),(13,4,'La masa espectacular',9,0,5),(14,4,'Buen sabor',3,0,4),(15,4,'Esperaba más',1,2,2),(16,4,'Riquísima',6,0,5),(17,5,'Desayuno top',4,0,5),(18,5,'Muy básico',1,1,2),(19,5,'Me encantaron',5,0,4),(20,5,'No repetiría',0,2,1),(21,6,'Cremoso perfecto',8,0,5),(22,6,'Buen plato',3,0,4),(23,6,'Algo insípido',1,2,2),(24,6,'Demasiado pesado',0,3,1),(25,7,'Muy rica',4,0,4),(26,7,'Buen relleno',2,0,3),(27,7,'Nada especial',1,1,2),(28,7,'Excelente tarta',6,0,5),(29,8,'Caldo increíble',7,0,5),(30,8,'Muy elaborado',2,0,4),(1,8,'No me salió',0,4,0),(2,8,'Buenísimo',5,0,5),(3,9,'Chocolate puro',11,0,5),(4,9,'Muy dulce',1,1,3),(5,9,'Perfecto',6,0,5),(6,9,'Pesado',0,2,1),(7,10,'Ideal rápido',3,0,4),(8,10,'Buen sabor',2,0,3),(9,10,'Muy seco',0,2,1),(10,10,'Correcto',1,1,2),(11,11,'Muy refrescante',4,0,5),(12,11,'Simple',1,0,3),(13,11,'Nada wow',0,2,2),(14,11,'Delicioso',6,0,5),(15,12,'Asado brutal',15,0,5),(16,12,'Buenísimo',6,0,5),(17,12,'Muy salado',1,3,2),(18,12,'Regular',0,1,3),(19,13,'Crujiente perfecto',5,0,5),(20,13,'Muy rica',3,0,4),(21,13,'No me gustó',0,3,1),(22,13,'Correcta',1,1,2),(23,14,'Buen sushi',4,0,4),(24,14,'Muy simple',1,0,3),(25,14,'Excelente',6,0,5),(26,14,'Insípido',0,2,1),(27,15,'Postre increíble',8,0,5),(28,15,'Muy pesado',0,2,2),(29,15,'Perfecto',5,0,5),(30,15,'Regular',1,1,3),(1,16,'Buen desayuno',3,0,4),(2,16,'Muy básico',0,1,2),(3,16,'Riquísimo',4,0,5),(4,16,'Nada especial',1,0,3),(5,17,'Panqueques top',6,0,5),(6,17,'Muy buenos',3,0,4),(7,17,'No salieron bien',0,3,1),(8,17,'Correctos',1,1,3),(9,18,'Empanadas brutales',10,0,5),(10,18,'Muy ricas',4,0,4),(11,18,'Relleno flojo',1,2,2),(12,18,'Malas',0,5,0),(13,19,'Refrescante',3,0,4),(14,19,'Muy dulce',1,0,3),(15,19,'Excelente',5,0,5),(16,19,'No me gustó',0,2,1),(17,20,'Simple y rico',2,0,4),(18,20,'Nada wow',0,1,2),(19,20,'Correcto',1,0,3),(20,20,'Muy seco',0,2,1),(21,21,'Tacos increíbles',7,0,5),(22,21,'Muy buenos',3,0,4),(23,21,'Demasiado picante',1,2,2),(24,21,'Malos',0,4,0),(25,22,'Muy jugoso',4,0,5),(26,22,'Buen sabor',2,0,4),(27,22,'Regular',1,1,3),(28,22,'Seco',0,2,1),(29,23,'Budín perfecto',6,0,5),(30,23,'Muy rico',3,0,4),(1,23,'Nada especial',0,1,2),(2,23,'No repetiría',0,3,1),(3,24,'Paella brutal',9,0,5),(4,24,'Muy sabrosa',4,0,5),(5,24,'Esperaba más',1,2,2),(6,24,'Regular',0,1,3),(7,25,'Correcto',1,0,3),(8,25,'Muy simple',0,0,2),(9,25,'Rico',2,0,4),(10,25,'Nada especial',0,1,2),(11,26,'Snack top',4,0,5),(12,26,'Muy buenos',2,0,4),(13,26,'Regular',1,1,3),(14,26,'Malos',0,3,1),(15,27,'Reconfortante',3,0,5),(16,27,'Buenísima',4,0,4),(17,27,'Muy sosa',0,2,1),(18,27,'Correcta',1,0,3),(19,28,'Muy bueno',2,0,4),(20,28,'Correcto',1,0,3),(21,28,'Nada wow',0,1,2),(22,28,'Feo',0,4,0),(23,29,'Waffles increíbles',8,0,5),(24,29,'Muy buenos',3,0,4),(25,29,'Muy secos',0,2,1),(26,29,'Correctos',1,0,3),(27,30,'Parrillada top',10,0,5),(28,30,'Buenísima',4,0,5),(29,30,'Regular',1,1,3),(30,30,'No me gustó',0,3,1),(5,1,'Quedó espectacular',7,0,5),(6,4,'Muy buena receta',3,0,4),(7,9,'Una locura',9,0,5),(8,12,'Buen asado',5,0,4),(9,18,'Muy ricas empanadas',4,0,4),(10,24,'Excelente plato',6,0,5),(11,3,'No está mal',1,0,3),(12,6,'Algo pesado',0,1,2),(13,10,'Buenísimo',3,0,5),(14,15,'Muy rico',2,0,4),(15,20,'Demasiado simple',0,1,2),(16,21,'Gran sabor',5,0,5),(17,22,'Muy bueno',2,0,4),(18,23,'Correcto',1,0,3),(19,24,'Riquísima',4,0,5),(20,25,'Nada especial',0,0,2),(21,26,'Muy ricos',3,0,4),(22,27,'Gran sopa',4,0,5),(23,28,'Correcto',1,0,3),(24,29,'Muy buenos',2,0,4),(25,30,'Excelente',6,0,5),(26,2,'No estuvo mal',1,0,3);
INSERT INTO pasos (id_receta,numero_paso,descripcion,imagen_url) VALUES (1,1,'Hervir abundante agua con sal','https://images.unsplash.com/photo-1525755662778-989d0524087e'),(1,2,'Cocinar la pasta hasta punto al dente','https://images.unsplash.com/photo-1556761175-5973dc0f32e7'),(1,3,'Saltear ajo en manteca','https://images.unsplash.com/photo-1512058564366-c9e3c5b2db0e'),(1,4,'Agregar crema y mezclar','https://images.unsplash.com/photo-1473093295043-cdd812d0e601'),(1,5,'Incorporar la pasta','https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb'),(1,6,'Servir con queso rallado','https://images.unsplash.com/photo-1546549032-9571cd6b27df'),(2,1,'Sellar la carne en sartén caliente','https://images.unsplash.com/photo-1550547660-d9450f859349'),(2,2,'Fundir el queso','https://images.unsplash.com/photo-1568901346375-23c9450c58cd'),(2,3,'Armar la hamburguesa','https://images.unsplash.com/photo-1550317138-10000687a72b'),(3,1,'Lavar los vegetales','https://images.unsplash.com/photo-1505576399279-565b52d4ac71'),(3,2,'Cortar ingredientes','https://images.unsplash.com/photo-1498837167922-ddd27525d352'),(3,3,'Mezclar y condimentar','https://images.unsplash.com/photo-1546069901-ba9599a7e63c'),(4,1,'Preparar la masa','https://images.unsplash.com/photo-1509440159596-0249088772ff'),(4,2,'Agregar salsa','https://images.unsplash.com/photo-1513104890138-7c749659a591'),(4,3,'Cubrir con queso','https://images.unsplash.com/photo-1548365328-9f547fb0953d'),(4,4,'Hornear','https://images.unsplash.com/photo-1499028344343-cd173ffc68a9'),(5,1,'Tostar el pan','https://images.unsplash.com/photo-1525351484163-7529414344d8'),(5,2,'Agregar toppings','https://images.unsplash.com/photo-1484723091739-30a097e8f929'),(6,1,'Saltear hongos','https://images.unsplash.com/photo-1504674900247-0877df9cc836'),(6,2,'Agregar arroz','https://images.unsplash.com/photo-1473093295043-cdd812d0e601'),(6,3,'Incorporar caldo gradualmente','https://images.unsplash.com/photo-1467003909585-2f8a72700288'),(6,4,'Revolver hasta cremosidad','https://images.unsplash.com/photo-1556761175-5973dc0f32e7'),(6,5,'Servir','https://images.unsplash.com/photo-1473093295043-cdd812d0e601'),(7,1,'Preparar relleno','https://images.unsplash.com/photo-1604908176997-4318cfe0d6d8'),(7,2,'Rellenar masa','https://images.unsplash.com/photo-1514517220031-ec0b7fbf5f8a'),(7,3,'Hornear','https://images.unsplash.com/photo-1509440159596-0249088772ff'),(8,1,'Preparar caldo','https://images.unsplash.com/photo-1557872943-16a5ac26437e'),(8,2,'Hervir fideos','https://images.unsplash.com/photo-1525755662778-989d0524087e'),(8,3,'Agregar toppings','https://images.unsplash.com/photo-1512058564366-c9e3c5b2db0e'),(9,1,'Derretir chocolate','https://images.unsplash.com/photo-1519681393784-d120267933ba'),(9,2,'Mezclar ingredientes','https://images.unsplash.com/photo-1606313564200-e75d5e30476c'),(9,3,'Hornear','https://images.unsplash.com/photo-1509440159596-0249088772ff'),(10,1,'Calentar tortilla','https://images.unsplash.com/photo-1552332386-f8dd00dc2f85'),(10,2,'Agregar relleno','https://images.unsplash.com/photo-1504674900247-0877df9cc836'),(10,3,'Enrollar','https://images.unsplash.com/photo-1552332386-f8dd00dc2f85'),(11,1,'Licuar frutas','https://images.unsplash.com/photo-1505252585461-04db1eb84625'),(12,1,'Prender fuego','https://images.unsplash.com/photo-1558030006-450675393462'),(12,2,'Preparar carnes','https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba'),(12,3,'Cocinar lentamente','https://images.unsplash.com/photo-1544025162-d76694265947'),(12,4,'Servir','https://images.unsplash.com/photo-1558030006-450675393462'),(13,1,'Empanar carne','https://images.unsplash.com/photo-1604908554165-e0baf6f0d3d0'),(13,2,'Freír','https://images.unsplash.com/photo-1550547660-d9450f859349'),(14,1,'Armar rolls','https://images.unsplash.com/photo-1579584425555-c3ce17fd4351'),(15,1,'Preparar base','https://images.unsplash.com/photo-1533134242443-d4fd215305ad'),(15,2,'Agregar relleno','https://images.unsplash.com/photo-1514517220031-ec0b7fbf5f8a'),(15,3,'Refrigerar','https://images.unsplash.com/photo-1492724441997-5dc865305da7'),(16,1,'Batir huevos','https://images.unsplash.com/photo-1510693206972-df098062cb71'),(16,2,'Cocinar','https://images.unsplash.com/photo-1490645935967-10de6ba17061'),(17,1,'Mezclar masa','https://images.unsplash.com/photo-1528207776546-365bb710ee93'),(17,2,'Cocinar','https://images.unsplash.com/photo-1504754524776-8f4f37790ca0'),(18,1,'Preparar relleno','https://images.unsplash.com/photo-1601050690597-df0568f70950'),(18,2,'Armar empanadas','https://images.unsplash.com/photo-1544025162-d76694265947'),(18,3,'Hornear','https://images.unsplash.com/photo-1509440159596-0249088772ff'),(19,1,'Mezclar ingredientes','https://images.unsplash.com/photo-1563805042-7684c019e1cb'),(19,2,'Congelar','https://images.unsplash.com/photo-1492724441997-5dc865305da7'),(20,1,'Armar sandwich','https://images.unsplash.com/photo-1528731708534-816fe59f90cb'),(21,1,'Preparar relleno','https://images.unsplash.com/photo-1551504734-5ee1c4a1479b'),(21,2,'Rellenar tortillas','https://images.unsplash.com/photo-1604908177522-4024a7d182d4'),(22,1,'Condimentar pollo','https://images.unsplash.com/photo-1604908177522-4024a7d182d4'),(22,2,'Hornear','https://images.unsplash.com/photo-1499028344343-cd173ffc68a9'),(23,1,'Preparar mezcla','https://images.unsplash.com/photo-1606312619344-8f33b6b6dadd'),(23,2,'Hornear','https://images.unsplash.com/photo-1509440159596-0249088772ff'),(24,1,'Saltear ingredientes','https://images.unsplash.com/photo-1534080564583-6be75777b70a'),(24,2,'Agregar arroz','https://images.unsplash.com/photo-1467003909585-2f8a72700288'),(24,3,'Cocinar','https://images.unsplash.com/photo-1534080564583-6be75777b70a'),(25,1,'Untar queso crema','https://images.unsplash.com/photo-1550507992-eb63ffee0847'),(26,1,'Agregar queso','https://images.unsplash.com/photo-1513456852971-30c0b8199d4d'),(27,1,'Hervir verduras','https://images.unsplash.com/photo-1547592180-85f173990554'),(28,1,'Armar hot dog','https://images.unsplash.com/photo-1550547660-d9450f859349'),(29,1,'Preparar mezcla','https://images.unsplash.com/photo-1504754524776-8f4f37790ca0'),(29,2,'Cocinar en wafflera','https://images.unsplash.com/photo-1528207776546-365bb710ee93'),(30,1,'Cocinar carnes','https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba'),(30,2,'Servir','https://images.unsplash.com/photo-1558030006-450675393462');

-comando para enviar una peticion HTTP POST desde la terminal-
(se envia un JSON como un body para poder probar el post)







-- PRUEBAS DEV
-- //1- pruebo de forma ideal (pasa)
-- curl -X POST \
-- -d '{"nombre":"matias", "apellido":"zapata", "edad":23, "usuario":"sergio44", "contrasena":"todomas"}'\
-- -H "Content-Type: application/json" \
-- http://localhost:3000/usuarios

-- curl -X POST \
-- -d '{"id_usuario":1,"nombre":"Tarta de verdu","descripcion":"tarta echa con verdura","tiempo_preparacion":30,"categoria":"comida","elegidos_comunidad":"false","review":0}' \
-- -H "Content-Type: application/json" \
-- http://localhost:3000/recetas

-- curl -X POST \
-- -H "Content-Type: application/json" \
-- -d '{"id_usuario":1,"id_receta":1,"descripcion":"Muy buena la receta","likes":0,"dislikes":0}' \
-- http://localhost:3000/comentarios

-- curl -X POST -H \
-- "Content-Type: application/json" \
-- -d '{"usuario":"sergio44","contrasena":"todomas"}' \
-- http://localhost:3000/login





-- //2- pruebo errores del post en usuarios, dejo un espacio en blanco en apellido (marca error)
-- curl -X POST \
-- -d '{"nombre":"aaaaa", "apellido":"", "edad":20, "usuario":"gsgwg", "contrasena":"elmascapo"}' \
-- -H "Content-Type: application/json" \
-- http://localhost:3000/usuarios

-- //2- pruebo errores de recetas, descripcion vacia (se espera error 400)

-- curl -X POST \
-- -H "Content-Type: application/json" \
-- -d '{"id_usuario":1,"descripcion":"","tiempo_preparacion":30,"categoria":"comida", "elegidos_comunidad":"false","review":0}' \
-- http://localhost:3000/recetas


-- //2- pruebo erores de los comentarios, descripcion vacia (marca error 400)

-- curl -X POST \
-- -H "Content-Type: application/json" \
-- -d '{"id_usuario":1,"id_receta":1,"descripcion":"","likes":0,"dislikes":0}' \
-- http://localhost:3000/comentarios




-- //3- pruebo errores del post en usuarios, no pongo el apellido (marca error)
-- curl -X POST \
-- -d '{"nombre":"aaaaa", "edad":20, "usuario":"gsgwg", "contrasena":"elmascapo"}' \
-- -H "Content-Type: application/json" \
-- http://localhost:3000/usuarios

-- //3- pruebo errores de la receta, falta un campo obligatorio, no pongo la descripcion ( se espera error 400 )
-- curl -X POST \
-- -H "Content-Type: application/json" \
-- -d '{"id_usuario":1,"tiempo_preparacion":30,"categoria":"comida", "elegidos_comunidad":"false","review":0}' \
-- http://localhost:3000/recetas

-- //3- receta con usuario indexistente (se espera error 400 o 404)

-- curl -X POST \
-- -H "Content-Type: application/json" \
-- -d '{"id_usuario":999,"nombre":"Error","descripcion":"No existe el usuario","tiempo_preparacion":10,"categoria":"comida"}' \
-- http://localhost:3000/recetas


-- //3- pruebo errores de los comentarios, falta la descripcion (se espera error 400 )
-- curl -X POST \

-- -H "Content-Type: application/json" \
-- -d '{"id_usuario":1,"id_receta":1, "likes":0,"dislikes":0}' \
-- http://localhost:3000/comentarios

-- //3- POST comentario con receta inexistente (se espera error 400 o 404)
-- curl -X POST \
-- -H "Content-Type: application/json" \
-- -d '{"id_usuario":1,"id_receta":999,"descripcion":"Prueba"}' \
-- http://localhost:3000/comentarios

-- //3 -usuario indexistente (se espera error 400 o 404)

-- curl -X POST \
-- -H "Content-Type: application/json" \
-- -d '{"id_usuario":999,"id_receta":1,"descripcion":"Prueba"}' \
-- http://localhost:3000/comentarios




-- -comando para enviar una peticion HTTP DELETE desde la terminal-

-- //1- elimino un usuario de la base de datos

-- curl -X DELETE \
-- http://localhost:3000/usuarios/2

-- //-1 elimino una receta de la base de datos dado su id

-- curl -X DELETE \
-- -H "Content-Type: application/json" \
-- -d '{"id": 1}' \
-- http://localhost:3000/recetas

-- //-1 elimino un comentario de la base de datos dado su id

-- curl -X DELETE \
-- -H "Content-Type: application/json" \
-- -d '{"id": 2}' \
-- http://localhost:3000/comentarios

-- -comando para enviar una peticion HTTP PUT desde la terminal-

-- //1- modifico un usuario de la base de datos

-- curl -X PUT \
-- -H "Content-Type: application/json" \
-- -d '{"nombre": "Juan", "apellido": "Pérez", "edad": 25, "usuario": "juanperez", "contrasena": "nuevacontra"}' \
-- http://localhost:3000/usuarios/1

-- //-1 modifico una receta de la base de datos

-- curl -X PUT \
-- -H "Content-Type: application/json" \
-- -d '{"id_usuario":1,"nombre":"Pizza casera","descripcion": "Pizza casera mejorada","tiempo_preparacion": 40,"categoria": "comida","elegidos_comunidad":"false","review":0}' \
-- http://localhost:3000/recetas/1

-- //-1 modifico un comentario especifico de la base de datos 
-- curl -X PUT \
-- -H "Content-Type: application/json" \
-- -d '{"id_usuario":1,"id_receta":1,"descripcion": "Excelente receta, muy clara", "likes": 3, "dislikes": 0}' \
-- http://localhost:3000/comentarios/1


