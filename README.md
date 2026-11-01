# Bolto · Create and send an offer letter

An interactive prototype of the employer flow from **Create offer letter** to
the offer being sent. It works at desktop sizes and at 393px.

All company, candidate and offer data is fictional. **Send** shows a demo
confirmation. No email, signing request or worker record is created, and
nothing is sent to a server.

## Try it in 2 minutes

**The prototype works end to end.** Every step from template to sent
confirmation is interactive: entries update the live letter, validation
runs as you go, drafts save and resume, and Send stays blocked until the offer
is complete. No step is a static mock-up.

### Open it

Choose whichever is easiest. None of them needs a sign-in, installation or
build step.

| Way | How |
| --- | --- |
| **Hosted link** (easiest) | Open the [prototype](https://chag60460.github.io/bolto-offer-prototype/) in any current browser, including on a phone. The [launch announcement](https://chag60460.github.io/bolto-offer-prototype/launch.html) is hosted too. |
| **ZIP** | Download and extract the ZIP, then open `index.html` in a current browser. |
| **Clone** | Clone [the repository](https://github.com/chag60460/bolto-offer-prototype), then open `index.html` in a current browser. |

If your browser blocks saving drafts for files opened straight from disk (ZIP
or clone), use the hosted link; everything else works either way.

### Two ways to try it

1. **Walk the whole journey**. It opens on template selection, the
   screen an employer sees right after choosing **Create offer letter**, with
   an empty offer.
2. **Jump to a key moment.** To focus on the two moments designed in depth,
   *Candidate & role* and *Review & send*, open them directly in an empty,
   partly filled, invalid or ready state from the [Key moments](#key-moments)
   table.

### The whole journey

Each step notes what changes for a **contractor** or an **hourly** role, so you
can walk the same journey for any offer.

1. **Template:** choose *Employee* or *Contractor*, and *Standard* or
   *Concise*, then choose **Use template**.
   - *Help me choose employee or contractor* asks two questions.
2. **Candidate & role:** type a first name, last name, email and job title, and
   pick a start date.
   - **Contractor:** asks for a contract end date instead of employment type.
   - Choose **Use saved role details**, then pick a setup (for example
     *Engineering · Remote · Full-time*, or *Design · Hybrid · Contractor*).
   - Compare the current and saved values, then **Apply role details**.
   - Watch the letter preview update as you go.
3. **Compensation:** choose *Salary* or *Hourly*, then enter an amount.
   - **Hourly:** the field becomes "Hourly rate" with "/ hour", and the letter
     says "per hour".
   - Optionally turn on a signing bonus or equity and fill in their details.
4. **Hire setup:**
   - **Employee:** choose FLSA classification, I-9 and payroll group.
     - *What should I choose?* recommends an FLSA classification based on pay
       and job title. For example, hourly pay → *Non-exempt*.
     - *When is an I-9 needed?* recommends *Required* and gives the deadlines
       from the start date.
     - **Use recommendation** fills in the field for you.
   - **Contractor:** FLSA, I-9 and payroll group are skipped.
5. **Offer terms:** pick an expiry date and the sender. A personal note is
   optional. Then choose **Review offer**.
6. **Review & send:** check the letter and the summary side by side.
   - Use a row's ✎ (edit) button to change a value in place.
   - Selecting a highlighted value in the letter opens the same editor.
7. **Send offer letter:** shows the demo confirmation. **View sent offer** opens
   a read-only copy.

### Edge cases

- **Switching templates halfway:** choose **Change** next to the template name
  at any point.
  - Shared details are kept.
  - Only fields the new template needs are flagged.
- **Coming back to a draft:** choose **Save as draft** at any point, then
  **Resume saved draft** later.
  - Everything is restored where you left it.
- **Switching pay from Salary to Hourly (or back) after entering an amount:**
  the amount and the FLSA classification both depend on the pay type, so the
  switch affects both.
  - **Amount:** the number stays, but because its unit changes,  it's flagged for you to
    confirm it's still right.
  - **FLSA classification:** hourly pay usually means non-exempt, so an
    employee's classification is flagged for a recheck, with an updated
    recommendation.
  - Both must be confirmed before sending.
- **A field you can't answer yet:**
  - **Missing value** (a required field left empty): you can still continue to
    the next section; the section you left is marked with how many fields are
    missing. Sending is blocked until it's filled in.
  - **Wrong value** (an entry that isn't valid, like a malformed email): you
    can't continue until it's fixed; focus moves to the field. Sending is
    blocked too.

### On mobile (393px)

Open the hosted link on a phone, or narrow a desktop browser to 393px (for
example with the browser's device toolbar).

- **One pane at a time:** switch between **Details** (or **Summary** on Review)
  and **Letter preview** at the top. Entries are kept when you switch.
- **Sections:** the section list becomes a row you can scroll sideways.
- **Footer:** Back sits on the first row, and the main action (Continue or
  Send) fills its own full-width row below.
- **Everything else is the same:** the whole journey, edge cases, saved role
  details, recommendations and validation all work at 393px.

## Launch announcement

A landing-page section announcing the feature to customers, as if it ships
next month: [open the launch page](https://chag60460.github.io/bolto-offer-prototype/launch.html)
(`launch.html`).

- **Message:** "Offers out the door in minutes." It sells the outcome rather
  than the features: type what's new, reuse the rest, and send knowing
  nothing's missing. Three proof points follow: 3 fields to type, 1 screen to
  check, and 0 payroll guesswork.
- **Visual:** the finished offer letter, which is what the employer actually
  wants, with three callouts: role details reused, nothing missing, and FLSA
  Exempt recommended. It plays a single entrance in under 2 seconds; with
  reduced motion, it shows the finished scene straight away.
- **Brand:** full-bleed Bolto Blue with the official white logo, exported
  unchanged from the brand kit (the kit allows only white marks on blue),
  Inter, pill tags and the kit's 10px button corners.
- **Brand-kit deviation:** the headline goes above the kit's largest size
  (40/44, for product headlines) to up to 72px. The kit defines sizes for
  product UI; a launch announcement needs a larger display size to read as
  marketing rather than a product screen. It scales back down to 40px at
  393px.
- **Early access:** a Bolto Blue closing band with a white sign-up panel
  repeats the hero's palette and gives customers a clear next action. Early
  access opens December 1 for the first 500 companies, with a progress bar
  showing how many spots are claimed and a work-email sign-up. The form
  explains errors, confirms success, and is announced to screen readers. It's
  a demo, so nothing is sent or stored. Blue focus rings and darker error text
  remain visible on the white form.
- **See what's new** opens the prototype, and **Get early access** jumps to the
  sign-up.

## Key moments

**Why these two.** Between them, they address all three pain points in the
brief: sending an offer is slow, it's hard to tell what's left, and the
payroll questions are confusing.

- **Candidate & role: making the offer faster.**
  - **Pain point:** most of the time goes into re-entering role details that
    are the same for every hire on a team.
  - **What employers need:** to type only what's new about the person and
    pick everything else, with mistakes caught early and each entry visible in
    the letter as they go.
- **Review & send: sending with confidence.**
  - **Pain points:** it's hard to tell what's still missing, payroll terms
    are confusing, and a wrong salary, start date or payroll setting is costly
    to fix once the candidate has signed.
  - **What employers need:** to see exactly what the candidate will get, check
    the costly details first, understand every setting, and be told what's
    missing before they can send.

These links load dummy data at a chosen state, for review. They are not the
default experience: Candidate & role's *Ready* completes only that section,
while Review & send's *Ready* is a complete offer.

| Moment | Empty | Partly filled | Invalid | Ready |
| --- | --- | --- | --- | --- |
| Candidate & role | [Open](https://chag60460.github.io/bolto-offer-prototype/index.html?screen=candidate&preset=empty) | [Open](https://chag60460.github.io/bolto-offer-prototype/index.html?screen=candidate&preset=partial) | [Open](https://chag60460.github.io/bolto-offer-prototype/index.html?screen=candidate&preset=invalid) | [Open](https://chag60460.github.io/bolto-offer-prototype/index.html?screen=candidate&preset=ready) |
| Review & send | [Open](https://chag60460.github.io/bolto-offer-prototype/index.html?screen=review&preset=empty) | [Open](https://chag60460.github.io/bolto-offer-prototype/index.html?screen=review&preset=partial) | [Open](https://chag60460.github.io/bolto-offer-prototype/index.html?screen=review&preset=invalid) | [Open](https://chag60460.github.io/bolto-offer-prototype/index.html?screen=review&preset=ready) |

### Design choices: Candidate & role

- **Saved role details fill in the role in one action.** Drop-downs save
  typing, but the employer still makes the same five choices on every offer; a
  saved setup fills all five at once.
  - **Efficiency of use:** a shortcut for frequent senders that doesn't get in
    the way of first-timers.
  - **Recognition over recall:** pick a setup you recognise instead of
    remembering five separate answers.
- **The employer sees what will change before it's applied.** Each current
  value appears next to the saved one, and Cancel leaves the offer exactly as
  it was.
  - **Visibility of system status:** the employer knows exactly which fields
    will change.
  - **User control:** nothing already entered is overwritten without
    agreement.
- **Only role details are reused.** The role is the same from hire to hire;
  the person isn't, so name, email, dates and pay are never copied.
  - **Error prevention:** stale or wrong personal details can't carry over.
  - **Match the real world:** a saved setup holds only what a role has in
    common across hires.
- **One screen, two groups: what to type and what to choose.** The three
  typed fields sit apart from everything picked from company lists or a
  calendar.
  - **Chunking:** typing and choosing are separate tasks, so they sit in
    separate groups.
  - **Consistency:** company-defined options mean the same team or office is
    never spelled two ways.
- **Each question appears only when it applies.** Departments follow the
  chosen manager, and a workplace is asked for only for hybrid or on-site
  roles.
  - **Progressive disclosure:** no question the employer doesn't need to
    answer.
  - **Error prevention:** a mismatched manager and department can't be
    selected.
- **The step starts as a fresh offer and flags only what needs action.**
  Unreached sections show "Not started", and nothing is marked wrong before
  the employer has had a chance to fill it in.
  - **Forgiving design:** nothing is flagged as an error too early.
  - **Signal over noise:** when a warning appears, it means something needs
    fixing now.

### Design choices: Review & send

- **The letter and the summary sit side by side.** The employer checks the
  finished letter against the answers behind it on one screen.
  - **Recognition over recall:** comparing two things in view is easier than
    holding one in your head while looking at the other.
  - **Human-centred design:** it mirrors how people already check an important
    document, with the draft on one side and the agreed details on the other.
- **The summary groups every section, including hire setup.** Hire setup never
  appears in the letter, so this is the only place to check it.
  - **Visibility:** seeing all answers together exposes conflicts between
    sections, such as hourly pay next to an Exempt classification.
  - **Chunking:** answers are grouped into the sections the employer filled
    in, so the summary is quick to scan.
- **Costly details are highlighted in blue** in both the summary and the
  letter.
  - **Visual hierarchy:** attention goes first to what costs most to get
    wrong.
- **Any answer can be edited in place,** from its summary row or by selecting
  it in the letter.
  - **User control and freedom:** fixing a mistake doesn't mean losing your
    place.
  - **Direct manipulation:** the employer acts on the thing they're looking
    at.
  - **Feedback:** the letter updates as soon as the edit is saved.
- **FLSA and I-9 explain themselves inline.** A plain-words explanation and a
  recommendation sit where the answer is checked.
  - **Help in context:** help appears exactly where the question is, without
    leaving the page.
  - **Progressive disclosure:** it stays hidden until someone needs it.
  - **Speak the user's language:** payroll jargon is explained in plain words.
- **When one answer changes another, the affected details are highlighted in
  orange for another check.** Blue means "look carefully"; orange means "needs
  action".
  - **Error prevention:** the mistake is caught before Send.
  - **Visibility of system status:** the employer sees what changed and why.
  - **User control:** the system flags the detail rather than changing it on
    the employer's behalf.
  - **Accessibility:** each highlight also has text and an icon, so colour is
    never the only signal.

## States

| State | Candidate & role | Review & send |
| --- | --- | --- |
| Empty | All fields blank, section *Not started*. Nothing is flagged until you leave a field or choose Continue. | 16 fields missing. Letter shows neutral placeholders. Send blocked. |
| Partly filled | Personal details filled; department still to choose. Section *In progress*. | 3 fields missing (start date, FLSA, expiry). Each row is flagged. Send blocked. |
| Invalid | Malformed email, marked in the field and in the letter. *1 error to fix*. | Malformed email in the summary and the *To* line. Send blocked. |
| Ready | Section complete. Later sections are still *Not started*. | Everything valid. Send available. |

Other states covered:

- **Section left unfinished:** Continue moves on. The section shows "N fields
  missing" in the OFFER DETAILS column, and its empty fields show their errors
  when you return. This includes a signing bonus or equity switched on but not
  filled in.
- **Wrong value:** Continue stays on the section and moves focus to the field.
- **Before sending:** Send is blocked but focusable. Pressing it opens the first
  problem.
- **Pay type changed:** the amount and FLSA classification need a recheck.
- **Template switched:** shared details are kept, and any new required fields
  are flagged.
- **Saved roles:** the saved-role preview, applied state, and a receipt that
  notes any details changed after applying.
- **Department:** unavailable until a manager is chosen.
- **Drafts:** draft saved, draft restored, and a clear message if the browser
  blocks storage (entries stay on screen).
- **After sending:** the sent confirmation and its read-only letter.

## How it's tested

The prototype is checked by **216 automated browser tests**: 108 scenarios,
each run in Chromium and WebKit (the engines behind Chrome, Edge and Safari).
A manual VoiceOver + Safari pass covers what automation can't hear. All pass.
To run the tests yourself, see [Development](#development).

| Area | What's checked |
| --- | --- |
| End-to-end journeys | A salaried employee and an hourly contractor, from template to sent, at desktop and 393px |
| Key-moment states | Empty, partly filled, invalid and ready, for Candidate & role and Review & send |
| Validation rules | Missing values let you move on and are flagged; wrong values stop Continue; Send stays blocked until everything is complete and valid; switched-on extras count as required |
| Edge cases | Switching templates, saving and resuming drafts (including when the browser blocks storage), and rechecks after a pay-type change |
| Saved role details | Preview, apply and cancel; candidate details, dates and pay are never copied |
| Recommendations | FLSA and I-9 suggestions for each pay situation, I-9 deadlines, **Use recommendation** and the official guidance links |
| Layout | 10 widths from 320px to 1920px, footer button alignment and short desktop windows |
| Accessibility | WCAG 2.2 AA rules, contrast, keyboard and screen-reader behavior (details under [How accessibility is tested](#how-accessibility-is-tested)) |
| Offline use | The downloaded ZIP opens from disk with no network requests |
| Launch announcement | WCAG 2.2 AA rules, the official white logo on Bolto Blue, callouts never covering the letter, keyboard focus, a text alternative for the illustration, a single entrance under 2 seconds, reduced motion, and the early-access form (keyboard-only sign-up, error and success announcements, no data sent) |

## Accessibility

Target: **WCAG 2.2 AA.**

### Keyboard

| Key | Does |
| --- | --- |
| Tab / Shift+Tab | Move between controls. A radio group (for example Employee / Contractor) is one stop; use the arrow keys inside it. |
| Enter | Activate buttons and links. Select the focused choice (for example a saved setup or Employee/Contractor). On an already-selected choice inside an inline editor, save the change. |
| Space | Toggle switches and select the focused choice. |
| Arrow keys | Switch the choice inside a radio group. Native selects and date fields work as usual. |
| Escape | Close a dialog, or cancel an inline edit and restore the earlier values. |

Choice cards (saved setups, Employee/Contractor, Standard/Concise and option buttons) show the blue focus ring around the whole card while you use the keyboard.

**Safari:** by default, Tab skips buttons and links. Turn on *Press Tab to
highlight each item on a webpage* in Safari settings, or use Option+Tab
(Option+Shift+Tab to go back).

Where focus goes:

| After | Focus moves to |
| --- | --- |
| Changing screen or step | That page's heading, so the new context is read first |
| **Continue** with a wrong value (for example a malformed email) | That field, with the error announced. You stay on the section. |
| **Continue** with empty fields | The next section's heading. The section you left shows "N fields missing". |
| **Send** while incomplete | The first problem field, opened in its summary editor |
| Opening a dialog | The dialog's heading, so its name is read. Tab and Shift+Tab stay inside until it closes. |
| Closing a dialog (Cancel, Escape, Apply) | The button that opened it |
| Saving or cancelling an inline edit | That row's ✎ (edit) button |
| Selecting a highlighted value in the letter | The matching field (only for sections already opened) |
| Department while no manager is chosen | *Reports to*, with an explanation |

The page scrolls so the focused control stays visible above the sticky footer.

### Screen-reader behavior

- **Announcements:** status updates, such as a saved draft or an applied
  setup, are announced politely after the current speech. Errors are announced
  straight away. Dialogs have their own announcement area, so updates inside
  them are heard, and each dialog's description is read when it opens.
- **Fields:** every field has a visible label and is announced as required
  where needed. Errors are linked to their field, which is marked invalid. A
  field is checked only when you leave it after typing in it, so tabbing past
  an empty field is silent. Radio groups are checked when the choice changes,
  so moving between options with the arrow keys never reports a false error.
  Choices have a short name with a separate description, and pay amounts
  include their unit.
- **Continue and Send:** Continue moves on past missing values and announces
  how many are left in the section you left; it stops on a wrong value and
  announces the error. Send stays focusable while the offer is incomplete,
  explains what's needed, and takes you to the first problem.
- **Progress:** each section button includes its status, the current step and
  section are marked, and the page title changes with each screen. A change in
  status is announced once.
- **Letter preview:** the letter isn't read aloud on every edit. Its
  highlighted values are buttons that read the value, what selecting it does,
  and any problem. Values become buttons once you've opened their section.
- **Switches and panels:** switches announce their on/off state, and help
  panels and info buttons announce whether they're expanded. At 393px, the
  view toggle announces which pane is showing.
- **Motion and contrast:** transitions are turned off for reduced-motion
  preferences, and switches stay visible in Windows High Contrast Mode.

Changing a radio button or dropdown refreshes the form and returns focus to the
same control, so some screen readers read that control again.

### How accessibility is tested

#### General

- **axe checks:** WCAG 2.0–2.2 A/AA rules on every key-moment state, at 1440px
  and 393px.
  - At 393px this includes the letter pane.
  - Also covered: the saved-role dialog, inline pay editor, template dialog and
    the remaining sections.
- **Contrast:** at least 4.5:1 for text and 3:1 for field outlines, including
  the hovered primary button.
- **Keyboard:**
  - Every control on every screen is reachable with Tab, with a visible focus
    ring, and not hidden by the footer.
  - Choice cards select with Enter, Space or the arrow keys, and show the ring
    on the whole card (including after arrow keys in WebKit).
  - Tab stays inside dialogs, and focus returns to the opener on close.
  - Keyboard-only validation, saved-role reuse, inline correction and sending.
- **Announcements:**
  - Error and status announcements arrive.
  - Dialog announcements stay inside the dialog.
  - A status update never cancels a pending error announcement.
  - Tabbing past empty fields announces nothing, arrow-key radio choices never
    announce a false error, and unchanged statuses aren't repeated.
  - Template choices and dialogs have the expected names and descriptions.
  - Expandable help panels expose their expanded/collapsed state and open
    with Enter or Space.
- **Reflow and text spacing:**
  - No horizontal scrolling at any width from 320px to 1920px.
  - Increased text spacing doesn't clip any control.
  - Focus is kept when the window crosses the mobile breakpoint.

#### Screen reader

Each check below records what VoiceOver actually said. Safari uses Option+Tab
to reach every control.

| Check | VoiceOver says |
| --- | --- |
| Tab to the template choice | "Employee, W-2 · full-time or part-time, selected, radio button, 1 of 2, Who are you hiring? group" |
| Down arrow | "Template changed to Standard Contractor offer. Shared entries kept. 13 fields missing." |
| Tab past three empty fields in a new offer | Each field's label only. No errors. |
| Continue with an empty Candidate & role | "Candidate & role has 9 fields missing. You can finish them before sending." |
| Continue with an invalid email | "Candidate & role: 1 error to fix. Enter an email like alex.rivera@example.com." |
| Continue with a signing bonus switched on but empty | "Compensation has 2 fields missing. You can finish them before sending." |
| Open **Use saved role details** | "Use saved role details, web dialog, heading level 2" |
| Press Enter on a setup | "Engineering · Remote · Full-time selected. 1 detail will change. Nothing applied yet. …" |
| Choose a setup with the arrow keys | "Operations · Hybrid · Full-time selected. 4 details will change. Nothing applied yet. …" |
| Escape | Back on the "Use saved role details" button |
| Open **What should I choose?** (FLSA) | "What should I choose? expanded button" |
| Tab | "link, Department of Labor's guidance on exemptions (opens in a new tab)" |
| **Use recommendation** | "FLSA classification set to Exempt. 1 field missing." |
| Open and close **When is an I-9 needed?** | "…expanded button", then "…collapsed button" |
| Open **Help me choose employee or contractor**, then Tab | "…expanded button", then "We direct and supervise the work, radio button, 1 of 3" |
| Send while the email is invalid | "1 error to fix. Enter an email like alex.rivera@example.com." |
| Fix the email and press Enter | "Email updated. Everything is ready." |
| Send | "Demo offer sent to Alex Rivera at alex.rivera@example.com. No real email was sent." |

Keyboard date entry was also confirmed in Safari.

## Scope and assumptions

### In scope

The prototype covers everything from choosing **Create offer letter** to the
offer being sent: choosing a template, entering the candidate and role,
compensation, hire setup and offer terms, then reviewing and sending. The live
letter preview is available throughout. At 393px it becomes its own pane
instead of sitting beside the form.

### Out of scope

As the brief sets out, the candidate's side (signing and onboarding), editing
templates, the list of offer letters, and anyone already in Bolto are left out.
As a prototype, it also has no sign-in, server or real email delivery. Drafts
are saved in the browser, and Send shows a demo confirmation.

### Assumptions

These fill gaps in the brief. Most answer the open questions in Deliverable 1
and match the flow in Deliverable 2.

- **Templates:** Standard and Concise ask for the same details and differ only
  in wording. Switching between employee and contractor keeps every shared
  entry; only the role and hire setup sections change.
- **Candidate and role:** Every candidate is new to Bolto, so their name, email
  and job title are typed rather than imported. Managers, departments and
  workplaces already exist in Bolto and are picked from lists. Work location
  doesn't affect payroll tax, so remote roles aren't asked for a state. Saved
  role setups are company presets maintained elsewhere, not copies of earlier
  offers.
- **Compensation:** Hourly roles state the rate only, not hours per week. The
  signing bonus and equity use the template's wording, and the employer fills
  in the amounts and time periods.
- **Hire setup:** Contractors don't need a payroll group, and payroll groups
  already exist, so the employer picks one rather than creating it. Bolto
  recommends an FLSA classification and an I-9 requirement based on federal
  rules, including the $684-a-week ($35,568-a-year) minimum salary for exempt
  status. Each recommendation says it isn't legal advice, links to the official
  guidance, and leaves the final choice to the employer.
- **Offer terms:** The person preparing the offer can send it on behalf of
  someone else, such as the Head of People, so the sender is picked from a
  list.
- **Demo data:** The company, people, saved setups and manager–department pairs
  are fictional. The demo date is fixed at May 18, 2026, so the example dates
  stay valid. Template wording is illustrative, not approved legal text, and
  the employee-or-contractor helper isn't a legal classification test.

## Brand-kit extensions

Kit colours, warm surfaces, spacing, type and control shapes are kept. Inter
(the kit's approved Aeonik substitute) is bundled locally under its OFL
licence. Kit masters were not edited.

Each extension fills a gap where the kit has no matching component, and is
built from the kit's own tokens.

- **Saved-role comparison dialog:** shows each current value next to the saved
  one, and changes nothing until the employer applies it.
  - **Visibility of system status:** the employer sees exactly which fields
    will change.
  - **User control:** nothing already entered is overwritten without their
    agreement.
- **Section progress list:** shows each section's status.
  - **Visibility of system status:** the employer always knows what's done and
    what's left, without scrolling.
- **Inline editors on Review:** any answer can be fixed in place, with the
  letter still in view.
  - **User control and freedom:** fixing a mistake doesn't mean losing your
    place.
  - **Direct manipulation:** the employer edits the value they're looking at.
- **On/off switches:** yes/no settings, like the Bolto invitation, change in
  place instead of through an edit step.
  - **Match the real world:** a yes/no choice looks and behaves like a switch.
- **Info buttons and help panels:** explain payroll terms where they're
  answered.
  - **Help in context:** help appears exactly where the question is.
  - **Progressive disclosure:** the explanation stays closed until someone
    needs it, so it doesn't crowd people who already know the term.
- **Error tags:** the kit's tag shape in its error tone.
  - **Consistency:** a wrong value reads differently from a missing one, using
    a shape the employer already recognises.
- **Darker status colours:** status text, field outlines and hovered buttons
  use darker shades.
  - **Accessibility:** they meet WCAG AA contrast, and every status also has
    text or an icon, so colour is never the only signal.
- **Native selects and date fields:** keep the browser's own controls.
  - **Consistency with platform conventions:** keyboard and screen-reader users
    get the behaviour they already know.

## Development

Node.js 20+ is needed only to run the tests:

```sh
npm ci
npx playwright install chromium webkit
npm test
```

Tests start their own local server. For manual work, run `npm start` and open
http://127.0.0.1:4176. The app itself is plain HTML, CSS and JavaScript with no
build step.
