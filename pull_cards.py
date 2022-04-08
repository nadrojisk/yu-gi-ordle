import json

with open("ygo.json", "r") as f:
    jsoncards = json.load(f)

cards = {}
for card in jsoncards["data"]:
    if "Monster" in card["type"]:
        if card["type"] == "Link Monster":
            level = card["linkval"]
            defense = -1
        else:
            level = card["level"]
            defense = card["def"]

        new_card = [
            card["race"],
            card["attribute"],
            card["type"],
            level,
            card["atk"],
            defense,
        ]

        cards[card["name"]] = new_card

with open("data/ygodex.json", "w") as f:
    json.dump(cards, f)
