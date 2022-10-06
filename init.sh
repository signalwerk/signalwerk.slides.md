echo "enter the talk-name of the repo: example 'ai-image-generation'"
read talkname

# fulltalkname="talk.ai-image-generation"
fulltalkname="talk.$talkname"

cd "$HOME/CODE/"

gh repo create "$fulltalkname" --public --clone

cd "$HOME/CODE/$fulltalkname"

mkdir -p ./docs/img
touch ./docs/.nojekyll

## download and cut html out of readme
curl "https://raw.githubusercontent.com/signalwerk/signalwerk.slides.md/main/README.md" | sed -e/DOCTYPE/\{ -e:1 -en\;b1 -e\} -ed  | awk '/```/{stop=1} stop==0{print}' > ./docs/index.html

## add initial slides
curl "https://raw.githubusercontent.com/signalwerk/signalwerk.slides.md/main/public/example.md" > ./docs/slides.md



bts='```'
bt='`'

readme=$(cat << EOF
# $fulltalkname

[Show Slides](https://signalwerk.github.io/$fulltalkname/)

---

## Live preview

Make sure you have live-server (${bt}npm install -g live-server${bt}) installed.

${bts}sh
live-server
$bts

## Update slides framework

${bts}sh
bash <(curl -s https://raw.githubusercontent.com/signalwerk/signalwerk.slides.md/main/update.sh)
$bts

EOF
)

echo "$readme" > README.md

## add to readme
echo "- [signalwerk · $fulltalkname](https://signalwerk.github.io/$fulltalkname/)" >> "$HOME/CODE/signalwerk.slides.md/README.md"
echo "⚠️ signalwerk.slides.md is now having a new line in the readme.md"

git add -A README.md
git add -A ./docs/index.html
git add -A ./docs/.nojekyll

git commit -m "ADD: initial slides setup"

git push origin HEAD:main


gittower "$HOME/CODE/$fulltalkname"
code .
gh repo view -w

live-server