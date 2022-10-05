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
      href="https://fonts.signalwerk.ch/css/latest/family=Open+Sans:ital,wght@0,300..800;1,300..800.css"
      rel="stylesheet"
    />
    <link
      href="https://fonts.signalwerk.ch/css/latest/family=Noto+Emoji:wght@300..700.css"
      rel="stylesheet"
    />
    <!-- styles -->
    <link
      rel="stylesheet"
      href="https://rawcdn.githack.com/signalwerk/signalwerk.slides.md/e73e10b/base.css"
      media="all"
    />
  </head>
  <body>
    <!-- page content -->
    <signalwerk-slides href="slides.md"></signalwerk-slides>
    <!-- logic -->
    <script src="https://rawcdn.githack.com/signalwerk/signalwerk.slides.md/e73e10b/index.js"></script>
  </body>
</html>
```

## Setup · versioned

```sh
bash <(curl -s https://raw.githubusercontent.com/signalwerk/signalwerk.slides.md/main/init.sh)
```

## Live preview

Make sure you have live-server (${bt}npm install -g live-server${bt})

```sh
live-server
```

## Usage

- [signalwerk · Image style transfer and digital image generation with AI](https://signalwerk.github.io/talk.ai-image-generation/)
