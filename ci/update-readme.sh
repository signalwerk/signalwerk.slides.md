# Exit with nonzero exit code if anything fails
set -e

echo "-- start"

# get the hash
hash=`git ls-remote | grep refs/heads/gh-pages | cut -f 1 | awk '{ print substr($1,1,7) }'`
echo "   * hash: $hash"

# macos
# sed -i '' -E "s/(signalwerk.slides.md\/)[a-f0-9]{7}(\/)/\1$hash\2/g" README.md
sed -i -r "s/(signalwerk.slides.md\/)[a-f0-9]{7}(\/)/\1$hash\2/g" README.md


echo "-- end"
