@echo off
echo Installing Jekyll and dependencies...
echo.
echo Step 1: Installing Jekyll and Bundler gems
gem install jekyll bundler

echo.
echo Step 2: Installing project dependencies
bundle install

echo.
echo Step 3: Starting Jekyll development server
echo Your site will be available at: http://localhost:4000
echo Press Ctrl+C to stop the server
echo.
bundle exec jekyll serve --livereload

pause
