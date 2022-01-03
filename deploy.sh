npm run build

cd dist

git init
git add -A
git commit -m 'deploy'

git push -f https://github.com/g6165310/moviedrama.git master:gh-pages
