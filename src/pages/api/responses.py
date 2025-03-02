from openai import OpenAI

#Add your own OpenAI key to use
api_key = "redacted"
client = OpenAI(api_key=api_key)

def get_response(book: str) -> str:
    book_description = (
        "I will be providing a description of a book. \n"
        "Please generate and format a book summary along with genre tags. \n"
        "Respond with an announcement that includes: the genre tags, summary, and provide a description of what type of reader would enjoy the book. \n"
        "----------------------- \n"
        + book
    )
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": book_description}
        ]
    )
    return completion.choices[0].message.content