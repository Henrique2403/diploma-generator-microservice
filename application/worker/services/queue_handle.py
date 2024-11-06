from ..models.person_information import PersonInformation
from .html_to_pdf import generate_pdf

def process_message(body_message) -> None:
    person_information: PersonInformation = PersonInformation(**{k: body_message[k] for k in PersonInformation.__init__.__code__.co_varnames[1:]})
    generate_pdf(person_information)
