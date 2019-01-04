1. mvn release:clean release:prepare
  a. This will prompt for a release version; just press ENTER at all prompts to select defaults.

If we're using autoReleaseAfterClose==false, then can manually inspect if we have the OSSRH credentials - https://central.sonatype.org/pages/releasing-the-deployment.html

There would be a cmd line variant to release by hand.

