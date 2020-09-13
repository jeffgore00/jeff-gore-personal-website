npm run test:browser:base -- $@
exitcode=$?

echo "Test process complete. Deleting wdio.conf.js..."
npm run test:browser:cleanup
exit $((exitcode))