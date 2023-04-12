from uuid import uuid4


def generate_short_uuid():
    # generate uuid and cut it to 12 characters & remove the dashes
    generated_uuid = str(uuid4()).replace("-", "")[:12]

    # insert - every 3 characters
    for i in range(3, len(generated_uuid), 4):
        generated_uuid = f"{generated_uuid[:i]}-{generated_uuid[i:]}"

    return generated_uuid


if __name__ == "__main__":
    print(generate_short_uuid())
