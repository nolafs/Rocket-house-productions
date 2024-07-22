Security Release Process
========================

Site maintained by Biff New Media. This is fully private project and has adopted the following security disclosure and response policy to ensure we responsibly handle critical issues.

Supported Versions
-------------------

The project maintains one release branche and three most recent minor releases. Preview prefix pull request are automatically deployed to preview link. Feature and Test branches are manually released for testing. Applicable fixes, including security fixes, may be backported depending on severity and feasibility. Please refer to CHANGELOG.md for details.

Reporting a Vulnerability - Private Disclosure Process
------------------------------------------------------

Security is of the highest importance and all security vulnerabilities or suspected security vulnerabilities should be reported to Biff New media privately, to minimize attacks against c before they are fixed. Vulnerabilities will be investigated and patched on the next patch (or minor) release as soon as possible. This information could be kept entirely internal to the project.

If you know of a publicly disclosed security vulnerability, please **IMMEDIATELY** contact security@biffnewmedia.com to inform the Biff New Media Team.

**IMPORTANT: Do not file public issues on GitHub for security vulnerabilities**

To report a vulnerability or a security-related issue, please email the private address with the details of the vulnerability. The email will be fielded by the Biff Team, who have committer and release permissions. Emails will be addressed within 3 business days, including a detailed plan to investigate the issue and any potential workarounds to perform in the meantime. Do not report non-security-impacting bugs through this channel.

Use Github issues or Biff's issue tracker instead.

Proposed Email Content
-----------------------

Provide a descriptive subject line and in the body of the email include the following information:

-   Basic identity information, such as your name and your affiliation or company.
-   Detailed steps to reproduce the vulnerability (POC scripts, screenshots, and compressed packet captures are all helpful to us).
-   Description of the effects of the vulnerability and steps for reproducing it.
-   How the vulnerability affects Site usage and an estimation of the attack surface if there is one.
-   List dependencies and version

**When to report a vulnerability**

-   When you think there are potential security vulnerability.
-   When you suspect a potential vulnerability, but you are unsure that it impacts.
-   When you know of or suspect a potential vulnerability the project and dependencies

Patch, Release, and Disclosure
------------------------------

The Biff Team will respond to vulnerability reports as follows:

1.  The Team will investigate the vulnerability and determine its effects and criticality.
2.  If the issue is not deemed to be a vulnerability, the Team will follow up with a detailed reason for rejection.
3.  The Security Team will initiate a conversation with the reporter within 3 business days.
4.  If a vulnerability is acknowledged and the timeline for a fix is determined, the Biff Team will work on a plan to communicate with the appropriate community, including identifying mitigating steps that affected users can take to protect themselves until the fix is rolled out.
5.  The Team will work on fixing the vulnerability and perform internal testing before preparing to roll out the fix.
6.  The Team will provide early disclosure of the vulnerability by contacting the Client directly or via Biff's issue tracking tool. Feedback can be provided before release.
7.  A public deployment is discussed with Team and all stakeholders and the bug submitter. We prefer to fully disclose the bug as soon as possible and release patch. It is reasonable to delay disclosure when the bug or the fix is not yet fully understood, the solution is not well-tested, or for distributor coordination. The timeframe for disclosure is from immediate (especially if it's already publicly known) to a few weeks. For a critical vulnerability with a straightforward mitigation, we expect report date to public disclosure date to be on the order of 14 business days. The Biff Team holds the final say when setting a public disclosure date.
8.  Once the fix is confirmed, the Biff Team will patch the vulnerability in the next patch or minor release and backport a patch release into all earlier supported releases.

Disclosure Process
------------------

The Biff Team publishes communication via GitHub. In most cases, additional communication via Slack and Biff's issue tracker.