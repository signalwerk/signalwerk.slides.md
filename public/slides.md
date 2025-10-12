---
theme: signalwerk
title: This is the title of the Slides
---

```fm
style: negative
background: true
```

## Hello _👋_

# {{process.content.frontmatter.title}}

_Why not a sub title?_

<footer>

202X · Zurich · Stefan Huber

</footer>

--s--

```fm
style: image
background:
  image: https://portrait.signalwerk.ch/illustration/2020/rgb/w4000/stefan-huber.jpg
  position: 50% 40%
```

## Stefan

<div class="box box--w40p box--bottom box--white box--padding small">

- Developer
- ❦ Typography

</div>

<footer class="footer--right">

Illustration by [Benjamin Güdel](http://www.guedel.biz/) · 2020

</footer>

--s--

## Slide Title _emphasis_ and **strong**

# Slide Title _emphasis_ and **strong**

### H3 Subtitle

- Text [Link](https://github.com)
- Text _emphasis_ and **strong**

<footer>

Footer: Text [Link](https://github.com) with _emphasis_ and **strong**

</footer>

--s--

```fm
style: negative
background: true
```

## Slide Title _emphasis_ and **strong**

# Slide Title _emphasis_ and **strong**

### H3 Subtitle

- Text [Link](https://github.com)
- Text _emphasis_ and **strong**

<footer>

Footer: Text [Link](https://github.com) with _emphasis_ and **strong**

</footer>

--s--

## Big Picture

<div class="box box--w50p box--img-cover box--right">

![alt text](https://portrait.signalwerk.ch/illustration/2020/rgb/w4000/stefan-huber.jpg)

</div>

--s--

## Image with caption

<figure>

![alt text](https://portrait.signalwerk.ch/illustration/2020/rgb/w4000/stefan-huber.jpg)

<figcaption>hello</figcaption>
</figure>

--s--

## Image by height (default)

![alt text](https://portrait.signalwerk.ch/illustration/2020/rgb/w4000/stefan-huber.jpg)

--s--

## Image by width

<div class="box--w80p img--w100p">

<figure class="img--pixelate">

![](https://interaction.signalwerk.ch/static/10d37901c8fc48a669e8ba7775138082/b6a9b/Microsoft_BW_Arial_a_waterfall.png)

<figcaption>

80 % width · pixelated rendering

</figcaption>
</figure>

</div>

---

<div class="box--w60p img--w100p">

<figure class="img--pixelate">

![](https://interaction.signalwerk.ch/static/10d37901c8fc48a669e8ba7775138082/b6a9b/Microsoft_BW_Arial_a_waterfall.png)

<figcaption>

60 % width · pixelated rendering

</figcaption>
</figure>

</div>

--s--

## Grid

<div class="grid">
<div class="col8 img--w100p">

8 Column

</div>
<div class="col4">

4 Column

</div>
</div>

--s--

## Video

<video controls>
  <source src="/img-curve/bezier-by-adobe.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

--s--

## Table

| Syntax    | Description |   Test Text |
| :-------- | :---------: | ----------: |
| Header    |    Title    | Here's this |
| Paragraph |    Text     |    And more |

--s--

## iFrame

<div class="box--w80p box--ratio-16-9">
<iframe
  className="iframe--fill"
  src="https://player.vimeo.com/video/213887934?title=0&byline=0&portrait=0vz#t=0m25s">
</iframe>
</div>

--s--

```fm
style: image
background:
  iframe: https://signalwerk.github.io/visual.spiral-3d.typo/
```

## iFrame as background

--s--

## Code

```html
<html lang="en">
  <head>
    <title>title</title>
  </head>
  <body>
    <!-- page content -->
  </body>
</html>
```

--s--

## Print

- Add [`?print`](./?print) to the URL to get a printable version
- The utility class `.noPrint` hides elements in print

<div class="noPrint">

- This is not visible in print

</div>

--s--

```fm
style: negative
background: true
```

## exit 0; thx

# _Questions?_

<style>
  .contact-links {
    padding-bottom: 1rem;
    font-size: .8rem;
  }
  .contact-links a {
    color: white;
  }
  .contact-links a:after {
    display: none;
  }
</style>

<footer class="contact-links">

**Stefan Huber** · sh@signalwerk.ch  
[mastodon.social/@signalwerk](https://mastodon.social/@signalwerk)  
[instagram.com/signalwerk](https://instagram.com/signalwerk)  
[linkedin.com/in/signalwerk](https://linkedin.com/in/signalwerk)  
[github.com/signalwerk](https://github.com/signalwerk)

</footer>
