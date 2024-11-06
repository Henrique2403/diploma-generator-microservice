from ..models.person_information import PersonInformation
from .html_to_pdf import generate_pdf

def process_message(body_message) -> None:

    # O GPT realmente teve que ajudar aqui, queria deixar menos verboso do q criar 10 variáveis
    # e depois instanciar a classe PersonInformation com todos os 10 parâmetros :D 
    person_information: PersonInformation = PersonInformation(**{k: body_message[k] for k in PersonInformation.__init__.__code__.co_varnames[1:]})
    generate_pdf(person_information)
