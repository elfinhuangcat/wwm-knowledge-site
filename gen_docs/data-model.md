# Generated data model

## Recurring activities

`data/activities.js` exposes `window.WWM_ACTIVITIES`, an array of activity objects:

- `id`: stable identifier used in local completion-state keys.
- `period`: `Daily`, `Weekly`, or `Monthly`.
- `name`, `category`, `time`, `rewards`, `guide`, `notes`: display strings.
- `priority`: object containing `role`, `pve`, `pvp`, and `cosmetic` priority values.
- `guild`: whether the activity awards guild activity points.
- `link`: optional activity-name destination. Internal destinations are relative to the current language folder (for example, `guild/activity-guide.html` or `wiki/jianghu/trading-guide.html`); external destinations remain full HTTPS URLs. The shared site script resolves internal links without losing the GitHub Pages repository prefix. Activity IDs and the completion-state storage schema are unchanged.
- `visibility`: optional calendar-week availability, independent of `period` and its completion reset. Missing means always visible. Example:
  ```json
  {"timezone":"Asia/Shanghai","windows":[{"start":{"weekday":6,"time":"06:00"},"end":{"weekday":7,"time":"06:00"}}]}
  ```
  Weekdays use ISO numbering (Monday=1, Sunday=7); times use 24-hour `HH:mm`. Starts are inclusive and ends exclusive: an end at 06:00 includes the entire preceding 05:59 minute. Windows may wrap across Sunday/Monday; equal endpoints are empty. Multiple windows are combined with OR. Visibility controls rows and progress totals, and refreshes every minute and when the tab becomes visible again.

`data/activities.json` is a structured snapshot of the same recurring activities; the JavaScript entry point supports opening the static site directly without fetch. Keep both synchronized when updating the activity source.

The two market activities from workbook rows 47–48 use `Daily`, following the owner's explicit instruction despite the workbook's `Weekly` labels. They retain the normal daily 05:00 Beijing completion reset. Buying is visible Saturday 06:00–Sunday 06:00 (exclusive); selling Wednesday 06:00–Saturday 06:00 (exclusive). Existing IDs a1–a45 and localStorage keys are unchanged; the new IDs are a46–a47. No completion-state migration is required.

### Recommended Excel fields

Keep `频率` for completion reset frequency (`Daily` for these two rows). Add `活动ID`, `显示时区`, `开始星期`, `开始时间`, `结束星期`, and `结束时间（不含）`; use weekday dropdowns and real Excel time cells. Example buying rule: `a46 | Asia/Shanghai | 6 | 06:00 | 7 | 06:00`. Keep links in a separate `攻略链接` column, and reserve `Notes to AI Assistant` for editorial notes. If an activity later needs several windows, use a separate availability sheet keyed by `活动ID`, one window per row. Raw workbooks remain unchanged.

## Limited-time events

`data/limited-events.json` contains metadata plus an `events` array. Event objects reuse the recurring activity fields where applicable and add:

- `expirationDate`: ISO 8601 UTC timestamp. The website hides the event at and after this instant.
- `completionReset`: structured reset rule:
  - `{ "type": "daily", "hour": 5, "timezone": "Asia/Shanghai" }`
  - `{ "type": "weekly", "weekday": 1, "hour": 5, "timezone": "Asia/Shanghai" }`
  - `{ "type": "once", "at": "<ISO timestamp>" }`

Completion state remains device-local under the existing `wwm-checklist-v1` localStorage key.
