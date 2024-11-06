import uuid
from datetime import datetime

class PersonInformation:

    def __init__(self, student_name, nacionality, state, birthday, document, conclusion_date, course, workload, name, job_position) -> None:
        self.guid: str = str(uuid.uuid4())
        self.student_name: str = student_name
        self.nacionality: str = nacionality
        self.state: str = state
        self.birthday: str = birthday
        self.document: str = document
        self.conclusion_date: str = conclusion_date
        self.course: str = course
        self.workload: str = workload
        self.emission_date: str = f'{datetime.now().date():%d/%m/%y}'
        self.name: str = name
        self.job_position: str = job_position
        self.template_degree: str = ''