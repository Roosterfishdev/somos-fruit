#!/usr/bin/env python3
"""Match productos.json entries to images in Productos/ folder."""
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).parent
PRODUCTOS_DIR = ROOT / "Productos"
JSON_PATH = ROOT / "productos.json"

EXCLUDE_PATTERNS = re.compile(
    r"(categorias|bg-somos|logo|favicon|nagy-|sf-bg|cr-sf|soste|legumbres-1080)",
    re.I,
)

ALIASES = {
    "arugulakg": "arugula",
    "arugula100g": "arugula",
    "guanabana": "guanabana",
    "maracuya": "maracuya",
    "maracuyacongelada": "maracuya",
    "naranjilla": "naranjilla",
    "pitayahacongelada": "pitahaya",
    "pinaprimer": "pina",
    "pinasegund": "pina",
    "platanomaduro": "platano",
    "platanoverde": "platano",
    "chayotequelite": "chayote",
    "chayotenegro": "chayote",
    "chayotesazon": "chayote",
    "culantrocastilla1x10": "culantro",
    "culantrocastillarollo": "culantro",
    "culantrocoyote": "culantro",
    "culantrocoyote1x10": "culantro",
    "hierbabuenadeshojada": "hierbabuena",
    "hierbabuenarollo100g": "hierbabuena",
    "espinacadeshojada": "espinaca",
    "espinacacontallo": "espinaca",
    "lechugadeshojada": "lechuga",
    "lechugaradicchiobandeja": "lechuga",
    "lechugalolorosared": "lechuga",
    "microgreenbandeja": "microgreen",
    "hongochampinon": "hongosenteros",
    "hongochampinonrebanado": "hongosenteros",
    "hongoportobello": "hongosportobello",
    "hongocreminocrimini": "hongoscrimini",
    "hongocreminiocrimini": "hongoscrimini",
    "hongoshiitake": "hongosenteros",
    "hongomelenadeleon": "hongosenteros",
    "hongoostra": "ostra",
    "hongoostrerosado": "ostra",
    "hongoenoki": "hongosenteros",
    "frijolblancobandeja": "frijol",
    "frijolnacidobandeja": "frijol",
    "garbanzospaquete1kg": "garbanzo",
    "lentejaspaquete1kg": "lentejas",
    "minivainica400g": "vainica",
    "minivegetalesbandeja": "vegetales",
    "minizanahoriabandeja": "zanahoria",
    "minizucchinisbandeja": "minivegetales",
    "minichilotebandejapelado": "chilote",
    "miniescalopinbandeja": "escalopin",
    "chivesrollito": "cebollin",
    "pakchoi": "pakchoy",
    "zucchini": "minivegetales",
    "culantro": "culantrocastilla",
    "amaranthusred": "microgreen",
    "mizuna": "microgreen",
    "tatsoi": "microgreen",
    "mezcladefrutastropicales": "frutas2",
    "tomateprimer": "tomate",
    "tomatesegund": "tomate",
    "tomatetercer": "tomate",
    "sandíaprimer": "sandia",
    "sandíasegund": "sandia",
    "uchuvacascara": "cascarauchuva",
    "uchuvasbandeja200g": "uchuva",
    "pipasconcascara": "pipa",
    "pipassincascara": "pipa",
    "florcomestible65unid": "florcomestible",
    "florcomestibledeshidratdas65unid": "florcomestible",
    "huevos15unidadescarton": "huevos",
    "huevos30unidadescarton": "huevos",
    "mieldeabejabotella": "miel",
    "palmitoenbolsa450g": "palmito",
    "ajomallita3x1": "ajo",
    "ajoentrenza": "ajo",
    "ajopelado": "ajo",
    "ajonegro": "ajonegro",
    "albahaca100g": "albahaca",
    "alfalfabandeja100g": "alfalfa",
    "apio matagrande": "apio",
    "arandanosbandeja125g": "arandanos",
    "bananodeexportacionpinton": "banano",
    "bananodeexportacionmaduro": "banano",
    "bananocriollo": "banano",
    "bananonacional": "banano",
    "bananoverdecocina": "banano",
    "bananomaduro": "banano",
    "fresabandeja1kg": "fresa",
    "fresabandeja400g": "fresa",
    "fresabatido": "fresa",
    "fresajumbokg": "fresa",
    "fresa": "fresa",
    "manzanagala175": "manzanagala",
    "manzanagala80": "manzanagala",
    "manzanagalapaquetede6": "manzanagala",
    "manzana roja 80": "manzanaroja",
    "manzanaverde80": "manzanaverde",
    "manzanaverde175": "manzanaverde",
    "hongoostrabandeja200g": "ostra",
    "hongoscriminibandeja200g": "crimini",
    "hongosenterosbandeja250g": "champinon",
    "hongosportobellobandeja250g": "portobello",
    "hoja paratamal": "hojatamal",
    "hojadelaurelcarton": "laurel",
    "papaamarilla": "papa",
    "papablanca": "papa",
    "papamini": "papa",
    "paparoja": "papa",
    "rabanitomini": "rabanito",
    "rabano": "rabanito",
    "mostazachina": "mostaza",
    "pejibayecrudo": "pejibaye",
    "repollomorado": "repollo",
    "repolloverde": "repollo",
    "tomatepera": "tomatepera",
    "tomatesalsa": "tomate",
    "tomatemexicano": "tomatemexicano",
    "tomatecherryamarillo": "tomatecherry",
    "tomatecherryrojo": "tomatecherry",
    "chiledulceprimer": "chiledulce",
    "chiledulcesegund": "chiledulce",
    "chilemorrónmundial": "chilemorron",
    "chileancho bandeja": "chileancho",
    "chilemoritabandeja": "chilemorita",
    "chilepasillabandeja": "chilepasilla",
    "elotedulcebandeja": "elote",
    "elotesnacional": "elote",
    "frambuesa125g": "frambuesa",
    "morabrasso250g": "morabrasso",
    "mezcladefrutastropicales": "frutas2",
}


def normalize(text: str) -> str:
    text = text.lower().strip()
    text = text.replace("ñ", "n").replace("ü", "u")
    text = unicodedata.normalize("NFD", text)
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    text = re.sub(r"[^a-z0-9]+", "", text)
    return text


def image_stem_key(path: Path) -> str:
    stem = path.stem
    stem = re.sub(r"-\d+x\d+$", "", stem, flags=re.I)
    stem = re.sub(r"-scaled$", "", stem, flags=re.I)
    stem = re.sub(r"-\d+$", "", stem)
    return normalize(stem)


def image_quality(path: Path) -> int:
    stem = path.stem.lower()
    if "150x150" in stem:
        return 100
    m = re.search(r"-(\d+)x(\d+)", stem)
    if m:
        return int(m.group(1)) * int(m.group(2))
    if "scaled" in stem:
        return 3_000_000
    return 800_000


def collect_images():
    best = {}
    for path in PRODUCTOS_DIR.iterdir():
        if not path.is_file():
            continue
        if path.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
            continue
        if EXCLUDE_PATTERNS.search(path.name):
            continue
        key = image_stem_key(path)
        if not key:
            continue
        rel = f"Productos/{path.name}"
        if key not in best or image_quality(path) > image_quality(Path(best[key])):
            best[key] = rel
    return best


def product_lookup_key(nombre: str) -> str:
    n = normalize(nombre)
    if n in ALIASES:
        return normalize(ALIASES[n])
    return n


def find_image(nombre: str, images: dict) -> str | None:
    keys_to_try = [product_lookup_key(nombre), normalize(nombre)]

    for pk in keys_to_try:
        if pk in images:
            return images[pk]

    for pk in keys_to_try:
        matches = [(k, images[k]) for k in images if pk.startswith(k) or k.startswith(pk)]
        if len(matches) == 1:
            return matches[0][1]
        if matches:
            matches.sort(key=lambda x: len(x[0]), reverse=True)
            if len(pk) >= 4 and matches[0][0] in pk:
                return matches[0][1]

    words = re.findall(r"[a-z0-9]+", normalize(nombre))
    if len(words) >= 2:
        compound = "".join(words[:2])
        if compound in images:
            return images[compound]

    first = words[0] if words else ""
    if len(first) >= 4:
        candidates = [k for k in images if k == first or k.startswith(first)]
        if len(candidates) == 1:
            return images[candidates[0]]

    return None


def main():
    images = collect_images()
    with JSON_PATH.open(encoding="utf-8") as f:
        data = json.load(f)

    matched = 0
    unmatched = []

    for product in data["productos"]:
        img = find_image(product["nombre"], images)
        if img:
            product["image"] = img
            matched += 1
        else:
            unmatched.append(product["nombre"])

    with JSON_PATH.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Matched: {matched}/{len(data['productos'])}")
    if unmatched:
        print("Unmatched:")
        for name in unmatched:
            print(f"  - {name}")


if __name__ == "__main__":
    main()
