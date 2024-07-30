# 🗑️ TrashCard

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE)
[![hacs_badge](https://img.shields.io/badge/HACS-DEFAULT-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

![Project Maintenance][maintenance-shield]
[![GitHub Activity][commits-shield]][commits]
![downloads][downloads-badge]
![Build][build-badge]

<a href="https://www.buymeacoffee.com/idaho" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/white_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

<img width="510" alt="new-overview" src="https://github.com/idaho/hassio-trash-card/assets/664101/8adeaf6a-f236-4972-805d-e173c3aa554b">
Never forget garbage collection day again!

TrashCard is a custom Home Assistant card that displays the your current and upcoming trash collection schedule. 
It uses events contained within the local calendar integration to display the information.

**Features**
- Extra colors, icons and text for residual, organic, paper waste and recycling events.
- Colors and icons for all other events.
- A filter for events.

## Pre-Requirements

TrashCard requires:
- [Mushroom][mushroom-url] for Home Assistant.
- The [Home Assistant calendar integration](https://www.home-assistant.io/integrations/#calendar).

Once you have both of these installed, you can install TashCard either:
- Through HACS.
- Manually.

## Installation

### HACS

TrashCard is available in [HACS][hacs] (Home Assistant Community Store).

1.	Install HACS if you haven’t already.
2.	Open HACS in Home Assistant.
3.	Go to the "Frontend" section.
4.	Click the "+" icon.
5.	Search for "TrashCard".

### Manual

1. Download the latest [latest release][release-url] of `trashcard.js` from the GitHub repository.
2. Add `trashcard.js` into your config/www folder.

You must then add a reference to `trashcard.js` in your Dashboard. There are two methods for doing this:

**Using the UI:** 

- _Settings_ → _Dashboards_ → _More Options icon_ → _Resources_ → _Add Resource_ → Set _Url_ as `/local/trashcard.js` → Set _Resource type_ as `JavaScript Module`.
  
**Note:** If you do not see the Resources menu, you will need to enable _Advanced Mode_ in your _User Profile_

**Using YAML:**

Add following code to the `lovelace` section in configuration.yaml:


      ```yaml
      resources:
        - url: /local/trashcard.js
          type: module
      ```

## Usage

### Create events in your calendar
In order for TrashCard to display information, your garbage collection schedule needs to be added in the local calendar.
Creating a dedicated “Garbage collection” calendar for this purpose is a good way to keep things organised.

Note:
- When adding the dates, the events must be set to “Full day”.
- Repeating events are supported.
- The event name (in the “summary” field) must be the same name as the type of collection event.
- Up to five different types of collection events are supported (Garbage, recycling, organic waste etc.).

## Configuration

The TrashCard cards can be configured using the Dashboard UI editor.

### Add a new card
1.	In the Dashboard UI, click the 3 dots in top right corner.
2.	Click Edit Dashboard.
3.	Click the Plus button to add a new card.
4.	Find the Custom: TrashCard card in the list.
5.	Set the entity to the calendar that contains the collection events.


All the options listed below are available in the lovelace editor, but configuring via `yaml` is supported too.

| Name                | Type                                                | Default     | Description                                                                         |
| :------------------ | :-------------------------------------------------- | :---------- | :---------------------------------------------------------------------------------- |
| `entities`            | array of strings                                              | Required    | The calendar(s) containing the collection events.                        |
| `layout`            | string                                              | Optional    | Layout of the card. Vertical, horizontal and default layouts are supported.           |
| `fill_container`    | boolean                                             | `false`     | Fill container or not. Useful when card is in a grid, vertical or horizontal layout. |
| `filter_events`     | boolean                                             | `false`     | Filter and display events from the calendar by names (if at least one is defined). |
| `full_size`         | boolean                                             | `false`     | Show the card without the default card margins. |
| `drop_todayevents_from`         | time                                             | `10:00:00`     | From what time to hide all-day event (Format `hh:mm:ss`). |
| `use_summary`         | boolean                                             | `false`     | Shows the event summary instead of matched label. |
| `hide_time_range`         | boolean                                             | `false`     | Option to hide the time on events that aren't full day events. |
| `event_grouping`         | boolean                                             | `true`     | Only display the next event per pattern, otherwise all events during the selected time will be displayed.  |
| `next_days`         | number                                              | 2           | How many times the card will look into the future to find the next event. |
| `day_style`            | `default` or `counter` | `default`   | Option for how the date of an event should be displayed. `default` shows the date in date format and `counter` shows the number of days remaining before the event.       |
| `card_style`            | `card`, `chip` or `icon` | `card`   | Switch between the events style `Standard card`, `Chip card` or a new `Icon` predefined layout. |
| `alignment_style`            | `left`, `center`, `right` or `space` | `left`   | Switch between alignments on `Chip card` card_style. |
| `color_mode`            | `background` or `icon` | `background`   | Select whether the color settings should be applied to the background or to the icon. |
| `refresh_rate`            | integer | 60   | Check for changes in the calendar every x minutes. By default it will check every 60 minutes. Values can be set from 5 to 1440. |
| `debug`            | boolean | `false`   | Option to enable debug mode to help fixing bugs ;) . |
| `icon_size`            | integer | 40 | Size of the icons in px if you choose `card_style` as `icon` . |
| `with_label`            | boolean | `true` | Option to display the label in the card or chip style. |
| `pattern`          | array of [Pattern](#pattern)                               | Required    | Pattern to detect the kind of trash and how to display it.|


#### Pattern



| Name                | Type                                                | Default     | Description                                                                         |
| :------------------ | :-------------------------------------------------- | :---------- | :---------------------------------------------------------------------------------- |
| `type`             | `organic`, `paper`, `recycle`, `waste`, `others`, `custom`        | Required    | Label which should be shown.  |
| `label`             | string       | Required    | The label that will be displayed.  |
| `icon`              | string       | Required    | The icon that will be displayed.  |
| `color`             | string       | Required    | The background color of the card. |
| `pattern`           | string       | Required    | Pattern used to detected to display the apply this trash type. (Is tested against the calendar entry title). |
| `picture`           | string       | Optional    | Picture URL do display an image instead of an icon. |

#### Other type trash configuration

| Name                | Type                                                | Default     | Description                                                                         |
| :------------------ | :-------------------------------------------------- | :---------- | :---------------------------------------------------------------------------------- |
| `icon`              | string                                              | Required    | The icon that will be displayed.  |
| `color`             | string                                              | Required    | The background color of the card. |


### Example YAML configuration

```yaml
type: custom:trash-card
entities:
  - calendar.mags_abfuhrtermine
layout: vertical
event_grouping: true
drop_todayevents_from: '10:00:00'
next_days: 300
day_style: counter
card_style: card
color_mode: background
items_per_row: 4
refresh_rate: 60
with_label: true
filter_events: false
use_summary: false
hide_time_range: false
pattern:
  - label: Organic
    icon: mdi:flower
    pattern: braun
    color: light-green
    type: organic
  - label: Paper
    icon: mdi:newspaper-variant-multiple-outline
    color: indigo
    pattern: blau
    type: paper
  - label: Recycling
    pattern: gelb
    icon: mdi:recycle-variant
    color: amber
    type: recycle
  - pattern: grau
    icon: mdi:trash-can
    label: Waste
    color: dark-grey
    type: waste
  - icon: mdi:dump-truck
    color: purple
    type: others
  - label: Electric
    icon: mdi:electron-framework
    color: pink
    type: custom
    pattern: elektro
```

## Screenshots

### Layout icons
<img width="482" alt="layout-icons" src="https://github.com/idaho/hassio-trash-card/assets/664101/b1509694-7ece-49a4-8f84-6298731e315f">

### Layout chips
<img width="1043" alt="layout-chips" src="https://github.com/idaho/hassio-trash-card/assets/664101/c420d073-c65d-41cc-8d47-c296c1c03fd4">

### Layout cards
![layout-cards](https://github.com/idaho/hassio-trash-card/assets/664101/f3f3130c-172f-42dc-aaca-2bc0c9a3bc26)

### Use picture instead of icons
<img width="1032" alt="with-image" src="https://github.com/idaho/hassio-trash-card/assets/664101/212537e0-65d3-4c2c-a25c-9431d7ff04b9">

## Thanks

Thanks go to the team at [Mushroom][mushroom-url] for creating many beautiful cards.



<!-- Badges -->


[commits-shield]: https://img.shields.io/github/commit-activity/y/idaho/hassio-trash-card.svg?style=for-the-badge
[commits]: https://github.com/idaho/hassio-trash-card/commits/main
[license-shield]: https://img.shields.io/github/license/idaho/hassio-trash-card.svg?style=for-the-badge
[maintenance-shield]: https://img.shields.io/maintenance/yes/2024.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/idaho/hassio-trash-card.svg?style=for-the-badge
[releases]: https://github.com/idaho/hassio-trash-card/releases
[downloads-badge]: https://img.shields.io/github/downloads/idaho/hassio-trash-card/total?style=for-the-badge
[build-badge]: https://img.shields.io/github/actions/workflow/status/idaho/hassio-trash-card/build.yml?label=Build&style=for-the-badge




<!-- References -->
[mushroom-url]: https://github.com/piitaya/lovelace-mushroom
[home-assistant]: https://www.home-assistant.io/
[home-assitant-theme-docs]: https://www.home-assistant.io/integrations/frontend/#defining-themes
[hacs]: https://hacs.xyz
[ui-lovelace-minimalist]: https://ui-lovelace-minimalist.github.io/UI/
[release-url]: https://github.com/idaho/hassio-trash-card/releases
