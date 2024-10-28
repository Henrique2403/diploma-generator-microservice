from bs4 import BeautifulSoup
import pdfkit
import uuid
import os

# Gerar um GUID aleatório
guid = uuid.uuid4()

name = "Henrique Copatti Cruz"
nacionality = "Mexicano"
state = "Guerrero"
bday = "24/04/2004"
document = "54140979-7"
conclusion_date = "23/10/2024"
course = "Sistemas de Informação"
workload = "70 horas"
emission_date = "23/10/2024"
signature = "copatthe"
job_position = "Analista de Suporte Técnico Jr"

html_content = f"""
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diploma</title>
    <style>
        @media print {{
            @page {{
                size: A4 landscape;
                margin: 0; /* Remove margem padrão */
            }}
            body {{
                margin: 0;
                padding: 0;
            }}
            /* Ocultar cabeçalho e rodapé padrão */
            body::before, body::after {{
                display: none;
            }}
        }}

        body {{
            font-family: 'Times New Roman', Times, serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }}
        
        .diploma-container {{
            width: 90%; /* Ajuste de largura para caber na página A4 em modo paisagem */
            max-width: 1000px; /* Garantir que não ultrapasse a largura máxima */
            margin: 0 auto;
            padding: 40px;
            background-color: white;
            box-shadow: none;
        }}

        .header {{
            text-align: center;
            font-size: 28px;
            font-weight: bold;
        }}

        .sub-header {{
            text-align: center;
            font-size: 20px;
            margin: 10px 0;
        }}

        .content {{
            margin: 40px 0;
            font-size: 18px;
            line-height: 1.5;
        }}

        .signatures {{
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
        }}

        .signature {{
            text-align: center;
        }}

        .signature p {{
            margin: 5px 0;
        }}

        .date {{
            text-align: center;
            margin-top: 40px;
            font-size: 18px;
        }}
    </style>
</head>
<body>
    <div class="diploma-container">
        <div class="header">Universidade de Programação</div>
        <div class="sub-header">Certificado de Conclusão</div>
        <div class="content">
            <p>
                Certificamos que <strong>{name}</strong>, {nacionality}, natural do Estado de {state}, nascido em {bday}, RG {document}, concluiu em {conclusion_date} o curso de {course}, nível de especialização, com carga horária de {workload} horas.
            </p>
            <p>
                Este certificado é concedido em conformidade com o artigo 44, inciso 3353, da Lei 9394/96, e com a Resolução 
                C.N.C./C.C.S. nº 01/07.
            </p>
        </div>
        <div class="date">São Paulo, {emission_date}</div>
        <div class="signatures">
            <div class="signature">
                <p><strong>{signature}</strong></p>
                <p>{job_position}</p>
            </div>            
        </div>
    </div>
</body>
</html>
"""
#Obter diretorio do projeto
base_dir = os.path.dirname(os.path.abspath(__file__))

#Caminho para salvar o pdf gerado
pdf_file_path = os.path.join(base_dir, f'{guid}.pdf')

#Definir caminho do executavel wkhtmltopdf
wkhtmltopdf_dir = os.path.join(base_dir, 'wkhtmltopdf.exe')
config = pdfkit.configuration(wkhtmltopdf=wkhtmltopdf_dir)

#Convertendo o html para pdf
pdfkit.from_string(html_content, pdf_file_path, configuration=config)
