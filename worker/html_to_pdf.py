import pdfkit
import uuid
from pathlib import Path

def load_html(file_path: Path) -> str:
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def update_html(html_content: str, person_informations: dict[str,str]) -> None:
    for chave, valor in person_informations.items():
        marcador: str = f"%%{chave}%%"
        html_content: str = html_content.replace(marcador, str(valor))
    generate_pdf(html_content) 

def generate_pdf(html_content: str) -> None:
    guid: uuid = generate_guid()

    #Caminho para salvar o pdf gerado
    pdf_file_path: Path = Path(__file__).parents[1] / 'storage' / f'{guid}.pdf'

    #Definir caminho do executavel wkhtmltopdf
    wkhtmltopdf_dir: str = str(Path(__file__).parent / 'wkhtmltopdf.exe')
    config = pdfkit.configuration(wkhtmltopdf=wkhtmltopdf_dir)

    #Convertendo o html para pdf
    pdfkit.from_string(html_content, pdf_file_path, configuration=config)

def generate_guid() -> uuid:
    return uuid.uuid4()

def main() -> None:
    # person_informations: dict[str, str] = queue_message()

    #Mock do dicionário até entender como pegaremos a mensagem do RabbitMQ
    person_informations: dict[str, str] = {
        "name": "Henrique Copatti Cruz",
        "nacionality": "Mexicano",
        "state": "Guerrero",
        "bday": "24/04/2004",
        "document": "54140979-7",
        "conclusion_date": "23/10/2024",
        "course": "Sistemas de Informação",
        "workload": "70 horas",
        "emission_date": "23/10/2024",
        "signature": "copatthe",
        "job_position": "Analista de Suporte Técnico Jr"
    }

    #Obter diretorio do template html
    template_dir: Path = Path(__file__).parent / 'template.html'
    
    html_content: str = load_html(template_dir) 

    update_html(html_content, person_informations)

if __name__ == "__main__":
    main()