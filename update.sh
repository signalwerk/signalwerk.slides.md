curl "https://raw.githubusercontent.com/signalwerk/signalwerk.slides.md/main/README.md" | sed -e/DOCTYPE/\{ -e:1 -en\;b1 -e\} -ed  | awk '/```/{stop=1} stop==0{print}' > ./docs/index.html
