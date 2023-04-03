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
    <link
      href="https://fonts.signalwerk.ch/css/latest/family=IBM+Plex+Mono:ital,wght@0,400..700;1,400..700.css"
      rel="stylesheet"
    />
    <!-- styles -->
    <link
      rel="stylesheet"
      href="https://rawcdn.githack.com/signalwerk/signalwerk.slides.md/9875ea5/base.css"
      media="all"
    />
  </head>
  <body>
    <!-- page content -->
    <signalwerk-slides href="slides.md"></signalwerk-slides>
    <!-- logic -->
    <script src="https://rawcdn.githack.com/signalwerk/signalwerk.slides.md/9875ea5/index.js"></script>
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

- [2022 · Image style transfer and digital image generation with AI](https://signalwerk.github.io/talk.ai-image-generation/) ([repo](https://github.com/signalwerk/talk.ai-image-generation))
- [2022 · How to preserve curves](https://signalwerk.github.io/talk.preserve.curves/) ([repo](https://github.com/signalwerk/talk.preserve.curves))
- [2022 · Text to speech](https://signalwerk.github.io/talk.text-to-speech/) ([repo](https://github.com/signalwerk/talk.text-to-speech))
- [2022 · Working only for food, shelter and experience in the 21st century](https://signalwerk.github.io/talk.caminantes-grafico.project/) ([repo](https://github.com/signalwerk/talk.caminantes-grafico.project))
- [2022 · My top three JavaScript errors](https://signalwerk.github.io/talk.js-fails/) ([repo](https://github.com/signalwerk/talk.js-fails))
- [2022 · The new color vector fonts](https://signalwerk.github.io/talk.color-fonts/) ([repo](https://github.com/signalwerk/talk.color-fonts))
- [2023 · JavaScript currying](https://signalwerk.github.io/talk.js.currying/) ([repo](https://github.com/signalwerk/talk.js.currying))
- [2023 · Generative Snowflake · Creative Coding for Secret Santa](https://signalwerk.github.io/talk.visual.snowflake/) ([repo](https://github.com/signalwerk/talk.visual.snowflake))
- [2023 · Git/GitLab/GitHub for Non-Developers](https://signalwerk.github.io/talk.git-for-non-devs/) ([repo](https://github.com/signalwerk/talk.git-for-non-devs))
- [2023 · Conversational AI - an introductory session.](https://signalwerk.github.io/talk.conversational-ai-intro/) ([repo](https://github.com/signalwerk/talk.conversational-ai-intro))
- [2023 · AI for Development and Client Projects](https://signalwerk.github.io/talk.ai-development/) ([repo](https://github.com/signalwerk/talk.ai-development))
- [2023 · Exploring the Impact of AI on Society and you](https://signalwerk.github.io/talk.ai-explore-impact/) ([repo](https://github.com/signalwerk/talk.ai-explore-impact))
