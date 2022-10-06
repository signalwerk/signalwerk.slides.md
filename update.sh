# store old title
TITLE=`sed -n -r "s|<title>([^<]+)</title>|\1|p" ./docs/index.html`

# remove leading whitespace characters
TITLE="${TITLE#"${TITLE%%[![:space:]]*}"}"
# remove trailing whitespace characters
TITLE="${TITLE%"${TITLE##*[![:space:]]}"}" 

echo "  * store title: '$TITLE'"

# download new html
curl "https://raw.githubusercontent.com/signalwerk/signalwerk.slides.md/main/README.md" | sed -e/DOCTYPE/\{ -e:1 -en\;b1 -e\} -ed  | awk '/```/{stop=1} stop==0{print}' > ./docs/index.html

# bring in the title

# MacOS
sed -i '' -E "s|(<title>)([^<]+)(</title>)|\1$TITLE\3|g" ./docs/index.html

# Linux
# sed -i -r "s|(<title>)([^<]+)(</title>)|\1$TITLE\3|g" ./docs/index.html