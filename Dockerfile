# Usa una imagen oficial de Node.js como base
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /src/app

# Copia solo los archivos de dependencias primero para aprovechar el cache de Docker
COPY package*.json ./

# Instala las dependencias de producción
RUN npm install --production

# Copia el resto del código fuente al contenedor
COPY . .

# (Opcional) Si tienes un script de build, descomenta la siguiente línea
# RUN npm run build

# Expone el puerto en el que la app escucha
EXPOSE 3033

# Comando por defecto para iniciar la aplicación
CMD ["npm", "start"]
