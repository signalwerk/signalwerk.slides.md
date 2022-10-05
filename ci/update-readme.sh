# Exit with nonzero exit code if anything fails
set -e

echo "-- start"

hash=`git ls-remote git@github.com:signalwerk/signalwerk.slides.md.git | grep refs/heads/gh-pages | cut -f 1 | awk '{ print substr($1,1,7) }'`
echo "   * hash: $hash"

# macos
# sed -i '' -E "s/(signalwerk.slides.md\/)[a-f0-9]{7}(\/)/\1$hash\2/g" README.md
sed -i -r "s/(signalwerk.slides.md\/)[a-f0-9]{7}(\/)/\1$hash\2/g" README.md

git add -A README.md
git commit -m "Update readme [CI SKIP]"

echo "   * push git"
git push origin HEAD:main

echo "-- end"
