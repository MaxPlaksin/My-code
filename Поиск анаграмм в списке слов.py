from collections import defaultdict

words = ["listen", "silent", "enlist", "google", "gooegl", "cat", "tac"]
anagrams = defaultdict(list)
for word in words:
    key = ''.join(sorted(word))
    anagrams[key].append(word)

result = [group for group in anagrams.values() if len(group) > 1]
print(result)
