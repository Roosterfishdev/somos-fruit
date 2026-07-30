#!/usr/bin/env python3
"""Migrate updated images from Productos V2/ into Productos/ and update productos.json."""
import json
import re
import shutil
import unicodedata
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).parent
V2_DIR = ROOT / "Productos V2"
PRODUCTOS_DIR = ROOT / "Productos"
JSON_PATH = ROOT / "productos.json"

# V2 filename stem (normalized) -> product nombre in JSON
ALIASES = {
    "lechugaradichio": "Lechuga radicchio bandeja",
    "lechugalollarosa": "Lechuga lolorosa red",
    "elotenacional": "Elotes nacional",
    "elotedulce": "Elote dulce bandeja",
    "pipasconcascara": "Pipas con cáscara",
    "minichilotebandeja": "Mini chilote bandeja pelado",
    "bananocriollo": "Banano criollo",
}


def normalize(text: str) -> str:
    text = text.lower().strip()
    text = text.replace("ñ", "n").replace("ü", "u")
    text = unicodedata.normalize("NFD", text)
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "", text)


def to_kebab(text: str) -> str:
    text = text.lower().strip()
    text = text.replace("ñ", "n").replace("ü", "u")
    text = unicodedata.normalize("NFD", text)
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return re.sub(r"-+", "-", text).strip("-")


def resolve_products(stem: str, products: list[dict]) -> list[dict]:
    key = normalize(stem)
    if key in ALIASES:
        target = normalize(ALIASES[key])
        return [p for p in products if normalize(p["nombre"]) == target]
    return [p for p in products if normalize(p["nombre"]) == key]


def main():
    with JSON_PATH.open(encoding="utf-8") as f:
        data = json.load(f)

    by_name = {p["nombre"]: p["image"] for p in data["productos"]}

    matched = []
    unmatched = []

    for src in sorted(V2_DIR.iterdir()):
        if not src.is_file():
            continue
        if src.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
            continue

        products = resolve_products(src.stem, data["productos"])
        if not products:
            unmatched.append(src.name)
            continue

        dest_name = f"{to_kebab(src.stem)}{src.suffix.lower()}"
        dest = PRODUCTOS_DIR / dest_name
        shutil.copy2(src, dest)

        rel_path = f"Productos/{dest_name}"
        for product in products:
            old = by_name[product["nombre"]]
            product["image"] = rel_path
            matched.append((src.name, product["nombre"], old, rel_path))

    with JSON_PATH.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    image_refs = Counter(p["image"] for p in data["productos"])
    replaced_old = {old for _, _, old, _ in matched}
    safe_to_delete = []
    keep_old = []

    for old_path in sorted(replaced_old):
        full = ROOT / old_path
        if image_refs[old_path] == 0 and full.exists():
            safe_to_delete.append(old_path)
        elif image_refs[old_path] > 0:
            keep_old.append((old_path, image_refs[old_path]))

    print(f"Matched: {len(matched)} updates from {len(matched) + len(unmatched)} V2 files")
    for src, name, old, new in matched:
        print(f"  {src}")
        print(f"    -> {name}")
        print(f"    {old} -> {new}")

    if unmatched:
        print("Unmatched V2 files:")
        for name in unmatched:
            print(f"  - {name}")

    print(f"\nOld images still referenced ({len(keep_old)}):")
    for path, count in keep_old:
        print(f"  {path} ({count} refs)")

    print(f"\nSafe to delete ({len(safe_to_delete)}):")
    for path in safe_to_delete:
        print(f"  {path}")

    # Write cleanup list for post-run step
    cleanup_file = ROOT / ".v2-cleanup.txt"
    cleanup_file.write_text("\n".join(str(ROOT / p) for p in safe_to_delete) + "\n", encoding="utf-8")

    total_v2 = len(matched) + len(unmatched)
    unique_v2 = total_v2 - len(unmatched)
    return len(unmatched) == 0 and unique_v2 > 0


if __name__ == "__main__":
    ok = main()
    raise SystemExit(0 if ok else 1)
