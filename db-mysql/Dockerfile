# Usar uma imagem base do MySQL
FROM mysql:5.7

# Definir variáveis de ambiente
ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=degrees_system
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=userpassword

# Copiar o script DDL para o diretório apropriado
COPY ./ddl.sql /docker-entrypoint-initdb.d/ddl.sql