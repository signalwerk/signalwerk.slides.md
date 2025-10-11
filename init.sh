echo "enter the talk-name: example 'Image style transfer and digital image generation with AI'"
read talktitle

echo "enter the talk-name of the repo: example 'ai-image-generation'"
read talkname

# fulltalkname="talk.ai-image-generation"
fulltalkname="talk.$talkname"

echo "Choose root directory:"
echo "1) \$HOME/../DATA/CODE (default)"
echo "2) Current folder ($(pwd))"
read -p "Enter choice (1 or 2) [default: 1]: " root_choice

if [ "$root_choice" = "2" ]; then
    root="$(pwd)"
else
    root="$HOME/../DATA/CODE"
fi

echo "Repository visibility:"
echo "1) Public (default)"
echo "2) Private"
read -p "Enter choice (1 or 2) [default: 1]: " visibility_choice

if [ "$visibility_choice" = "2" ]; then
    repo_visibility="--private"
else
    repo_visibility="--public"
fi

cd "${root}/" || exit

gh repo create "$fulltalkname" $repo_visibility --clone

cd "${root}/$fulltalkname" || exit

mkdir -p ./docs/img
touch ./docs/.nojekyll

## download and cut html out of readme
curl "https://raw.githubusercontent.com/signalwerk/signalwerk.slides.md/main/README.md" | sed -e/DOCTYPE/\{ -e:1 -en\;b1 -e\} -ed  | awk '/```/{stop=1} stop==0{print}' > ./docs/index.html

## add initial slides
curl "https://raw.githubusercontent.com/signalwerk/signalwerk.slides.md/main/public/slides.md" > ./docs/slides.md

## set title
sed -i '' -E "s|(<title>)([^<]+)(</title>)|\1$talktitle\3|g" ./docs/index.html
sed -i '' -E "s|title:.*|title: $talktitle|g" ./docs/slides.md


bts='```'
bt='`'

readme=$(cat << EOF
# $talktitle

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
year=`date +'%Y'`
info="- [$year · $talktitle](https://signalwerk.github.io/$fulltalkname/) ([repo](https://github.com/signalwerk/$fulltalkname))"
echo "$info" >> "${root}/signalwerk.slides.md/README.md"
echo "$info" >> "${root}/talks/README.md"
echo "ℹ️ signalwerk.slides.md is now having a new line in the readme.md"

git add -A README.md
git add -A ./docs/index.html
git add -A ./docs/.nojekyll

git commit -m "ADD: initial slides setup"

git push origin HEAD:main


gittower "${root}/$fulltalkname"
code .
gh repo view -w

live-server
