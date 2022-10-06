# Exit with nonzero exit code if anything fails
set -e

echo "-- start"

git config user.name "GitHub Action"
git config user.email "action@github.com"

hash=`git ls-remote | grep refs/heads/gh-pages | cut -f 1 | awk '{ print substr($1,1,7) }'`
echo "   * hash: $hash"

# macos
# sed -i '' -E "s/(signalwerk.slides.md\/)[a-f0-9]{7}(\/)/\1$hash\2/g" README.md
sed -i -r "s/(signalwerk.slides.md\/)[a-f0-9]{7}(\/)/\1$hash\2/g" README.md

git status

git add -A README.md

# only commit if something is to commit
git diff --exit-code || git commit -m "Update readme [CI SKIP]"

echo "   * push git"
git push origin HEAD:main

echo "-- end"
