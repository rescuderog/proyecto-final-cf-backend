# Proyecto Final de Bootcamp Javascript en el Backend - Código Facilito

En este proyecto se crea una aplicación backend utilizando NestJS en la que se pidió se puedan completar los siguientes requerimientos:

### **Usuarios**

- **`POST /users`** - Registro de nuevos usuarios. Cada usuario debe tener nombre de usuario, contraseña, y un booleano isAdmin
- **`POST /users/login`** - Inicio de sesión para usuarios.
- **`GET /users`** - Listado de usuarios
- **`GET /users/{id}`** - Obtener detalles de un usuario específico.
- **`PUT /users/{id}`** - Actualizar un usuario específico (solo su propio perfil o si es administrador).
- **`DELETE /users/{id}`** - Eliminar un usuario (solo administradores).

### **Posts**

- **`POST /posts`** - Crear un nuevo post (solo usuarios registrados). Los post tendrán id, título, autor, contenido y un array de categorías
- **`GET /posts`** - Listado de todos los posts. Debe admitir parámetros para paginar resultados (el default de resultados si no hay param será 10)
- **`GET /posts/{id}`** - Ver detalles de un post específico.
- **`PUT /posts/{id}`** - Actualizar un post (solo el autor o administradores).
- **`DELETE /posts/{id}`** - Eliminar un post (solo el autor o administradores).
- **`GET /posts/user/{userId}`** - Ver todos los posts de un usuario específico.

### **Búsqueda y Filtrado**

- **`GET /posts/search`** - Buscar posts por título, contenido, etc. Debe admitir parámetros para paginar resultados (el default de resultados si no hay param será 10)
- **`GET /posts/filter`** - Endpoints adicionales para filtrar posts por categoría o autor

### **Administración**

- **`GET /admin/users`** - Obtener todos los usuarios (solo administradores).
- **`DELETE /admin/users/{id}`** - Eliminar usuarios (solo administradores).
- **`GET /admin/posts`** - Obtener todos los posts con opciones de moderación (borrar o editar) (solo administradores).




## Requerimientos

NodeJS 20.11, npm como gestor de paquetes, y MongoDB.
## Cómo lanzar la aplicación

Una vez clonado el repositorio localmente, hay un paso previo para iniciar esta aplicación y es el realizar una copia del archivo .env.example a .env y completar en el parámetro `DB_URI`, la URI hacia la instancia de MongoDB que se vaya a utilizar, y en el parámetro `JWT_SECRET`, ingresar una palabra que servirá como semilla para generar el Token JWT.

Luego, se podrá simplemente hacer un 

```
npm install && npm run start:dev
```

para correr la aplicación en modo desarrollo.
## Autenticación

Como fue pedido en la consigna, se agregó una capa de autenticación mediante el uso de Passport, donde mediante el endpoint `GET /users/login` se realiza el login, devolviendo un token JWT, que luego deberá viajar como Bearer Token en el header de cada request a endpoints protegidos. 

En cuanto a los endpoints protegidos, en todos existen validaciones para chequear los permisos de los usuarios, devolviendo un 401 en caso de no tener los permisos suficientes.
## Testing

A decir verdad, fue lo que más tiempo me llevó. Se hizo en Jest (que es lo que recomienda NestJS por default), y los test unitarios se encuentran en la carpeta ./test. Se pueden correr con el siguiente comando:

```
npm test
```

En un principio, se estaba mockeando todas y cada una de las funciones de mongoose utilizadas en los servicios, pero luego descubrí el magnífico paquete `mongodb-memory-server`, que crea un servidor en memoria de MongoDB, y entonces no es necesario realizar mocks de las mismas.

La cobertura del testing alcanza a casi todas las funciones utilizadas en los servicios del módulo Users y Posts, con excepción de aquellas de Filtrado y Búsquedas, que se incluirían en próximas versiones, dado que no llegué con los plazos.

Otra tarea pendiente sería incluir end to end test para testear los endpoints.
## Documentación

Más allá de este readme, una vez iniciada la aplicación, se podrá acceder por la ruta `/api/docs` a una instancia de Swagger con todos los endpoints correspondientes documentados. Se podrá asimismo probar aquellos endpoints que se encuentran asegurados a través de la función de Swagger para aceptar Bearer Tokens que se encuentra configurada.

En cuanto a los servicios, los mismos se encuentran comentados de acuerdo al estilo JSDoc. Se ha intentado observar un tipado sumamente estricto para que esto también ayude al fácil y rápido entendimiento de las funciones cuando son observadas desde un IDE.
## Pendientes/TODO

Por desgracia, y por cuestiones de tiempo, no se ha podido culminar el desarrollo de todos los endpoints, quedando como pendiente el desarrollo del módulo de Administración.

Otra tarea pendiente fue, como se mencionó anteriormente, realizar el testing end to end correspondiente, y ampliar la cobertura de los tests unitarios a aquellos métodos que no fueron todavía cubiertos en los servicios (que son, de igual manera, más bien pocos).
## Conclusión

El presente proyecto resultó una oportunidad de aprendizaje sumamente rica, dado que ayudó a terminar de familiarizarme con la estructura de NestJS, además de incorporar herramientas como Jest o MongoDB (y su ORM, Mongoose), y seguirá siendo trabajado para la conclusión de los requerimientos iniciales.