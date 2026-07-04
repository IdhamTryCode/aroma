# FragDB v5 — Fragrance Database (Multilingual)

**Generated**: 2026-04-13
**Languages**: English + 22 (de, es, fr, cs, it, ru, pl, pt, el, zh, ja, nl, sr, ro, ar, uk, mn, ko, tr, sv, he, hu)

## Contents

| File | Records | Fields | Description |
|------|---------|--------|-------------|
| `fragrances.csv` | 127,579 | 30 | Main fragrance database |
| `brands.csv` | 7,609 | 54 | Brand profiles + translations |
| `perfumers.csv` | 2,905 | 36 | Perfumer profiles + translations |
| `notes.csv` | 2,508 | 55 | Fragrance notes + translations |
| `accords.csv` | 92 | 27 | Accords + translations |
| `translations.csv` | 34 | 25 | Vocabulary for gender & voting labels |

**Total**: 140,727 records across 6 files

Also included: `data_dictionary.md` with detailed field documentation.

## File Format

- **Encoding**: UTF-8
- **Delimiter**: Pipe `|`
- **Quote character**: `"` (double quote)
- **Multiline fields**: Supported (quoted)
- **Empty fields**: Many fields can be empty (e.g. `video_url` is empty for ~99% of fragrances, `pros_cons` for ~90%, `perfumers` for ~62%)

---

## Localization

### How it works

Gender values and voting labels in `fragrances.csv` are stored as **translation IDs** instead of English text. Look up any ID in `translations.csv` to get the text in 23 languages.

Reference files (`brands.csv`, `perfumers.csv`, `notes.csv`, `accords.csv`) have translations as extra columns with `_{lang}` suffix (e.g. `country_ru`, `note_name_ja`).

### Translation ID prefixes

| Prefix | Field in fragrances.csv | Values |
|--------|------------------------|--------|
| `gender_` | `gender` | `gender_for_women`, `gender_for_men`, `gender_for_women_and_men` |
| `gvotes_` | `gender_votes` | `gvotes_female`, `gvotes_more_female`, `gvotes_unisex`, `gvotes_more_male`, `gvotes_male`, `gvotes_shared` |
| `like_` | `appreciation` | `like_love`, `like_like`, `like_ok`, `like_dislike`, `like_hate` |
| `longevity_` | `longevity` | `longevity_very_weak`, `longevity_weak`, `longevity_moderate`, `longevity_long_lasting`, `longevity_eternal` |
| `sillage_` | `sillage` | `sillage_intimate`, `sillage_moderate`, `sillage_strong`, `sillage_enormous` |
| `season_` | `season` | `season_winter`, `season_spring`, `season_summer`, `season_fall` |
| `season_` | `time_of_day` | `season_day`, `season_night` |
| `price_` | `price_value` | `price_way_overpriced`, `price_overpriced`, `price_ok`, `price_good_value`, `price_great_value` |

### Translated columns in reference files

| File | Translated columns |
|------|--------------------|
| `brands.csv` | `country_{lang}` (22), `main_activity_{lang}` (22) |
| `perfumers.csv` | `status_{lang}` (22), `perfumer_name_ru`, `perfumer_name_uk`, `perfumer_name_ja` |
| `notes.csv` | `note_name_{lang}` (22), `note_group_{lang}` (22) |
| `accords.csv` | `name_{lang}` (22) |

---

## Quick Start

### Python

```python
import pandas as pd

# Load all files
fragrances = pd.read_csv('fragrances.csv', sep='|', encoding='utf-8')
brands = pd.read_csv('brands.csv', sep='|', encoding='utf-8')
perfumers = pd.read_csv('perfumers.csv', sep='|', encoding='utf-8')
notes = pd.read_csv('notes.csv', sep='|', encoding='utf-8')
accords = pd.read_csv('accords.csv', sep='|', encoding='utf-8')
translations = pd.read_csv('translations.csv', sep='|', encoding='utf-8')

# Join fragrances with brands
fragrances['brand_id'] = fragrances['brand'].str.split(';').str[1]
df = fragrances.merge(brands, left_on='brand_id', right_on='id', suffixes=('', '_brand'))

# Translate gender to Russian
trans = translations.set_index('id')
df['gender_ru'] = df['gender'].map(lambda x: trans.loc[x, 'ru'] if x in trans.index else x)

# Brand country in Japanese
print(df[['name', 'name_brand', 'country_ja', 'gender_ru']].head())
```

### JavaScript

```javascript
const { parse } = require('csv-parse/sync');
const fs = require('fs');

const fragrances = parse(fs.readFileSync('fragrances.csv', 'utf-8'), { columns: true, delimiter: '|' });
const brands = parse(fs.readFileSync('brands.csv', 'utf-8'), { columns: true, delimiter: '|' });
const translations = parse(fs.readFileSync('translations.csv', 'utf-8'), { columns: true, delimiter: '|' });

// Build lookup maps
const brandsMap = new Map(brands.map(b => [b.id, b]));
const transMap = new Map(translations.map(t => [t.id, t]));

// Get fragrance with translated fields
const frag = fragrances[0];
const [brandName, brandId] = frag.brand.split(';');
const brand = brandsMap.get(brandId);
const genderRu = transMap.get(frag.gender)?.ru || frag.gender;

console.log(`${frag.name} by ${brandName} (${brand?.country_ru}), ${genderRu}`);
```

### SQL (PostgreSQL)

```sql
-- Import
COPY fragrances FROM 'fragrances.csv' DELIMITER '|' CSV HEADER ENCODING 'UTF8';
COPY brands FROM 'brands.csv' DELIMITER '|' CSV HEADER ENCODING 'UTF8';
COPY translations FROM 'translations.csv' DELIMITER '|' CSV HEADER ENCODING 'UTF8';

-- Join fragrances with brands and translate gender to Russian
SELECT f.name, b.name AS brand, b.country_ru, t.ru AS gender_ru
FROM fragrances f
JOIN brands b ON SPLIT_PART(f.brand, ';', 2) = b.id
JOIN translations t ON f.gender = t.id;
```

---

## Field Reference

### fragrances.csv (30 fields)

| # | Field | Type | Description | Example |
|---|-------|------|-------------|---------|
| 1 | `pid` | Integer | Unique fragrance ID | `9828` |
| 2 | `url` | URL | Fragrantica page | `https://www.fragrantica.com/perfume/Creed/Aventus-9828.html` |
| 3 | `brand` | String | `brand_name;brand_id` | `Creed;b68` |
| 4 | `name` | String | Fragrance name | `Aventus` |
| 5 | `year` | Integer | Release year | `2010` |
| 6 | `gender` | Translation ID | Target gender (3 values) | `gender_for_men` |
| 7 | `collection` | String | Collection within brand | `Aventus` |
| 8 | `main_photo` | URL | Bottle image | URL |
| 9 | `info_card` | URL | Social card image | URL |
| 10 | `user_photoes` | URLs | User photos (`;`-separated) | URLs |
| 11 | `video_url` | URLs | YouTube + HLS videos (`;`-separated) | URLs |
| 12 | `accords` | String | `accord_id:percent;...` sorted by % desc | `a35:100;a75:68;a91:67` |
| 13 | `notes_pyramid` | String | `level(note_id,opacity,weight;...)` | `top(n75,0.96,3.73;...)middle(...)base(...)` |
| 14 | `perfumers` | String | `name;id;name;id;...` | `Erwin Creed;p138;Jean-Christophe Herault;p253` |
| 15 | `description` | HTML | Description text (EN only) | HTML text |
| 16 | `rating` | String | `average_rating;total_votes` | `4.32;26253` |
| 17 | `reviews_count` | Integer | Number of user reviews | `4200` |
| 18 | `appreciation` | Translation IDs | `tid:votes:percent;...` | `like_love:15500:59;like_like:6600:25` |
| 19 | `price_value` | Translation IDs | `tid:votes:percent;...` | `price_way_overpriced:7100:57;price_ok:1500:12` |
| 20 | `gender_votes` | Translation IDs | `tid:votes:percent;...` | `gvotes_male:8600:68;gvotes_more_male:2900:23` |
| 21 | `longevity` | Translation IDs | `tid:votes:percent;...` | `longevity_moderate:6300:39;longevity_long_lasting:6000:37` |
| 22 | `sillage` | Translation IDs | `tid:votes:percent;...` | `sillage_moderate:8600:53;sillage_strong:4500:27` |
| 23 | `season` | Translation IDs | `tid:votes:percent;...` | `season_summer:12400:100;season_spring:12100:98` |
| 24 | `time_of_day` | Translation IDs | `tid:votes:percent;...` | `season_day:12400:100;season_night:8500:69` |
| 25 | `pros_cons` | String | `pros(text,likes,dislikes;...)cons(...)` | see Parsing section |
| 26 | `by_designer` | PIDs | Other fragrances by same brand (`;`-sep) | `3805;4262;472` |
| 27 | `in_collection` | PIDs | Same collection fragrances (`;`-sep) | `9828;12345` |
| 28 | `reminds_of` | String | `pid:likes:dislikes;...` | `34696:5800:874;52002:3700:643` |
| 29 | `also_like` | PIDs | Users also liked (`;`-sep) | `508;187;60` |
| 30 | `news_ids` | IDs | Related news article IDs (`;`-sep) | `23884;23818` |

### translations.csv (25 fields)

| Field | Description | Example |
|-------|-------------|---------|
| `id` | Translation ID (used in fragrances.csv) | `longevity_weak` |
| `section` | Which fragrances.csv field uses this ID | `longevity` |
| `en` | English text | `weak` |
| `de`...`hu` | 22 language translations | `schwach` |

### brands.csv (54 fields)

| # | Fields | Description |
|---|--------|-------------|
| 1 | `id` | Unique brand ID (`b1`, `b68`...) |
| 2 | `name` | Brand name |
| 3 | `url` | Fragrantica page URL |
| 4 | `logo_url` | Brand logo image URL |
| 5 | `country` | Country of origin (EN) |
| 6 | `main_activity` | Business type (EN) |
| 7 | `website` | Official website URL |
| 8 | `parent_company` | Parent company name |
| 9 | `description` | Brand description (HTML, EN) |
| 10 | `brand_count` | Number of fragrances in database |
| 11-32 | `country_de`...`country_hu` | Country in 22 languages |
| 33-54 | `main_activity_de`...`main_activity_hu` | Business type in 22 languages |

### perfumers.csv (36 fields)

| # | Fields | Description |
|---|--------|-------------|
| 1 | `id` | Unique perfumer ID (`p1`, `p138`...) |
| 2 | `name` | Perfumer name (EN) |
| 3 | `url` | Fragrantica page URL |
| 4 | `photo_url` | Photo URL |
| 5 | `status` | Professional status (EN) |
| 6 | `company` | Current company |
| 7 | `also_worked` | Previous companies |
| 8 | `education` | Education background |
| 9 | `web` | Personal website URL |
| 10 | `perfumes_count` | Number of fragrances created |
| 11 | `biography` | Biography text (HTML, EN) |
| 12-33 | `status_de`...`status_hu` | Status in 22 languages |
| 34 | `perfumer_name_ru` | Name in Russian |
| 35 | `perfumer_name_uk` | Name in Ukrainian |
| 36 | `perfumer_name_ja` | Name in Japanese |

### notes.csv (55 fields)

| # | Fields | Description |
|---|--------|-------------|
| 1 | `id` | Unique note ID (`n80`, `n105`...) |
| 2 | `name` | Note name as shown on perfume page (EN) |
| 3 | `url` | Note page URL on Fragrantica |
| 4 | `latin_name` | Scientific/Latin name |
| 5 | `other_names` | Alternative names |
| 6 | `group` | Note category (e.g. Citrus, Flowers, Woods) |
| 7 | `odor_profile` | Scent description |
| 8 | `main_icon` | Note icon URL (as shown in perfume pyramids) |
| 9 | `alt_icons` | Alternative icon URLs (`;`-separated) |
| 10 | `background` | Background image URL |
| 11 | `fragrance_count` | Number of fragrances using this note |
| 12-33 | `note_name_de`...`note_name_hu` | Note name in 22 languages |
| 34-55 | `note_group_de`...`note_group_hu` | Note group in 22 languages |

Each unique combination of (name, URL, icon) has its own ID. For example, `Rose` and `Damask Rose` both link to `/notes/Rose-105.html` but have separate IDs with separate translations.

### accords.csv (27 fields)

| # | Fields | Description |
|---|--------|-------------|
| 1 | `id` | Unique accord ID (`a1`, `a24`...) |
| 2 | `name` | Accord name (EN) |
| 3 | `bar_color` | Display color hex (e.g. `#FC4B29`) |
| 4 | `font_color` | Text color hex (e.g. `#000000`) |
| 5 | `fragrance_count` | Number of fragrances with this accord |
| 6-27 | `name_de`...`name_hu` | Accord name in 22 languages |

---

## Parsing Complex Fields

### Brand

```python
# Format: brand_name;brand_id
brand_name, brand_id = value.split(';', 1)
# Use brand_id to JOIN with brands.csv
```

### Perfumers

```python
# Format: name1;id1;name2;id2;...
parts = value.split(';')
perfumers = [(parts[i], parts[i+1]) for i in range(0, len(parts)-1, 2)]
# Each (name, id) pair — use id to JOIN with perfumers.csv
```

### Accords

```python
# Format: accord_id:percent;... (sorted by percent descending)
for entry in value.split(';'):
    accord_id, percent = entry.split(':')
    # JOIN with accords.csv for name, colors, translations
```

### Notes Pyramid

```python
import re

# Format: level(note_id,opacity,weight;...)level(...)
# Levels: top, middle, base — or just "notes" when layers are unknown
# - note_id: JOIN with notes.csv for name, icon, group, translations
# - opacity: 0.0-1.0 (visual prominence, 1.0 = most prominent note in layer)
# - weight: visual size on the pyramid chart (higher = larger)

levels = re.findall(r'(\w+)\(([^)]+)\)', value)
for level_name, notes_str in levels:
    for note in notes_str.split(';'):
        note_id, opacity, weight = note.split(',')
        # JOIN note_id with notes.csv
```

### Rating

```python
# Format: average_rating;total_votes
avg, votes = value.split(';')
rating = float(avg)      # e.g. 4.32
total_votes = int(votes)  # e.g. 26253
```

### Voting Fields (appreciation, longevity, sillage, etc.)

```python
# Format: translation_id:votes:percent;...
# Use translations.csv to get label text in any language

def parse_votes(value, translations_df, lang='en'):
    if not value:
        return {}
    trans = translations_df.set_index('id')
    result = {}
    for entry in value.split(';'):
        tid, votes, pct = entry.split(':')
        label = trans.loc[tid, lang] if tid in trans.index else tid
        result[label] = {'votes': int(votes), 'percent': float(pct)}
    return result

# Example: longevity in Russian
# Input:  "longevity_very_weak:813:5;longevity_weak:1500:9"
# Output: {'очень слабая': {'votes': 813, 'percent': 5.0}, 'слабая': {'votes': 1500, 'percent': 9.0}}
```

### Gender

```python
# Field contains a translation ID, not text
# "gender_for_women" -> look up in translations.csv
gender_text = translations.set_index('id').loc[row['gender'], lang]
```

### Pros/Cons

```python
import re

# Format: pros(text,likes,dislikes;text,likes,dislikes;...)cons(...)
# EN only — not translated
for section_name, entries_str in re.findall(r'(pros|cons)\(([^)]+)\)', value):
    for entry in entries_str.split(';'):
        parts = entry.rsplit(',', 2)
        text = parts[0]
        likes = int(parts[1]) if len(parts) > 1 else 0
        dislikes = int(parts[2]) if len(parts) > 2 else 0
```

### Reminds Of

```python
# Format: pid:likes:dislikes;pid:likes:dislikes;...
# "This perfume reminds me of..." — community suggestions with voting
for entry in value.split(';'):
    pid, likes, dislikes = entry.split(':')
    # pid references another fragrance in fragrances.csv
```

---

## Links

- **Website**: [fragdb.net](https://fragdb.net)
- **Email**: [support@fragdb.net](mailto:support@fragdb.net)
- **GitHub**: [github.com/FragDB/fragrance-database](https://github.com/FragDB/fragrance-database)
- **Hugging Face**: [huggingface.co/datasets/FragDBnet/fragrance-database](https://huggingface.co/datasets/FragDBnet/fragrance-database)
- **Kaggle**: [kaggle.com/datasets/eriklindqvist/fragdb-fragrance-database](https://www.kaggle.com/datasets/eriklindqvist/fragdb-fragrance-database)

---

FragDB. Data sourced from Fragrantica.
