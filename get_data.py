import requests
import json
import re

def remove_html_tags(text):
    # Supprime les balises HTML et les tags de style Riot comme <stats>...</stats>
    clean = re.compile("<.*?>")
    return re.sub(clean, "", text)

# --- ÉTAPE 1 : Récupérer dynamiquement la dernière version ---
try:
    version_url = "https://ddragon.leagueoflegends.com/api/versions.json"
    version_response = requests.get(version_url)
    version_response.raise_for_status()
    # La première version dans la liste est toujours la plus récente
    patch_version = version_response.json()[0]
    print(f"Dernière version détectée : {patch_version}")
except Exception as e:
    patch_version = "15.1.1" # Fallback de secours
    print(f"Erreur lors de la détection de version, utilisation de la version par défaut {patch_version}")

language = "en_US"
url = f"https://ddragon.leagueoflegends.com/cdn/{patch_version}/data/{language}/champion.json"

response = requests.get(url)
if response.status_code == 200:
    champions_summary = response.json()
else:
    print(f"Erreur lors de l'accès au CDN : {response.status_code}")
    champions_summary = None

quiz_data = []
draft_data = []

if champions_summary:
    champions = champions_summary["data"]
    for champ_id, champ_info in champions.items():
        # 1. Données pour le DRAFT (Icône du champion)
        champ_icon = f"https://ddragon.leagueoflegends.com/cdn/{patch_version}/img/champion/{champ_id}.png"
        
        draft_data.append({
            "id": champ_id,
            "name": champ_info["name"],
            "icon": champ_icon
        })

        # 2. Données pour le QUIZ (Détails du sort ultime)
        champ_url = f"https://ddragon.leagueoflegends.com/cdn/{patch_version}/data/{language}/champion/{champ_id}.json"
        champ_response = requests.get(champ_url)

        if champ_response.status_code == 200:
            print(f"Traitement de : {champ_info['name']}")
            champ_details = champ_response.json()
            champ_spells = champ_details["data"][champ_id]["spells"]
            
            # Le sort ultime (R) est toujours le dernier dans la liste "spells"
            ultimate = champ_spells[-1]

            # Remplacer le nom du champion dans la description pour ne pas donner la réponse
            ultimate_description = ultimate["description"].replace(champ_info["name"], "This champion")
            ultimate_description = remove_html_tags(ultimate_description)
            
            ultimate_image = f"https://ddragon.leagueoflegends.com/cdn/{patch_version}/img/spell/{ultimate['id']}.png"
            
            quiz_data.append({
                "name": champ_info["name"],
                "description": ultimate_description,
                "image": ultimate_image
            })

# Sauvegarde des deux fichiers
with open("quiz_data.json", "w", encoding="utf-8") as f:
    json.dump(quiz_data, f, ensure_ascii=False, indent=4)

with open("champions_data.json", "w", encoding="utf-8") as f:
    json.dump(draft_data, f, ensure_ascii=False, indent=4)

print(f"\nSuccès ! Fichiers mis à jour avec le patch {patch_version}.")
print(f"Total de champions récupérés : {len(draft_data)}")