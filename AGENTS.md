# Project

Static knowledge/checklist website for a small group of players.

## Product requirements

### Main Features in Website

There are the following main features of this website. We want each top-level feature to be displayed as menu item at the top panel.

- "日课周修" (Monthly/weekly/daily activities checklist)
  - They should be displayed in the same page as 2 tabular checklist (weekly and monthly combined into one). They should be sortable/filterable tables with check mark enabled for users to check an activity as completed for today / this week / this month.
  - Users can prioritize activities according to different goals:
    - 角色养成 (both needed for PVE and PVP)
    - PVP养成
    - 外观收集
  - Users should be able to filter the table by following categories:
    - Goals:
      - All
      - 角色养成
      - PVP养成
      - 外观收集
    - 是否获得百业活跃度
      - If this filter is applied, then by default should only display those with "是".
  - Users should be able to sort the table by following categories:
    - 优先级
    - 单次花费时间
      - By default should be sorted into ascending order:
        - 极低
        - 低
        - 中
        - 高
        - 不定，通常久
      - The time annotated to the level can be displayed in a grey color while the level itself can be more explicit.
  - Users should be able to filter the table by inputting reward item they desire in a text input box. Please provide the following quick, frequently used terms under the text input box for them to quickly search without typing:
    - 心法
    - 长鸣玉
    - 装备
    - 通宝
    - 外观
    - 袅袅之音
    - 武学
    - 奇术
  - Users can choose to hide the checklist items that are marked as finished.
  - The table containing this checklist should mainly show the activity name, activity category, priority, key rewards, expected time to consume. Other details can be expanded and displayed. If there is "note to AI assistant" with link, please link the url in the name of activity.
- "不可错过" ("Once a lifetime" game rewards that should not be missed)
- "百业101" (101 for freshmen to a guild)
- "游戏活动" (Game events that needs to be updated by developer as new in-game events published), which should feed back to the weekly activities checklist since they needs to be done on a regular basis as well.
- "百科查阅" (Knolwedge base / encyclopedia to store the pages that can be linked from activities checklist to detail how to complete an activity, or explaining why certain reward should be prioritized etc.)
  - The knowledge base should have categories, preferably displayed as tree structure in left panel.

### Specification

- The website should be created into Simplified Chinese first. Developer will consider to provide other language but not at this point.
- Activities can have multiple rewards.
- Users can mark activities completed.
- Monthly/daily/weekly completion resets:
  - Monthly reward should be reset on the 1st day of a month, 5AM in Beijing timezone.
  - Weekly reward reset on each Monday 5AM, Beijing timezone.
  - Daily reward reset on each day 5AM, Beijing timezone.
- We need disclaimer as footer in every page. “Unofficial fan-made guide. Where Winds Meet and related game assets are property of NetEase/Everstone Studio. This site is not affiliated with or endorsed by NetEase.”

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