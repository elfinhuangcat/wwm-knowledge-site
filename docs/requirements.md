# Product Requirements - Where Winds Meet Static Knowledge Website

## Product General Description
This project aims to produce a static website that can be easily hosted in Github and share knowledge about the game Where Winds Meet. The website is not supposed to be official and only a fan product.

- The website name is "燕云行笺", with a subtitle "玩家知识站".
- The website logo is assets/cat-goose-logo.png
- The website should be displayed in Simplified Chinese.


## Business Requirements

In this section we will list desired main features for the website. 
- "日课周修" (Checklist)
  - These are monthly/weekly/daily activities checklist, as well as limited time events.
  - Users can prioritize activities according to different goals:
    - 角色养成 (both needed for PVE and PVP)
    - PVP养成
    - 外观收集
  
  - Users can choose to hide the checklist items that are marked as finished.
  - The table containing this checklist should mainly show the activity name, activity category, priority, key rewards, expected time to consume. Other details can be expanded and displayed. If there is "note to AI assistant" with link, please link the url in the name of activity.
- "不可错过" (Worth Doing)
  - This page is supposed to share knowledge about one-time game rewards that should not be missed.
- "百业101" (Guild 101)
  - This page is supposed to share common knowledge about how to get enough active points (to keep your status active in a guild) and get benefits from being a guild member.
- "百科查阅" (Encyclopedia)
  - Knolwedge base / encyclopedia to store the pages that can be linked from activities checklist to detail how to complete an activity, or explaining why certain reward should be prioritized etc.
  - The knowledge base should have categories, preferably displayed as tree structure in left panel.

## Tranlation Requirements
- The website should support zh-Hans(简体中文, Chinese Simplified),zh-Hant(繁體中文, Chinese Traditional) and en(English).
- Users should be able to change displayed language in any page by a top-right drop-down menu with 3 selections: 简体中文, 繁體中文 and English.
- Both `WWM_CurrencyDictionaryAndUsage.xlsx` and `WWM_Dictionary.xlsx` should be used for translation look-up.
- zh-Hans (Chinese Simplified) should be used as the index to look up tranlation.
  - In the `WWM_Dictionary.xlsx`, 1st column is the index. If a term cannot be found in 1st column, the 2nd column (nickname) can be used for look up.
  - In the `WWM_CurrencyDictionaryAndUsage.xlsx`, 1st column is the index.
- If no translation can be found from any dictionary:
  - zh-Hant: Just simplified to traditional characters.
  - English: Prompt if it looks like a term specific to Where Winds Meet (the game). Otherwise just use LLM translation.
- If the page has credit to other authors, do not translate their names.
## Visual Design & UX
The website should feel clean, lightweight, concise, and easy to scan.

### Overall style
- Prefer a modern, minimal interface.
- Keep visual clutter low, but do not make the site feel plain or unfinished.
- Avoid a purely black-and-white appearance.
- Use a restrained color palette with one primary accent color and a small
  number of secondary colors where they communicate useful information.
- Prefer subtle backgrounds, borders, and section separation over heavy
  shadows or decorative effects.
- Use whitespace generously enough to make information easy to distinguish,
  while keeping the activity table reasonably information-dense.


### Information hierarchy
- The activity table/checklist is the primary content of the website.
- Optimize the design for quickly scanning and comparing activities.
- Important information such as activity name, priority, rewards, completion
  state, and reset frequency should be recognizable at a glance.
- Secondary descriptions and notes should be visually quieter.
- Avoid large decorative headers or UI elements that push useful information
  below the fold.
- Each top-level feature to be displayed as menu item at the top panel.


### Color
- Color should have meaning rather than being purely decorative.
- Use accent colors for interactive controls, selected filters, and important
  information.
- Different reward types/categories may use subtle color coding where useful.
- Priority levels may use color, but must also be understandable without color.
- Avoid excessive saturation or having every category use a strong color.
- Maintain good text/background contrast and accessibility.

### Table
- Tables should remain readable even when they contain many activities.
- Use subtle row separation and/or alternating backgrounds if helpful.
- Keep headers visually distinct.
- Make sortable columns obviously sortable.
- Completed activities should remain readable but be visually de-emphasized.
- Reward icons can be used alongside text to improve recognition.
- Do not rely on icons alone when their meaning may be ambiguous.

### Responsive design
- Desktop is the primary experience, but the site should remain usable on
  phones and tablets.
- On small screens, prioritize the most important information instead of
  simply shrinking the desktop table.
- Avoid unnecessary horizontal scrolling where practical.

### Avoid
- Excessive animations.
- Large gradients or decorative backgrounds.
- Glassmorphism or excessive transparency.
- Heavy drop shadows.
- Excessive rounded cards ("card for everything" design).
- Huge headings and excessive empty space.
- Overly colorful interfaces.

### Others
- Disclaimer as footer in every page. “Unofficial fan-made guide. Where Winds Meet and related game assets are property of NetEase/Everstone Studio. This site is not affiliated with or endorsed by NetEase.”


