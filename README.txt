TECH ELEMENT LAB WEBSITE
========================
A plain static website: HTML, CSS and a little JavaScript. No build tools, no server. It runs on any host,
so moving from free to paid hosting later means copying this folder.

Folder
  index.html, series.html, videos.html, about.html   the four pages
  css/style.css                                      colours and layout (same palette as the thumbnails)
  js/site.js                                         builds the pages from the two data files below
  data/config.js        YOUR TEXT AND SERIES. Edit by hand. update_website.py never changes it.
  data/videos.js        YOUR VIDEO LIST. Written by update_website.py. Do not edit by hand.
  assets/               logo and icons

Look at it on your computer
  Double-click index.html. (If a page looks empty, start a tiny local server instead:
  venv\Scripts\python.exe -m http.server 8000 --directory website   and open http://localhost:8000 )

After every YouTube upload (about 30 seconds)
  1. venv\Scripts\python.exe update_website.py
     It only READS your channel and lists your PUBLIC videos. Private and unlisted ones never appear.
  2. Publish the website folder again (see below).

Series parts
  data/config.js lists the parts of "Evolution of Microprocessors". A part shows as published when a public
  video's title contains its 'match' text; otherwise it shows "Coming soon". To add a series or part,
  copy an entry in config.js.

Publishing for free (pick one; you can move later)
  Netlify Drop     go to app.netlify.com/drop and drag the website folder in. You get a free address.
                   To update, drag the folder in again.
  Cloudflare Pages create a project, choose direct upload, upload the website folder.
  GitHub Pages     put the website folder in a GitHub repository and switch on Pages for it.
  Your own domain can be connected to any of these later. A domain costs a small yearly fee.

Things to check before publishing
  - data/config.js: the "about" and "made" texts are first drafts. Read and change them.
  - Do not put private files in the website folder. Only this folder is published, never the project root
    (the project root holds .env, client_secret.json and the YouTube login files).
