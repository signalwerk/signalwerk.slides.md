# store old title
TITLE=`sed -n -r "s|<title>([^<]+)</title>|\1|p" ./docs/index.html`

# remove leading whitespace characters
TITLE="${TITLE#"${TITLE%%[![:space:]]*}"}"
# remove trailing whitespace characters
TITLE="${TITLE%"${TITLE##*[![:space:]]}"}" 

echo "  * store title: '$TITLE'"

# store module names (extract from lines between <!-- modules --> and </body>)
MODULE_NAMES=$(sed -n '/<!-- modules -->/,/<\/body>/p' ./docs/index.html | grep -o 'modules/[^/]*/index.js' | sed 's|modules/||; s|/index.js||')

if [ -n "$MODULE_NAMES" ]; then
  echo "  * store modules: $MODULE_NAMES"
fi

# download new html
curl -H 'Cache-Control: no-cache, no-store' "https://raw.githubusercontent.com/signalwerk/signalwerk.slides.md/main/README.md" | sed -e/DOCTYPE/\{ -e:1 -en\;b1 -e\} -ed  | awk '/```/{stop=1} stop==0{print}' > ./docs/index.html

# bring in the title

# MacOS
sed -i '' -E "s|(<title>)([^<]+)(</title>)|\1$TITLE\3|g" ./docs/index.html

# Linux
# sed -i -r "s|(<title>)([^<]+)(</title>)|\1$TITLE\3|g" ./docs/index.html

# restore modules if they existed
if [ -n "$MODULE_NAMES" ]; then
  # extract new hash from the updated HTML
  NEW_HASH=$(grep -o 'signalwerk.slides.md/[^/]*/index.js' ./docs/index.html | head -1 | sed 's|signalwerk.slides.md/||; s|/index.js||')
  
  echo "  * restore modules with new hash: $NEW_HASH"

  # ensure marker exists so modules can be found on next run
  if ! grep -q '<!-- modules -->' ./docs/index.html; then
    # MacOS
    sed -i '' "/<\/body>/i\\
    <!-- modules -->
" ./docs/index.html

    # Linux
    # sed -i "/<\/body>/i\
    # <!-- modules -->
    # " ./docs/index.html
  fi

  # restore module script tags with new hash (in-place, no temporary file)
  for MODULE in $MODULE_NAMES; do
    # MacOS
    sed -i '' "/<\/body>/i\\
    <script src=\"https://rawcdn.githack.com/signalwerk/signalwerk.slides.md/$NEW_HASH/modules/$MODULE/index.js\"></script>
" ./docs/index.html

    # Linux
    # sed -i "/<\/body>/i\
    # <script src=\"https://rawcdn.githack.com/signalwerk/signalwerk.slides.md/$NEW_HASH/modules/$MODULE/index.js\"></script>
    # " ./docs/index.html
  done
fi