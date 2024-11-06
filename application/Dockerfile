# Usar uma imagem base do Python
FROM python:3.9-slim

# Definir o diretório de trabalho
WORKDIR /app

# Copiar todos os arquivo para o contêiner
COPY . .

RUN pip install -r requirements.txt

# Comando para rodar a aplicação
CMD ["python", "-m", "worker.main"]