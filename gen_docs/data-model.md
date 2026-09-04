# Generated data model

## Recurring activities

`data/activities.js` exposes `window.WWM_ACTIVITIES`, an array of activity objects:

- `id`: stable identifier used in local completion-state keys.
- `period`: `Daily`, `Weekly`, or `Monthly`.
- `name`, `category`, `time`, `rewards`, `guide`, `notes`: display strings.
- `priority`: object containing `role`, `pve`, `pvp`, and `cosmetic` priority values.
- `guild`: whether the activity awards guild activity points.
- `link`: optional activity-name destination.

## Limited-time events

`data/limited-events.json` contains metadata plus an `events` array. Event objects reuse the recurring activity fields where applicable and add:

- `expirationDate`: ISO 8601 UTC timestamp. The website hides the event at and after this instant.
- `completionReset`: structured reset rule:
  - `{ "type": "daily", "hour": 5, "timezone": "Asia/Shanghai" }`
  - `{ "type": "weekly", "weekday": 1, "hour": 5, "timezone": "Asia/Shanghai" }`
  - `{ "type": "once", "at": "<ISO timestamp>" }`

Completion state remains device-local under the existing `wwm-checklist-v1` localStorage key.
