import uuid

def generate_short_uuid():
    generate_uuid = uuid.uuid4()
    generate_uuid = str(generate_uuid)[:13].replace("-","")

    # insert - every 3 characters
    generate_uuid = "-".join([generate_uuid[i:i+3] for i in range(0, len(generate_uuid), 3)])

    return generate_uuid
