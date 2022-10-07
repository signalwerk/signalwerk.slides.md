# Signalwerk Markdown Slides

## Usage · versioned

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>title</title>
    <!-- fonts -->
    <link rel="preconnect" href="https://fonts.signalwerk.ch" />
    <link
      href="https://fonts.signalwerk.ch/css/latest/family=Work+Sans:ital,wght@0,100..900;1,100..900.css"
      rel="stylesheet"
    />
    <link
      href="https://fonts.signalwerk.ch/css/latest/family=Noto+Emoji:wght@300..700.css"
      rel="stylesheet"
    />
    <!-- styles -->
    <link
      rel="stylesheet"
      href="https://rawcdn.githack.com/signalwerk/signalwerk.slides.md/cbb12a5/base.css"
      media="all"
    />
  </head>
  <body>
    <!-- page content -->
    <signalwerk-slides href="slides.md"></signalwerk-slides>
    <!-- logic -->
    <script src="https://rawcdn.githack.com/signalwerk/signalwerk.slides.md/cbb12a5/index.js"></script>
  </body>
</html>
```

## Setup · versioned

```sh
bash <(curl -s https://raw.githubusercontent.com/signalwerk/signalwerk.slides.md/main/init.sh)
```

## update · versioned

```sh
bash <(curl -s https://raw.githubusercontent.com/signalwerk/signalwerk.slides.md/main/update.sh)
```

## Live preview

Make sure you have live-server (`npm install -g live-server`)

```sh
live-server
```

You can add a `href` parameter to the query string (`?href=http://examlple.com/slides.md`) in the browser to override the slides location where we will load the markdown from.

## Usage

- [2022 · Image style transfer and digital image generation with AI](https://signalwerk.github.io/talk.ai-image-generation/)
- [2022 · How to preserve curves](https://signalwerk.github.io/talk.preserve.curves/)
