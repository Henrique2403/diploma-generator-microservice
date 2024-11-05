# Usar uma imagem base do Python
FROM python:3.9-slim

# Definir o diretório de trabalho
WORKDIR /app

RUN pip install -r requirements.txt

# Copiar o arquivo main.py para o contêiner
COPY . .

# Comando para rodar a aplicação
CMD ["python", "main.py"]