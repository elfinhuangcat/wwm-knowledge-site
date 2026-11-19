# Project
## Architecture

- Must remain deployable on GitHub Pages.
- No backend.
- Prefer vanilla HTML/CSS/JavaScript unless there is a strong reason otherwise.
- User checklist state is stored in localStorage.
- Activity knowledge must be separated from presentation logic.
- Do not hard-code activity data into HTML.
- Source activity data comes from the owner's Excel workbook.

## Development principles

- Keep the project simple.
- Avoid adding frameworks, build systems, databases, or servers unless justified.
- Mobile usability matters.
- Data schema should be extensible because new activities/rewards will be added later.
- Before making major schema changes, explain the migration impact.
- Do not mutate files in wwm-knowledge-site/docs

## Sources of truth
- `raw-data/WWM Daily_Weekly_Monthly.xlsx`: Activity checklist in Excel format maintained by the owner.
- `raw-data/WWM Limited Time Events.xlsx`: Limited time activity checklist in Excel format maintained by the owner, each with event expiration datetime, completion status reset rule and English (en) translation.
- `raw-data/WWM_CurrencyDictionaryAndUsage.xlsx`: Dictionary specifically for currency.
- `raw-data/WWM_Dictionary.xlsx`: Dictionary for various terms in the game.
- `wwm-knowledge-site/docs/requirements.md`: Product behavior and UX requirements. 
- `wwm-knowledge-site/docs/technical_spec.md`: Technical requirements.
- `wwm-knowledge-site/docs/credits.md`: Provides the map from asset to credit to author URL, author name and source of the screenshot.
- `wwm-knowledge-site/pages`: Pages created in .doc, .pdf or other formats are here. They should be converted into website pages under one of the root menu according to their folder.

## Generated files location
- `wwm-knowledge-site/assets`: If there are any assets such as PNG files that are sourced from `raw-data`, put them here.
- `wwm-knowledge-site/data`: If there are any generated data (such as activity checklist in JSON format), put them in this folder.
- `wwm-knowledge-site/gen_docs`: If there are any generated documents, such as data model, put them in this folder.


## Working rules
- We target to support 3 languages, Chinese Simplified (zh-Hans), Chinese Traditional (zh-Hant) and English (en). The data is mainly written in Chinese Simplified and translations can be found from `WWM_Dictionary.xlsx` or `WWM_CurrencyDictionaryAndUsage.xlsx` or the source data itself.
- If there is missing translation for zh-Hant, it should be converted from zh-Hans. If there is missing translation for other languages, then it should prompt to notify the developer.
- Generate a structured json from when instructed to parse the Excel activity sheet.
- Do not mutate anything in `raw-data`.
- Do not mutate anything in `wwm-knowledge-site/docs`.
- For UI-only changes, do not inspect the workbook unless necessary.
- When changing activity data, preserve the established schema in
`wwm-knowledge-site/gen_docs/data-model.md`.
- Always annotate credit to the original author if using assets mentioned in `credits.md`.