const DEFAULTS = {
  name: 'BRIMS Heritage Resource Centre',
  email: 'brimsheritage@gmail.com',
  phoneDisplay: '+256 772 446 323',
  phoneE164: '+256772446323',
  website: 'https://brimsheritage.org/',
  address: 'Janda, Namugongo, Wakiso District, Uganda',
  socialX: 'https://x.com/BRIMSHERITAGE'
};

const $ = (id) => document.getElementById(id);
const escapeICS = (value = '') => String(value).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
const asICSDate = (value) => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

async function readJSON(path, fallback) {
  try {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Could not load ${path}`);
    return { ...fallback, ...(await response.json()) };
  } catch (error) {
    console.warn(error);
    return fallback;
  }
}

function makeVCard(contact) {
  const lines = [
    'BEGIN:VCARD', 'VERSION:3.0',
    `FN:${contact.name}`,
    `ORG:${contact.name}`,
    `TEL;TYPE=WORK,VOICE:${contact.phoneE164}`,
    `EMAIL;TYPE=WORK:${contact.email}`,
    `URL:${contact.website}`,
    `ADR;TYPE=WORK:;;${contact.address.replaceAll(',', '\\,')};;;;`,
    'NOTE:Heritage preservation, exhibitions, education and vintage props.',
    'END:VCARD'
  ];
  return lines.join('\r\n');
}

async function saveContact(contact) {
  const status = $('save-status');
  const blob = new Blob([makeVCard(contact)], { type: 'text/vcard;charset=utf-8' });
  const file = new File([blob], 'BRIMS-Heritage-Resource-Centre.vcf', { type: 'text/vcard' });
  if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
    try {
      await navigator.share({ title: contact.name, text: 'Save BRIMS Heritage Resource Centre to your contacts.', files: [file] });
      status.textContent = 'Contact sharing opened. Choose a compatible contacts app to continue.';
      return;
    } catch (error) {
      if (error.name === 'AbortError') {
        status.textContent = 'Sharing cancelled. You can still download the contact file.';
        return;
      }
    }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'BRIMS-Heritage-Resource-Centre.vcf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  status.textContent = 'Contact file downloaded. Open it to save BRIMS, or import it at Google Contacts.';
}

function showEvent(event) {
  if (!event || event.published !== true || !event.title || !event.start || !event.end || !event.venue) return;
  const start = new Date(event.start);
  const end = new Date(event.end);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) return;
  $('no-event').hidden = true;
  $('event-card').hidden = false;
  $('event-name').textContent = event.title;
  $('event-category').textContent = event.category || 'Upcoming appearance';
  $('event-description').textContent = event.description || '';
  $('event-time').textContent = new Intl.DateTimeFormat('en-UG', { dateStyle: 'medium', timeStyle: 'short', timeZone: event.timezone || 'Africa/Kampala' }).format(start) + ' – ' + new Intl.DateTimeFormat('en-UG', { timeStyle: 'short', timeZone: event.timezone || 'Africa/Kampala' }).format(end) + ' EAT';
  $('event-venue').textContent = [event.venue, event.address].filter(Boolean).join(' · ');
  $('event-month').textContent = new Intl.DateTimeFormat('en', { month: 'short', timeZone: event.timezone || 'Africa/Kampala' }).format(start).toUpperCase();
  $('event-day').textContent = new Intl.DateTimeFormat('en', { day: '2-digit', timeZone: event.timezone || 'Africa/Kampala' }).format(start);
  $('event-year').textContent = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: event.timezone || 'Africa/Kampala' }).format(start);
  const google = new URL('https://calendar.google.com/calendar/render');
  google.searchParams.set('action', 'TEMPLATE');
  google.searchParams.set('text', event.title);
  google.searchParams.set('dates', `${asICSDate(start)}/${asICSDate(end)}`);
  google.searchParams.set('details', [event.description || '', event.url || ''].filter(Boolean).join('\n\n'));
  google.searchParams.set('location', [event.venue, event.address].filter(Boolean).join(', '));
  $('google-calendar').href = google.toString();
  $('download-ics').onclick = () => downloadICS(event, start, end);
}

function downloadICS(event, start, end) {
  const content = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BRIMS Heritage Resource Centre//Contact Card//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
    `UID:brims-${start.getTime()}@brimsheritage.org`, `DTSTAMP:${asICSDate(new Date())}`, `DTSTART:${asICSDate(start)}`, `DTEND:${asICSDate(end)}`,
    `SUMMARY:${escapeICS(event.title)}`, `DESCRIPTION:${escapeICS([event.description || '', event.url || ''].filter(Boolean).join('\n\n'))}`,
    `LOCATION:${escapeICS([event.venue, event.address].filter(Boolean).join(', '))}`, 'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = 'BRIMS-event.ics'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
}

(async function init() {
  $('current-year').textContent = new Date().getFullYear();
  const contact = await readJSON('content/site.json', DEFAULTS);
  $('phone-link').href = `tel:${contact.phoneE164}`;
  $('phone-display').textContent = contact.phoneDisplay;
  $('email-link').href = `mailto:${contact.email}`;
  $('email-display').textContent = contact.email;
  $('location-link').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`;
  $('save-contact').addEventListener('click', () => saveContact(contact));
  const event = await readJSON('content/event.json', { published: false });
  showEvent(event);
})();
