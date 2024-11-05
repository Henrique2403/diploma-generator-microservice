from datetime import datetime
from pathlib import Path

class PersonInformation:

    def __init__(self, student_name, nacionality, state, birthday, document, conclusion_date, course, workload, name, job_position) -> None:
        self.student_name: str = student_name
        self.nacionality: str = nacionality
        self.state: str = state
        self.birthday: str = birthday
        self.document: str = document
        self.conclusion_date: str = conclusion_date
        self.course: str = course
        self.workload: str = workload
        self.emission_date: str = f'{datetime.now().date():%d/%m/%y}'
        self.signature: Signature = Signature(name, job_position)

    def to_dict(self) -> dict[str, str]:
        return {
            "student_name": self.student_name,
            "nacionality": self.nacionality,
            "state": self.state,
            "birthday": self.birthday,
            "document": self.document,
            "conclusion_date": self.conclusion_date,
            "course": self.course,
            "workload": self.workload,
            "emission_date": self. emission_date,
            "name": self.signature.name,
            "job_position": self.signature.job_position 
        }
    
class Signature:

    def __init__(self, name, job_position) -> None:
        self.name: str = name
        self.job_position: str = job_position
        

person_info: PersonInformation = PersonInformation("Nicolas", "BR", "SP", "23/01/2004", "53.201.963-5", "20/10/2024", "SI", "130 horas", "José", "Professor")

print(person_info.to_dict())

person_informations: dict[str, str] = person_info.to_dict()

template_dir: Path = Path(__file__).parent / 'template.html'

with open(template_dir, 'r', encoding='utf-8') as file:
    html_content: str = file.read()

for chave, valor in person_informations.items():
        marcador: str = f"%%{chave}%%"
        html_content: str = html_content.replace(marcador, str(valor))
print(html_content)