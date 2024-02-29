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


TrashCard - is a custom Home Assistant card that shows you the next upcoming or current trash removal appointment. 
For this purpose a calendar entity is used, in which you have entered all appointments.

See screenshots for what you can do

**Features**
- Extra color, icon and text for residual, organic, paper waste and recycling
- Color and icon for all other appointments
- Filter out unexpected items


## Pre-Requirements

TrashCard requires [Mushroom][mushroom-url] for Home Assistant to be installed. Please follow the installation instructions of Mushroom. Once you have installed Mushroom you can continue install TrashCard using HACS (preferred) or manually.

TrashCard requires a calendar to get its data from. This calendar must be known by Home Assistant as an entity. Check [Home Assistant calednar integrations](https://www.home-assistant.io/integrations/#calendar) for more information on how to add it.

## Installation

### HACS

TrashCard is available in [HACS][hacs] (Home Assistant Community Store).

1. Install HACS if you don't have it already
2. Open HACS in Home Assistant
3. Go to "Frontend" section
4. Click button with "+" icon
5. Search for "TrashCard"

### Manual

1. Download `trashcard.js` file from the [latest release][release-url].
2. Put `trashcard.js` file into your `config/www` folder.
3. Add reference to `trashcard.js` in Dashboard. There's two way to do that:
    - **Using UI:** _Settings_ → _Dashboards_ → _More Options icon_ → _Resources_ → _Add Resource_ → Set _Url_ as `/local/trashcard.js` → Set _Resource type_ as `JavaScript Module`.
      **Note:** If you do not see the Resources menu, you will need to enable _Advanced Mode_ in your _User Profile_
    - **Using YAML:** Add following code to `lovelace` section.

      ```yaml
      resources:
        - url: /local/trashcard.js
          type: module
      ```

## Usage

### Create events in your calendar
In order for the Trash card to display informations, they need to be existing in a calendar. Here's some rules to follow when creating the events in your calendar: 

1. It must be entire day events (only form of events supported at the moment)
2. You must use the same event name for the same method of collection. You'll map them later. Right now, the card support up to 5 different type of collections
3. You can use repeating events, that's totally fine.



## Configuration

The TrashCard cards can be configured using Dashboard UI editor.

### Add a new card
1. In Dashboard UI, click 3 dots in top right corner.
2. Click _Edit Dashboard_.
3. Click Plus button to add a new card.
4. Find the _Custom: TrashCard_ card in the list.

### Configure the card
Here's simple steps to follow to configure the trash card with the UI, we'll go throw all the differents configuration field with you: 
![O](https://github.com/idaho/hassio-trash-card/assets/1178/3610465f-0b9a-4ded-8621-9691c845acd3)

1. First, you need to select your calendar entity in the first field `Entity` (can be different because it's translated in your own language). 
2. Then, for all the different collection, you'll have to fill those fiels: 
    a. `Label` is the text you want to be displayed in your card. It can be anything
    b. `Icon` is the icon you can to be used in your card. You can select through the availabla HA icons, and even start typing to search
    c. `Color` is the color you want your card to be. ⚠️ it's not gonna be the color of the icon but of the card itself
    d. `Pattern` is the event title you used when creating events in your calendar. For example, for recycling, mine is "PMC", because that's the event name in my calendar.
3. `day style` is how to display the information. Full date or "in xx days"
4. `drop today events from` is at which hour you want to stop displaying today's collection
5. `next days` is how many days in the future the card will look up. If there is no upcoming event in the next XX days you selected here, **the card will not display at all**. 

![O](https://github.com/idaho/hassio-trash-card/assets/1178/074164cd-9865-4edc-be48-216b7acba3e5)

All the options are available in the lovelace editor but you can use `yaml` if you want.

| Name                | Type                                                | Default     | Description                                                                         |
| :------------------ | :-------------------------------------------------- | :---------- | :---------------------------------------------------------------------------------- |
| `entities`            | array of strings                                              | Required    | Entities                                                                              |
| `layout`            | string                                              | Optional    | Layout of the card. Vertical, horizontal and default layout are supported           |
| `fill_container`    | boolean                                             | `false`     | Fill container or not. Useful when card is in a grid, vertical or horizontal layout |
| `filter_events`     | boolean                                             | `false`     | Filter fetched events by patterns (if at least one is defined) before selecting the one to display |
| `full_size`         | boolean                                             | `false`     | Show the card without the default card margins |
| `drop_todayevents_from`         | time                                             | `10:00:00`     | From what time to hide all-day event (Format `hh:mm:ss`) |
| `use_summary`         | boolean                                             | `false`     | Shows  the event summary instead of matched label |
| `hide_time_range`         | boolean                                             | `false`     | Option to hide the time on events which aren't fill day events |
| `event_grouping`         | boolean                                             | `true`     | Only display the next event per pattern, otherwise all events during the selected time will be displayed  |
| `next_days`         | number                                              | 2           | How many times the card will look into the future to find the next event |
| `day_style`            | `default` or `counter` | `default`   | Option of how the date of an event should be displayed. `default` shows the date in date format and `counter` shows the number of days remaining until the event.       |
| `card_style`            | `card`, `chip` or `icon` | `card`   | Switch between the events style `Standard card`, `Chip card` or a new `Icon` predefined layout. |
| `color_mode`            | `background` or `icon` | `background`   | Select whether the color settings should be applied to the background or to the symbol |
| `refresh_rate`            | integer | 60   | Check for changes in the calendar every x minutes, by default we will check every 60 minutes. Values can be set from 5 to 1440. |
| `debug`            | boolean | `false`   | Option to enable debug mode to help fixing bugs ;) . |
| `icon_size`            | integer | 40 | Size of the icons in px if you choose `card_style` as `icon` . |
| `with_label`            | boolean | `true` | Option to decide if you want to see the label in the card or the chip style. |
| `pattern`          | array of [Pattern](#pattern)                               | Required    | Pattern to detect the kind of trash and how to display it.|


#### Pattern



| Name                | Type                                                | Default     | Description                                                                         |
| :------------------ | :-------------------------------------------------- | :---------- | :---------------------------------------------------------------------------------- |
| `type`             | `organic`, `paper`, `recycle`, `waste`, `others`, `custom`        | Required    | Label which should be shown  |
| `label`             | string       | Required    | Label which should be shown  |
| `icon`              | string       | Required    | Icon which should be displayed  |
| `color`             | string       | Required    | Background color of the card which should be used |
| `pattern`           | string       | Required    | Pattern used to detected to display the apply this trash type. (Is tested against the calendar entry title) |
| `picture`           | string       | Optional    | picture url to a image to show instead of the icon |

#### Other type trash configuration

| Name                | Type                                                | Default     | Description                                                                         |
| :------------------ | :-------------------------------------------------- | :---------- | :---------------------------------------------------------------------------------- |
| `icon`              | string                                              | Required    | Icon which should be displayed  |
| `color`             | string                                              | Required    | Background color of the card which should be used |


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
[maintenance-shield]: https://img.shields.io/maintenance/yes/2023.svg?style=for-the-badge
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
