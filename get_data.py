import requests
import json
import re

# Fonction pour supprimer les balises HTML
def remove_html_tags(text):
    clean = re.compile("<.*?>")
    return re.sub(clean, "", text)

# Configuration de la version et de la langue
patch_version = "14.23.1"
language = "en_US"
url = f"https://ddragon.leagueoflegends.com/cdn/{patch_version}/data/{language}/champion.json"

response = requests.get(url)
if response.status_code == 200:
    champions_data = response.json()
else:
    print(f"Erreur lors de la récupération des données : {response.status_code}")
    champions_data = None

quiz_data = []

if champions_data:
    champions = champions_data["data"]
    for champ_name, champ_info in champions.items():
        champ_url = f"https://ddragon.leagueoflegends.com/cdn/{patch_version}/data/{language}/champion/{champ_name}.json"
        champ_response = requests.get(champ_url)

        if champ_response.status_code == 200:
            champ_details = champ_response.json()
            champ_spells = champ_details["data"][champ_name]["spells"]
            ultimate = champ_spells[-1]

            # Remplacer le nom du champion dans la description par "This champion"
            ultimate_description = ultimate["description"].replace(champ_info["name"], "This champion")
            
            # Nettoyer la description des balises HTML
            ultimate_description = remove_html_tags(ultimate_description)
            
            # Récupérer l'image de l'ultime
            ultimate_image = f"https://ddragon.leagueoflegends.com/cdn/{patch_version}/img/spell/{ultimate['id']}.png"
            
            quiz_data.append({
                "name": champ_info["name"],
                "description": ultimate_description,
                "image": ultimate_image
            })

# Sauvegarder les données dans un fichier JSON
with open("quiz_data.json", "w", encoding="utf-8") as f:
    json.dump(quiz_data, f, ensure_ascii=False, indent=4)
