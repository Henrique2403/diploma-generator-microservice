from xhtml2pdf import pisa
from pathlib import Path
from ..models.person_information import PersonInformation

async def generate_pdf(person_information: PersonInformation) -> None:

    template_dir: Path = Path(__file__).parents[1] / 'templates' / 'template.html'
    
    html_content: str = await load_html(template_dir) 

    await update_html(html_content, person_information)

async def load_html(file_path: Path) -> str:
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

async def update_html(html_content: str, person_information: PersonInformation) -> None:
    for chave, valor in person_information.__dict__.items():
        marcador: str = f"%%{chave}%%"
        html_content: str = html_content.replace(marcador, str(valor))

    await upload_pdf(html_content, person_information.guid) 

async def upload_pdf(html_content: str, guid: str) -> None:

    pdf_file_path: Path = Path(__file__).parents[2] / 'storage' / f'{guid}.pdf'

    with open(pdf_file_path, "wb") as pdf_file:
        pisa.CreatePDF(html_content, dest=pdf_file)
