# Web Development Project 4 - Veni Vici

Submitted by: **Your Name Here**

This web app is a cat discovery experience that fetches random cat images and breed information from The Cat API. Users can click on displayed breed, origin, or temperament values to add them to a ban list and prevent those values from appearing in future discoveries.

Time spent: **X** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **Application features a button that creates a new API fetch request on click and displays at least three attributes and an image obtained from the returned JSON data**
  - The app displays consistent attributes across API calls: breed, origin, temperament, and life span.
- [x] **Only one item/data from API call response is viewable at a time and at least one image is displayed per API call**
  - Only one discovery is displayed at once.
  - Displayed attributes match the displayed image and breed data.
  - Each API call includes an image.
- [x] **API call response results should appear random to the user**
  - Clicking the discovery button fetches a new random cat result each time.
  - The Cat API returns a large enough dataset to keep results varied.
- [x] **Clicking on a displayed value for one attribute adds it to a displayed ban list**
  - Breed, origin, and temperament values are clickable.
  - Clicking a value immediately adds it to the ban list.
  - Clicking a ban list item removes it immediately.
- [x] **Attributes on the ban list prevent further images/API results with that attribute from being displayed**
  - Banned breed, origin, and temperament values are filtered out from future results.
  - If a cat contains a banned temperament token, it is skipped.
  - Removed ban values are reflected immediately when clicked from the ban list.

The following **optional** features are implemented:

- [x] Multiple types of attributes are clickable and can be added to the ban list
- [x] Users can see a stored history of their previously displayed results from this session
  - A dedicated section displays previously discovered cats.
  - Each time the API call button is clicked, the newest result is added to the history.

The following **additional** features are implemented:

- [x] Responsive UI for desktop and smaller screens
- [x] Clear status messages for loading, ban updates, and blocked results

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

GIF created with ...

## Notes

Challenges:
- Ensuring the ban list filters temperament properly required splitting temperament strings into tokens.
- The Cat API can return duplicate breeds, so the app retries while still preserving the ban-filter logic.

## License

Copyright 2026 Your Name Here

Licensed under the Apache License, Version 2.0 (the "License");
You may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
