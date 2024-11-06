#import pdfkit
#from weasyprint import HTML
from xhtml2pdf import pisa
from pathlib import Path
from .mysql_service import update_database
from ..models.person_information import PersonInformation

def generate_pdf(person_information: PersonInformation) -> None:
    #Obter diretorio do template html
    template_dir: Path = Path(__file__).parents[1] / 'templates' / 'template.html'
    
    html_content: str = load_html(template_dir) 

    update_html(html_content, person_information)

    update_database(person_information)

def load_html(file_path: Path) -> str:
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def update_html(html_content: str, person_information: PersonInformation) -> None:
    for chave, valor in person_information.__dict__.items():
        marcador: str = f"%%{chave}%%"
        html_content: str = html_content.replace(marcador, str(valor))
    person_information.template_degree = html_content

    upload_pdf(html_content, person_information.guid) 

def upload_pdf(html_content: str, guid: str) -> None:

    #Caminho para salvar o pdf gerado
    pdf_file_path: Path = Path(__file__).parents[2] / 'storage' / f'{guid}.pdf'

    # Converte o HTML em PDF e salva
    with open(pdf_file_path, "wb") as pdf_file:
        pisa.CreatePDF(html_content, dest=pdf_file)

    ##Definir caminho do executavel wkhtmltopdf
    #wkhtmltopdf_dir: str = str(Path(__file__).parents[1] / 'external' / 'wkhtmltopdf.exe')
    #config = pdfkit.configuration(wkhtmltopdf=wkhtmltopdf_dir)
#
    ##Convertendo o html para pdf
    #pdfkit.from_string(html_content, pdf_file_path, configuration=config)
