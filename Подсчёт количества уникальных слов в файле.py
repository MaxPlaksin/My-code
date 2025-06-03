with open("text.txt", encoding="utf-8") as f:
    words = f.read().lower().split()
    unique_words = set(words)
    print(f"Уникальных слов: {len(unique_words)}")
