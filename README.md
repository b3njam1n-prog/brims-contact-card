# BRIMS Heritage Resource Centre — Contact Card

A responsive, static Netlify site with an editorial vintage aesthetic, BRIMS logo artwork, custom line-drawn heritage icons, contact-card download/share, a featured event panel, Google Calendar integration, and a Decap CMS admin area.

## What's included

- `index.html`, `styles.css`, `app.js` — the contact card
- `assets/` — supplied BRIMS logo artwork and resized visual references
- `content/site.json` — editable public contact details
- `content/event.json` — one editable featured event (unpublished by default)
- `admin/` — Decap CMS configuration and login interface
- `netlify.toml` — static publish configuration and basic headers

## Deploy to Netlify

1. Extract this folder and push its contents to a Git repository (GitHub, GitLab, or Bitbucket).
2. In Netlify, choose **Add new site → Import an existing project**, connect the repository, and set the publish directory to `.`. No build command is required.
3. After deployment, edit `admin/config.yml`: replace both `YOUR-SITE-NAME` values with the deployed Netlify hostname.
4. For the CMS, configure Netlify Identity and Git Gateway for the site and invite the editor accounts. Enable Git Gateway with the repository's `main` branch. Test the `/admin/` login after setup. CMS login will not work until this provider setup is completed.
5. To edit the featured event, open `/admin/`, sign in, and edit **Featured event**. Leave **Publish event** off until the event title, start/end times, venue and other details are confirmed. Publishing commits the JSON update to the configured repository.

> CMS provider setup may vary with Netlify's current identity/Git Gateway availability and your site's configuration. If Git Gateway is not offered for your account, use Decap CMS with a supported Git provider backend and its corresponding OAuth configuration.

## Verify BRIMS contact details before publishing

Public sources consulted list `brimsheritage@gmail.com`, `https://brimsheritage.org/`, the location Janda, Namugongo, Wakiso District, and the X profile `https://x.com/BRIMSHERITAGE`. A UCOMA profile's phone number appears incomplete, while the X profile publishes `+256772446323`. This number is included as the best complete publicly listed option, but please confirm it with BRIMS before launch. Contact details can be edited in `content/site.json` or through the CMS once configured.

The page does not invent a future event. It displays an elegant no-event state until a confirmed event is published.

## Contact file and calendar behaviour

- The contact button shares a `.vcf` file through the device share sheet when file sharing is supported, otherwise it downloads the file.
- Google Contacts is opened separately so the visitor can import the downloaded `.vcf`; a static site cannot silently save contacts into a visitor's Google account.
- A published event provides an `Add to Google Calendar` URL and downloadable `.ics` invitation. Event times should be entered as real date/time values and are presented in `Africa/Kampala` (East Africa Time).

## Social links

The X account is linked because it was identifiable in public search results. No unambiguously official Instagram or Facebook profile URL was verified in the search performed for this build, so those links have not been guessed.
