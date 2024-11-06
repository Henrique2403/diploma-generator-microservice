from ..models.person_information import PersonInformation

def update_database(person_information: PersonInformation) -> None:
    print(f"só falta atualizar esses dados no mysql: {person_information.__dict__}")