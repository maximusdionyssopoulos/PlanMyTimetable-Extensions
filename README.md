# PlanMyTimetable Capture

The browser extensions for the [PlanMyTimetable](https://github.com/s3943811/PlanMyTimetable), [web app](https://planmytimetable.vercel.app).

## Features

- Select multiple classes & individual classes
- Capture data from Allocate+ and redirect to the [web app](https://planmytimetable.vercel.app).

## Comptability

### Browsers

[Firefox](https://addons.mozilla.org/en-US/firefox/addon/planmytimetable-capture/) and [Chrome](https://chromewebstore.google.com/detail/planmytimetable-capture/copaeobjeemflpmmdlbllpoldganmdpa) (this includes Chromium based browser like Edge, Arc, Brave or Opera).

Unfortunately, a Safari browser extension is not available due to Apple's pricing policies. Instead you can use the [bookmark](https://planmytimetable.vercel.app/classes/add).

### University Support

Currently, the browser extension is only confirmed to work at:

- RMIT University
- Melbourne University.

I am currently working on adding support for Monash University. If your university uses Allocate+, please open a new issue to request support.

## Privacy

All operations occur on-device with no data ever sent to a server.

## Development

I used the [wxt framework](https://wxt.dev/) to create the browser extensions. For the popup, I used Solid JS due to its small bundle size and performant features. 

### Why are there different Firefox and Chrome extensions

- As Firefox doesn't support running scripts in the "MAIN" world and instead has other methods to achieve the same goal, different code must be run. Whilst, this can be done at runtime with the wxt framework, having seperate code bases allows me to use SVGs on Firefox (not supported on Chromium), and different CSS for the scrollbars (Firefox doesn't support ::-webkit-scrollbar).
