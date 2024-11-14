# Aplicação para Geração de Certificados

Esta aplicação expõe duas APIs para a geração de certificados em formato PDF. Através do comando `docker-compose up`, você pode facilmente subir a aplicação e utilizar as funcionalidades de criar e acessar certificados.

## APIs Disponíveis

### 1. **POST** `/degree`

A API de criação de certificados recebe um corpo em formato JSON contendo os dados do aluno e do curso. Ao receber a requisição, a aplicação gera um certificado em PDF com as informações passadas no corpo da requisição e faz o download do arquivo PDF gerado.

#### Exemplo de Requisição

- **URL:** `http://localhost:3000/degree`
- **Método:** `POST`
- **Body raw (JSON):**

```json
{
   "student_name": "João Silva",
   "nacionality": "Brasileiro",
   "state": "São Paulo",
   "birthday": "1990-05-20",
   "document": "12345678901",
   "conclusion_date": "2023-07-15",
   "course": "Engenharia de Software",
   "workload": "240 horas",
   "name": "Maria Oliveira",
   "job_position": "Coordenadora de Cursos"
}
```

**Curl para testes com **POST**:**

```
  curl --location 'http://localhost:3000/degree/' \
--header 'Content-Type: application/json' \
--data '{
   "student_name":"João Silva",
   "nacionality":"Brasileiro",
   "state":"São Paulo",
   "birthday":"1990-05-20",
   "document":"12345678901",
   "conclusion_date":"2023-07-15",
   "course":"Engenharia de Software",
   "workload":"240 horas",
   "name":"Maria Oliveira",
   "job_position":"Coordenadora de Cursos"
}'
```

### 2. **GET** `/degree/{id}`

Esse endpoint permite acessar e baixar o PDF do certificado usando o id do certificado gerado na etapa anterior.

#### Exemplo de Requisição

- **URL:** `http://localhost:3000/degree/{id}`
- **Método:** `GET`

**CURL para testes com **GET**:**

```
curl --location --request GET 'http://localhost:3000/degree/' \
--header 'Content-Type: application/json' \
--data '{
   "student_name":"João Silva",
   "nacionality":"Brasileiro",
   "state":"São Paulo",
   "birthday":"1990-05-20",
   "document":"12345678901",
   "conclusion_date":"2023-07-15",
   "course":"Engenharia de Software",
   "workload":"240 horas",
   "name":"Maria Oliveira",
   "job_position":"Coordenadora de Cursos"
}'
```
