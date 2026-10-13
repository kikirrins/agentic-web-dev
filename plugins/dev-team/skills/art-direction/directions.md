<!-- Vendored and trimmed from Leonxlnx/taste-skill (MIT, (c) 2026 Leonxlnx), commit 2b44c81bbe36ac8a8a6bdd1c9ff593f28b8728f4. See ../../THIRD-PARTY-NOTICES.md. -->
# Art directions: a library of OPTIONS

Twenty researched ways of composing a page, each with an idea, composition, type classes, palette tags, imagery, motion and pitfalls. Draw 3 from DIFFERENT families for each brief, then pick or reject with written reasons. None is a default. `sectors` lists where it was seen working; `fashion`/`ecommerce` tags are marked in the table. Family = how the direction gets its impact.


## Index

| id | name | family | sectors (fashion/ecommerce marked) | tones |
|---|---|---|---|---|
| `name-as-monument` | The name as a monument | type | agency, studio-portfolio, personal-portfolio, hospitality, restaurant, music, culture, fashion, event, architecture, real-estate, physical-product, consumer-app, other **[fashion]** | bold, editorial, luxury |
| `sentence-as-layout` | The sentence is the layout | type | agency, saas, ai-product, dev-tool, nonprofit, culture, education, physical-product, consumer-app, finance, health, event, other | bold, editorial |
| `pinned-poster` | The pinned poster | poster | culture, music, event, fashion, personal-portfolio, studio-portfolio, physical-product, ecommerce, hospitality, consumer-app **[fashion]** **[ecommerce]** | bold, editorial |
| `colour-chapters` | Colour chapters | colour | agency, music, event, education, nonprofit, saas, consumer-app, culture, physical-product, health, finance, ai-product | bold, playful |
| `place-carries-it` | The place carries it | concept | hospitality, restaurant, real-estate, architecture, event, health, culture, nonprofit | quiet, luxury, warm |
| `page-is-the-object` | The page is the object | object | restaurant, event, hospitality, culture, music, physical-product, ecommerce, nonprofit, education, personal-portfolio, consumer-app, other **[ecommerce]** | warm, playful, editorial |
| `one-motif` | One motif | motif | saas, finance, consumer-app, ai-product, dev-tool, health, physical-product, restaurant, education, nonprofit, other | playful, technical, warm, bold |
| `product-performs` | The product performs | product | saas, dev-tool, ai-product, consumer-app, finance | technical, quiet |
| `quiet-instrument` | The quiet instrument | product | saas, dev-tool, ai-product, personal-portfolio, consumer-app, finance, other | quiet, technical |
| `hero-object` | The object, large | object | physical-product, ecommerce, consumer-app, fashion, finance, health, restaurant, music **[fashion]** **[ecommerce]** | bold, luxury, quiet |
| `specimen-catalogue` | The specimen catalogue | object | ecommerce, physical-product, restaurant, fashion, culture, education, health, other **[fashion]** **[ecommerce]** | playful, warm, editorial |
| `borrowed-category` | Dressed as something else | concept | finance, saas, consumer-app, physical-product, health, dev-tool, ai-product, education, nonprofit, real-estate, other | bold, playful, luxury |
| `contact-sheet` | The contact sheet | grid | personal-portfolio, studio-portfolio, agency, fashion, culture, architecture, music, ecommerce **[fashion]** **[ecommerce]** | quiet, technical, editorial |
| `editorial-report` | The printed annual | editorial | culture, nonprofit, education, finance, saas, ai-product, health, agency, other | editorial, bold |
| `loud-flat-poster` | Loud and flat | poster | agency, consumer-app, music, event, education, nonprofit, physical-product, saas, culture | bold, playful |
| `split-stage` | The split stage | layout | restaurant, hospitality, personal-portfolio, physical-product, fashion, real-estate, health, culture, ecommerce, saas, consumer-app **[fashion]** **[ecommerce]** | warm, quiet, editorial |
| `dense-tiles` | The well-kept board | grid | agency, studio-portfolio, saas, dev-tool, ai-product, culture, music, other | technical, bold |
| `uneven-photographs` | Photographs at uneven sizes | photo | hospitality, real-estate, architecture, fashion, restaurant, culture, health, nonprofit, studio-portfolio, physical-product **[fashion]** | quiet, luxury, warm, editorial |
| `dark-room` | The dark room | mood | hospitality, restaurant, music, fashion, physical-product, finance, architecture, studio-portfolio, ai-product, personal-portfolio **[fashion]** | quiet, luxury |
| `type-only-statement` | Type and nothing else | type | saas, dev-tool, ai-product, finance, agency, nonprofit, education, personal-portfolio, event, other | bold, quiet, editorial, technical |

Families differ in where the impact comes from: type (the words are the visual), poster (one flat composition), colour (fields change), motif (one repeated shape), object (the product/specimen), concept (the subject's place or category twisted), product (the real interface), grid (many tiles), editorial (printed matter), layout (a split), photo (uneven image sizes), mood (dark, lit).

## The name as a monument (`name-as-monument`)
- **Idea:** The name is the headline. Set it so large that it becomes architecture: as wide as the viewport, cropped by an edge, or stacked to fill the screen. Nothing else on the first screen competes; the description of what this is drops to a single small sentence. The idea comes from treating the name's letters as material.
- **Composition:** First screen: the wordmark spans 88–100% of the viewport width (font-size 16–24vw, set with a clamp so it never wraps), anchored either to the bottom edge with its descenders nearly touching it, or dead centre with everything else pushed to the corners. One line of supporting text at 16–20px sits in a corner on a shared margin; navigation is three or four words in the opposite corner.
- **Type:** One family. The display cut must survive enormous sizes: tight tracking (-0.04 to -0.07em), leading 0.8–0.9, optical kerning on. Section headings are modest (28–40px) on purpose. (type classes: grotesk-tight, condensed-heavy, extended-heavy, heavy-black, serif-display)
- **Colour:** Two values carry the page (ground and ink). The accent, if used at all, appears on one thing only: the single action or the inset image frame. The footer inverts ground and ink. (palette tags: light-neutral, dark-neutral, two-tone, mono-accent)
- **Imagery:** Few images, used as inserts in the typography rather than as illustrations beside it: one photograph inside or behind the name (a 4:5 or 1:1 frame replacing a letter, or tucked between two words), then a short run of large full-width or half-width photographs 
- **Motion:** scaling-wordmark
- **Richness:** Scale. The size of the name against the smallness of everything else is the entire visual event, so protect both ends: do not shrink the name to make room, and do not let body text creep above 20px.
- **Pitfalls:** A long name set small is just a logo. If the name has more than about 12 characters, stack it on two lines or crop it with the viewport edge; never drop below 12vw. Do not add a second big headline under the name. Do not decorate the letters.

## The sentence is the layout (`sentence-as-layout`)
- **Idea:** One short sentence, set at poster scale, is the composition. The trick that makes it an idea rather than a big headline: something from the subject sits inside the sentence where a word would be. A strip of photograph fills the gap between two words; a small live fragment of the product replaces the noun; the object the sentence names is pictured at the size of a letter.
- **Composition:** The sentence is four to seven words and runs as one or two full-width lines at 9–13vw. Inline with the type, on the baseline, sits one media slot: a rounded-rectangle or square frame exactly one line-height tall and two to three ems wide, holding a photograph or a looping crop. Above and below the sentence the screen is empty except for a small navigation line and one supporting sentence set small, both on the same left margin.
- **Type:** Display weight with real presence (medium to bold), tracking -0.03 to -0.05em, leading 0.95–1.0 so two lines sit close. The inline frame aligns to cap height and baseline exactly; set it with em units so it scales with the type. (type classes: grotesk-tight, serif-display, condensed-heavy, serif-light-large)
- **Colour:** A calm ground with ink at full contrast. The only colour comes from the photograph inside the sentence; if the palette has an accent, use it once, on the action. (palette tags: two-tone, light-neutral, single-field, mono-accent)
- **Imagery:** One strong, simple photograph that reads at small size (a face, an object, a texture, a horizon), cropped to a wide strip inside the sentence.
- **Motion:** masked-headline
- **Richness:** The collision of big type and one live image inside it. Because there is only one image on the first screen, choose it with care and give it perfect alignment to the letters.
- **Pitfalls:** The sentence must be short enough for two lines on a phone, where the inline frame drops to its own line between the two halves. Do not style one word differently to fake the device. Do not use more than one slot per sentence.

## The pinned poster (`pinned-poster`)
- **Idea:** Something stays put while everything else changes. A title holds its place across the viewport and the images beneath it swap; the name is split to two opposite corners and the page passes between the halves; a single frame stays centred while its contents change. Every scroll step is a new cover of the same magazine.
- **Composition:** A sticky layer holds the fixed element for the height of two to three viewports: usually the title at 10–14vw across the middle or top of the screen, or two words pinned to the top-left and bottom-right corners. Under it, a stack of full-height panels scrolls by, each a single large photograph (portrait 4:5, centred, 40–50% of the viewport wide) with one line of caption at the same small size everywhere.
- **Type:** The pinned title is the only large type on the page. Captions and body share one small size (15–17px). Tight tracking and solid weight so the title reads over photographs. (type classes: grotesk-tight, condensed-heavy, heavy-black, extended-heavy)
- **Colour:** One strong title colour against a pale or dark ground. Each panel may take its own flat ground colour sampled from its photograph. (palette tags: two-tone, photographic-neutral, single-field)
- **Imagery:** A series of photographs with the same crop ratio and the same framing (all portraits, all objects, all rooms), so that swapping them reads as one image changing. Five to eight in the pinned run.
- **Motion:** pinned-story
- **Richness:** Repetition with change. The fixed title makes each new photograph feel like an event, so the photographs must be good and consistent.
- **Pitfalls:** If the title is not legible over every panel, the idea fails: test each one. Keep the pinned run under six viewports or it feels like a trap. On a phone the title shrinks to 16–18vw and stays pinned at the top; panels become full-width.

## Colour chapters (`colour-chapters`)
- **Idea:** Every section is a chapter with its own flat colour, floor to ceiling. The page reads like a set of posters hung in a row, held together by one typeface and one grid. The colours are not decoration: they come from the subject (the brand's packaging, the artist's record sleeves, the product's own colour ways, the categories of the content) and each chapter's colour means that chapter.
- **Composition:** Sections are full-bleed fields, each at least 90svh tall, butted directly against each other with no gap and no divider. Inside every field the same 12-column grid and the same margins apply, and each field holds one thing: a huge heading (8–12vw) with a small paragraph, or one photograph with a caption, or one list. Text colour is chosen per field for strong contrast (ink or paper, never grey). Headings start on the same left edge in every chapter, so the eye feels the system as colours change.
- **Type:** One typeface in two weights. Headings very large and tight; body 18–20px. Because colour is loud, the type stays plain: no italics, no second face. (type classes: grotesk-tight, heavy-black, geometric, rounded-friendly)
- **Colour:** Four to six flat fields used at full strength, one per section, each with its assigned text colour. No tints, no gradients between them: the hard edge where two fields meet is the look. (palette tags: flat-loud, pastel-fields)
- **Imagery:** Sparing. One photograph or object per chapter at most, either cut out and sitting directly on the colour, or a plain rectangle with generous colour around it. Photographs should be simple enough not to fight the field.
- **Motion:** colour-on-scroll
- **Richness:** Colour at scale. A whole screen of one saturated colour is rich on its own, so a chapter needs few elements; it still needs its content at full size, because a coloured screen with one small line on it reads as empty.
- **Pitfalls:** Check contrast on every field with the palette's assigned ink. Do not put cards on the fields. Do not use more than six colours. Two neighbouring fields should differ clearly in lightness as well as hue.

## The place carries it (`place-carries-it`)
- **Idea:** For a place, the photograph is the argument. One full-bleed image of where you would be standing fills the first screen, and the design steps back: the name sits along the bottom edge like a film title, or small in a corner, and nothing else interrupts the view. The page that follows keeps that restraint: few words, large pictures, long pauses.
- **Composition:** First screen: a single photograph at 100vw by 100svh, focal point kept clear of text. The name is set either very large (14–20vw) hugging the bottom edge with 16–24px of margin, or small (20–28px) top-left with a one-line description bottom-left. Navigation is two to four words in the top corners in the same small size. If text sits on the image, a soft neutral scrim under the text area only.
- **Type:** A face with some grace for the name; small, calm, well-spaced text everywhere else. Sentence case. Body 17–19px with leading around 1.55. (type classes: serif-display, serif-light-large, condensed-heavy, grotesk-light)
- **Colour:** Neutral paper or deep neutral ground chosen to flatter the photographs; text ink drawn from the darkest tone in the imagery. Colour lives in the pictures. (palette tags: photographic-neutral, dark-neutral, earth)
- **Imagery:** The dealt set is the palette. Choose four to six photographs with the same light. The hero image must have a calm area for the name. Full-bleed or large with square corners; never thumbnails, never a carousel of ten.
- **Motion:** slow-crossfade
- **Richness:** The photographs, at full size, uninterrupted. Empty paper around short text makes the next image land harder.
- **Pitfalls:** A weak hero photograph cannot be fixed by typography; pick again. Do not stack a headline, a paragraph and two buttons on the image. Do not use a booking bar that covers the bottom of the view; one small action is enough.

## The page is the object (`page-is-the-object`)
- **Idea:** Find the printed or physical artefact that already exists in the subject's world and build the page as that thing. A wedding site is the invitation card. A restaurant is its menu. A conference is the ticket; a record is its sleeve; a shop is the receipt or the swing tag; an archive is a stack of tabbed folders; a course is the syllabus sheet.
- **Composition:** The first screen shows the artefact as a single filled panel (paper colour on a contrasting ground) centred or offset, with believable proportions: a card at 5:7, a ticket at about 2.2:1 with a notch cut by `clip-path`, a menu as a tall sheet. All primary content lives on it, set the way that object is set: centred and symmetrical for an invitation, in tidy aligned columns for a menu or ticket. The ground behind is a flat colour or one full-bleed photograph.
- **Type:** Take the manners of the artefact: a bookish serif with small caps avoided, or a blunt condensed face for tickets and posters. Sizes stay within what print would use relative to the panel; the name is large on the panel, details are small and exact. (type classes: serif-text, serif-display, slab, condensed-heavy, grotesk-tight)
- **Colour:** Paper and ink plus the ground the paper sits on. Two or three flat colours in total, like a two-colour print job. (palette tags: two-tone, earth, light-neutral)
- **Imagery:** Optional. One photograph behind the object, or small photographs placed on it like tipped-in plates. The object itself is the image.
- **Motion:** curtain-footer
- **Richness:** Recognition. The shaped edges, the print-like alignment and the limited inks make a familiar object out of plain HTML.
- **Pitfalls:** Choose an artefact that truly belongs to the subject, or it becomes costume. Shape the edges with fills and `clip-path`; an outlined rectangle with a thin border is not an object. Keep text sizes readable on a phone, where the object becomes full width with its shaped edge kept at top and bottom.

## One motif (`one-motif`)
- **Idea:** Take one shape from the subject and let it run the whole system. A drilling tool's octagonal cross-section becomes the buttons, the image masks and the loader. A two-account money app becomes two circles that recur as icon, inline dot and section colour. A café's striped awning becomes every band on the page.
- **Composition:** Hero: the motif appears once at enormous scale as a flat filled shape, cropped by the viewport (a circle 120vh across entering from the right, a chamfered block filling the lower half), with a short headline at 6–8vw and one supporting sentence set on the remaining ground, left-aligned on a shared margin.
- **Type:** A clean geometric or grotesk face that echoes the shape (round bowls for circles, squared terminals for chamfers). Medium weight; headings 6–8vw in the hero and 3–4vw after. (type classes: geometric, grotesk-tight, rounded-friendly)
- **Colour:** The motif carries the accent colour at large scale, flat. Everything else is ground and ink. A second motif colour is allowed only if the subject has a real pair (two accounts, two modes). (palette tags: mono-accent, two-tone, pastel-fields)
- **Imagery:** Photographs appear inside the motif's shape. If there is product interface to show, it sits on a flat colour stage shaped by the motif. Draw the shape with CSS or a simple inline SVG path; do not draw illustrations.
- **Motion:** shutter-image
- **Richness:** One shape at many sizes. The giant cropped shape gives the hero mass and colour without a single image.
- **Pitfalls:** One motif means one. A circle here, a hexagon there and a blob behind is the generated look this replaces. The motif must come from the subject and you must be able to say from where in one clause.

## The product performs (`product-performs`)
- **Idea:** Software is most convincing when it is doing its job in front of you. Instead of describing features, put small, true, working fragments of the product on the page: the actual control, with real content, responding to the pointer. A colour picker's loupe reads the page's own background and prints its value. A list tool lets you tick an item right there. A type-scale plugin sets the page's own headings.
- **Composition:** Hero: a short plain headline (4–6vw, left-aligned, upper-left third) and one sentence; the rest of the first screen is the main fragment at actual interface size, sitting directly on the page or on one flat stage colour, large enough to read every label. The fragment is built in HTML and works.
- **Type:** The marketing type matches the product's interface type so the fragments and the page feel like one thing. Headline modest; interface text at its true size (13–15px) inside fragments. (type classes: grotesk-tight, grotesk-light, geometric)
- **Colour:** Neutral ground. The product's own interface colours provide the colour. At most one flat stage colour behind fragments. (palette tags: light-neutral, dark-neutral, mono-accent)
- **Imagery:** The interface fragments are the main imagery: build them carefully with real labels, real numbers and sensible states (one hovered, one selected).
- **Motion:** pinned-story
- **Richness:** Fidelity. A fragment with believable content and a real hover state is more interesting than any illustration. Spend the effort there.
- **Pitfalls:** A fake interface made of grey bars and circles is the worst outcome; if you cannot build a believable fragment, change direction. Mark each fragment's root element with the attribute data-ui: inside it the product's own conventions apply (1px control borders, small radii, a shadow on its open menu) 

## The quiet instrument (`quiet-instrument`)
- **Idea:** Radical understatement. Where every competitor shouts, this page almost whispers: a headline barely larger than body text, a narrow column, small exact demonstrations, and a great deal of untouched space. The restraint is the claim. It says the thing is simple, finished and sure of itself. This only works when it is carried through completely; one loud element breaks it.
- **Composition:** A single column 440–560px wide, placed left of centre (starting at about 22% of the viewport width) or dead centre, running the whole page. The headline is the one large thing on the first screen: two lines at display size (5–7vw), medium weight, starting on the column's left edge and allowed to run wider than the column. The supporting paragraph follows at body size (17–19px) in the full ink. One small primary button and one text link.
- **Type:** One family, two weights. A display size for the headline (5–7vw), one heading size for section titles (about 32–40px), body at 17–19px, a small size for captions (14–15px). Leading 1.5 for text. Letter-spacing near zero. The typeface must be handsome at small sizes. (type classes: grotesk-light, serif-text, geometric)
- **Colour:** Paper and two inks (full and soft). One accent used on exactly one element per screen. (palette tags: light-neutral, mono-accent)
- **Imagery:** Precise rather than loud: cropped interface details at true size, and real photographs of the customer's world held to the column width, each doing one job. One short looping clip can sit at column width too. Never a large stock hero image.
- **Motion:** stillness
- **Richness:** Precision. With so little on the page, alignment, spacing and the exact size relationships are the design. Every element shares the column's left edge.
- **Pitfalls:** This is the one direction where a small headline is right; the inspector will not object, but do not mix it with a large display line. Emptiness must look decided: keep the column edges exact and the vertical rhythm even. Not suitable when the subject needs emotion or photography to sell.

## The object, large (`hero-object`)
- **Idea:** Show the thing, bigger than seems reasonable. One photographed object fills the first screen, scaled until the viewport crops it, with the text small and tucked beside or behind it. The crop is the idea: a record whose edge leaves the top-right corner, a bottle whose shoulder runs off the bottom, a chair seen so close you read its grain. Being that close reads as confidence in the object.
- **Composition:** First screen: the object occupies 55–75% of the viewport and breaks at least one edge. It sits on a flat field (ground colour or one bold colour), never in a box. The headline is short and either very large and partly hidden behind the object (10–13vw, the object overlapping two or three letters) or small (28–36px) in the opposite corner with a one-line description. No navigation bar beyond a wordmark and one action.
- **Type:** Either very large and structural or very small and precise; pick one for the headline and hold it. Facts are set in the text face at 22–28px, not in a table. (type classes: grotesk-light, grotesk-tight, extended-heavy, serif-light-large)
- **Colour:** A flat field chosen to make the object's own colour sing (its complement, or a tone darker than its shadow side). One field for the whole page, or a second for the facts section. (palette tags: single-field, light-neutral, pastel-fields, dark-neutral)
- **Imagery:** Use the product's own photographs if they exist. Otherwise use a still-life from the dealt set as a stand-in and say so. Prefer images with a plain background; use `mix-blend-mode: multiply` on light fields so a white studio background disappears into the page (needs: product-photo)
- **Motion:** shutter-image
- **Richness:** The object's surface at close range, and the tension of the crop.
- **Pitfalls:** A small centred product shot with space all round is a catalogue thumbnail, not this direction. If the image has a busy background it cannot sit on a field; crop tighter or change image. Keep text off the object's focal area.

## The specimen catalogue (`specimen-catalogue`)
- **Idea:** Present what is on offer the way a field guide presents birds: each item alone on a flat colour, same scale, same angle, named plainly. A bakery's pastries become specimens and the specimens become the menu. A furniture maker's chairs each get their own colour tile.
- **Composition:** Hero: a left-aligned statement of what this is (5–7vw, upper-left) beside or above a tight cluster of four to seven specimen tiles of different sizes arranged as a loose mosaic that runs off the right edge. Each tile is a flat colour square or 4:5 rectangle with one photograph centred on it, no border, 8–12px gaps. The main section is the catalogue itself: a grid of tiles in which each item has its name and one fact set beneath the tile in the text face, aligned left to the tile edge.
- **Type:** Friendly and plain. Item names at 18–22px in medium weight, facts beneath in the soft ink. One big statement in the hero; no other display type. (type classes: grotesk-tight, serif-text, slab, rounded-friendly)
- **Colour:** The tiles are the colour: three or four flat fields from the palette, repeated in a steady rotation. Ground stays neutral. (palette tags: pastel-fields, flat-loud, light-neutral)
- **Imagery:** Photographs of single items on plain backgrounds, all cropped to sit at the same apparent size within their tile. On light tiles, `mix-blend-mode: multiply` removes white studio backgrounds. (needs: product-photo)
- **Motion:** drag-row
- **Richness:** Rhythm of colour tiles and the pleasure of comparing like with like.
- **Pitfalls:** It needs at least six items that can be shown as objects; with three it is a feature row. Keep labels outside the tiles. No shadows under the objects, no hover lift.

## Dressed as something else (`borrowed-category`)
- **Idea:** Art-direct the subject as if it belonged to a different, more vivid category. A money app is sold like a streetwear drop. An industrial roaster is presented like a design object. Drilling hardware gets the calm of a watch brand. A parcel-locker service becomes a fairground of stickers.
- **Composition:** Depends on the borrowed category, so decide it explicitly and write it in your notes. Fashion drop: one shouted condensed headline across the full width, a single cropped image under it, then product facts as a blunt list. Watch or perfume: a centred object on a dark field, a small serif name, very few words, long vertical pauses. Poster or zine: flat colour blocks, heavy type, tilted cut-out images. Museum: one item per screen on a plinth-like band of colour with a short label beside it.
- **Type:** The borrowed category's type, fully committed: condensed and loud, or refined and small. No halfway. (type classes: condensed-heavy, serif-display, extended-heavy, heavy-black)
- **Colour:** The borrowed category's palette, which will be unlike the subject's sector norm. That mismatch is intended. (palette tags: flat-loud, two-tone, dark-neutral, single-field)
- **Imagery:** Photograph the subject the way the borrowed category would be photographed. With the dealt set, choose images for attitude, not literal relevance, and crop them hard.
- **Motion:** edge-marquee
- **Richness:** Attitude. The page has a recognisable voice from another world, applied to a subject nobody expected it for.
- **Pitfalls:** Name the borrowed category in one word before you start, or the result is merely loud. The content must still be clear: what it is, what it costs, how to get it. Avoid borrowing from 'tech startup', which is the default you are escaping.

## The contact sheet (`contact-sheet`)
- **Idea:** Show everything at once, small, in order. The work is laid out like a photographer's contact sheet or an archive drawer: dozens of small frames in strict rows, with all text set at one small size. Nothing is featured, which is the point: the volume and consistency of the body of work is the statement, and the visitor does the choosing. It suits people and studios whose strength is range and output.
- **Composition:** The name, or one sentence about the work, sits at display size (6–9vw) across the top of the first screen, and the sheet begins directly under it, still inside the first screen. The first screen opens with three or four short blocks of small text across the top on a 12-column grid (who, what, where to reach them), all at 14–16px, and immediately below, the sheet begins: rows of thumbnails at a fixed height (90–140px) with their natural widths, 6–10px gaps, each project forming a run of four to eight frames preceded
- **Type:** One face. The name at display size on the first screen; everything else at one text size and one small size; hierarchy below the name comes from position and from a single brighter ink for titles. (type classes: grotesk-light, grotesk-tight)
- **Colour:** Black or white ground, so the thumbnails are the only colour. (palette tags: dark-neutral, light-neutral)
- **Imagery:** Many images: at least 24 frames to make a sheet. They can be project photographs from the dealt set cropped to mixed ratios, or page captures of the work. Square corners, no captions on the frames.
- **Motion:** index-preview
- **Richness:** Density and order. The mass of small images forms a texture; the strict rows keep it calm.
- **Pitfalls:** With fewer than about 20 images it looks unfinished; choose another direction. Do not add a big headline above the sheet. On a phone the frames become two per row at a fixed height and each run scrolls sideways.

## The printed annual (`editorial-report`)
- **Idea:** Lay the page out like a well-designed printed report or magazine feature: a masthead image, a tight oversized title, text held to a strict column line, and colour used in solid blocks the way a two-colour print job would. It gives weight and authority to subjects that are really about content: findings, a manifesto, a programme, a serious product. The reader should feel that someone edited this.
- **Composition:** A fixed vertical axis at about 42% of the viewport width organises everything: headings begin on it, body columns hang from it, and the 0–42% zone holds small side notes, figures or stays empty. Masthead: a wide image band (photographic mosaic or a single crop) across the top 45% of the first screen; below it the title at 7–9vw starting on the axis, with a two-sentence standfirst at 20–24px.
- **Type:** A tight heavy grotesk or a sharp serif for titles; an excellent text face for reading at 18–20px with leading near 1.5. Headings in sentence case, tracked tight. (type classes: grotesk-tight, serif-display, serif-text)
- **Colour:** Paper, ink and two or three solid block colours. A colour page is a whole section in one flat colour. (palette tags: flat-loud, two-tone, mono-accent)
- **Imagery:** Photographs used as blocks in mosaics alongside flat colour tiles; mixed subjects are fine if cropped tight and converted to one treatment.
- **Motion:** masked-headline
- **Richness:** The column line, the mosaics and whole pages of colour give structure and variety without ornaments.
- **Pitfalls:** The axis must be exact and reused everywhere or it reads as random indentation. Keep paragraphs to a real reading measure. On a phone the axis collapses to the left margin and side notes move inline above their paragraph.

## Loud and flat (`loud-flat-poster`)
- **Idea:** A page with the directness of a street poster: flat saturated colour, the heaviest type you can find, short blunt statements, and photographs cut out and stuck on. It is for subjects with a voice. Write the page as things a person would actually say out loud, and let the design say them at full volume.
- **Composition:** Hero: a statement of three to six words in ultra-heavy type at 11–15vw, filling the width, lines stacked tight (leading 0.85), flush left with 20–28px margins, on a flat saturated ground. One cut-out or hard-cropped photograph overlaps the type from the right or bottom, tilted 3–6 degrees. A single chunky button in the contrasting flat colour.
- **Type:** The heaviest weight available, set tight, mostly lowercase or mostly uppercase (choose one). Body text is a plain grotesk at 18–20px. (type classes: heavy-black, condensed-heavy, extended-heavy, rounded-friendly)
- **Colour:** Three or four flat colours at full strength including black or white. Each panel is one colour; text on it is one other. (palette tags: flat-loud)
- **Imagery:** Photographs with attitude, cropped hard or cut to a simple shape with `clip-path` (circle, arch, blunt polygon), slightly rotated, overlapping the type. Two or three on the page.
- **Motion:** edge-marquee
- **Richness:** Colour mass, type mass, and overlap.
- **Pitfalls:** Headlines still obey the two-line rule: at 13vw that means very few words, which is correct for this voice. No outlines, no offset shadows, no sticker confetti. Rotation is for two or three images only, never for text blocks.

## The split stage (`split-stage`)
- **Idea:** Half the screen never moves. One side is a fixed photograph (or object, or product view) that stays in place for the whole visit; the other side is a calm scrolling column with everything you need to read. The fixed half keeps the feeling present while the reader gets on with the facts, like sitting in the room while reading the menu. As sections pass, the fixed image may quietly change to the one that matches.
- **Composition:** Desktop: a two-column page, 50/50 or 45/55. One column is `position: sticky; top: 0; height: 100svh` and holds a single photograph filling it edge to edge, or the object centred on a flat field. The other column scrolls and holds all content in a single narrow measure (max 46ch) with comfortable padding (48–72px): name and one-line description first, then sections separated by generous space, then contact and footer. Headings in the scrolling column are modest (32–44px).
- **Type:** A text-first setting: a readable serif or a calm sans at 17–19px, with one display size for the name. Left-aligned throughout. (type classes: serif-text, serif-display, grotesk-light, slab)
- **Colour:** The paper colour of the reading column is chosen against the photograph: a tone taken from its shadows or its lightest area. One ink, optionally one accent ink for links and the action. (palette tags: two-tone, earth, light-neutral, photographic-neutral)
- **Imagery:** One excellent portrait-orientation photograph for the fixed half, plus three or four more that crossfade in as their sections arrive. Small inline photographs in the reading column are optional and should be few.
- **Motion:** slow-crossfade
- **Richness:** A full-height photograph always in view, against a quiet, well-set column of text.
- **Pitfalls:** The reading column must be genuinely well typeset, since it is half the page. Do not put cards or grids in it. Check that the fixed image crops well at short viewport heights. In blind tests the commonest complaint was monotony: several screens of the same split with only the text changing.

## The well-kept board (`dense-tiles`)
- **Idea:** The whole page is a board of tiles fitted edge to edge with narrow gaps, like a tidy desk seen from above. Each tile is one thing: the name, a statement, a photograph, a number, a link, a short list. There is no hero and no sequence of bands; the page is one continuous composition that the eye roams.
- **Composition:** A 12-column grid with 8px gaps and 8–12px outer margins, filled completely, no empty cells. Tiles use only four sizes (for example 6×4, 6×2, 3×2, 3×4 in column × row units of about 90px). Every tile is a flat filled rectangle: ground colour one step from the page, or a palette colour, or a photograph covering it. One radius everywhere (0, or 6–10px).
- **Type:** One grotesk in two weights. Inside tiles: a large size for single statements, a small size for lists. No uppercase labels in tile corners. (type classes: grotesk-tight, geometric)
- **Colour:** Page ground, tile ground one step lighter or darker, and one or two palette colours on selected tiles. Photographs supply the rest. (palette tags: dark-neutral, light-neutral, mono-accent)
- **Imagery:** Photographs fill whole tiles with `object-fit: cover`; choose images that crop well to both wide and tall tiles.
- **Motion:** stillness
- **Richness:** The fit. A full board with consistent gaps and varied tile contents is satisfying in the way a packed suitcase is.
- **Pitfalls:** Tiles are filled, never outlined, and never carry shadows. Do not put an icon and a two-line feature blurb in every tile; vary what tiles hold. Decide the phone layout as its own board: two columns, tiles re-ordered so the name and statement lead.

## Photographs at uneven sizes (`uneven-photographs`)
- **Idea:** A calm page where the pictures are placed like prints on a gallery wall: each at its own size and position, with text set small and light between them. Nothing lines up in the obvious way, yet everything sits on a grid you can feel. The unevenness is what makes it read as art-directed by a person: a small portrait far left, a wide landscape running off the right edge, a square that overlaps the next section.
- **Composition:** A 12-column grid with wide margins (5–7vw). The hero is a single line of large light type (6–9vw) across the top third, and below it one photograph placed off-centre (columns 6–12, 16:10), its top edge overlapping the baseline zone of the headline by a few pixels of deliberate tension.
- **Type:** A light or regular weight at large size for the few headings; small, quiet text. Serif or a slender sans. Everything left-aligned to grid lines. (type classes: serif-light-large, serif-text, grotesk-light)
- **Colour:** A pale neutral ground with one deep ink taken from the photographs. No accent beyond a quiet link colour. (palette tags: light-neutral, earth, photographic-neutral)
- **Imagery:** Six to nine photographs from one set, in a deliberate mix of ratios (3:4, 4:5, 1:1, 16:10, 21:9). Square corners. Captions, if any, are one short line under an image in the soft ink.
- **Motion:** shutter-image
- **Richness:** Placement. The differing sizes and offsets create movement on a still page.
- **Pitfalls:** Uneven is not random: every image edge lands on a column line, and offsets come from a small set of values. On a phone, keep the unevenness with alternating widths (100%, 72% left, 60% right) rather than stacking everything full width.

## The dark room (`dark-room`)
- **Idea:** One dark field from top to bottom, and in it, lit things. Photographs and objects appear like exhibits in a dim gallery: each with space around it, each the brightest thing on its screen. Type is light, small and sparse. The darkness is not a theme switch; it is a room, and the page is a slow walk through it.
- **Composition:** A single near-black or deep-toned ground runs the full page with no section bands. First screen: either the name at full width in a light weight along the bottom edge with one dim photograph above it, or one object or photograph centred at 40–50% of the viewport with a line of text beneath at 16–18px. Each later screen holds one or two lit items at a generous size (the main one 40–60% of the screen width) with its text set beside it at full reading size; the darkness frames the items, it does not replace content.
- **Type:** Light or regular weights; they glow on dark. Avoid heavy bold, which looks cheap on black. Headings 4–7vw at most; text 16–18px with leading 1.6 and a slightly lifted ink (not pure white). (type classes: grotesk-light, serif-light-large, serif-display, extended-heavy)
- **Colour:** A dark ground with a tint (blue-black, green-black, brown-black), a soft light ink, a dimmer ink for secondary text, and one warm or bright accent used once per screen at most. (palette tags: dark-neutral)
- **Imagery:** Low-key photographs: dark backgrounds, one light source, subjects emerging from shadow. Their dark edges should blend into the page ground.
- **Motion:** slow-crossfade
- **Richness:** Light against dark, and the slow pacing.
- **Pitfalls:** Grey text on black fails contrast quickly: check it. No glow effects, no neon accent, no coloured light blobs. A dark page with a bright busy photograph is not this direction; choose low-key images.

## Type and nothing else (`type-only-statement`)
- **Idea:** The first screen is made only of words, colour and space, good enough that nobody misses a picture there. Pictures arrive later, large and few, as relief from the type. This is the honest answer when a subject has nothing worth photographing: instead of inventing illustrations, set what you have to say as well as it can be set.
- **Composition:** First screen: the statement, two lines at most, set at 9–14vw and occupying the full width with tight leading, positioned in the upper two-thirds. One supporting sentence at 20–24px sits bottom-left on the same margin and the single action sits bottom-right on the same baseline. No navigation bar; two or three links in a top corner.
- **Type:** This direction lives or dies on the face and its settings. Display at tight tracking and leading; text sizes few and far apart (for example 15, 22, 34 and the display size). Use real typographic detail: proper quotes, balanced line breaks, hung punctuation where it helps. (type classes: grotesk-tight, serif-display, heavy-black, condensed-heavy, serif-light-large)
- **Colour:** Either one saturated ground for the whole page with a single ink, or paper and ink with one section inverted and one in the accent as a full field. Colour does the job images would have done. (palette tags: single-field, two-tone, flat-loud, light-neutral, dark-neutral)
- **Imagery:** The first screen has no picture. Further down, real pictures of the subject's world (found with scripts/assets.mjs) arrive large and few: a full-bleed photograph between two type sections, a looping clip in one band, an archival image beside a list.
- **Motion:** masked-headline
- **Richness:** Scale contrast and colour mass. A capability list set at 5vw is an image in its own right.
- **Pitfalls:** Without pictures, weak copy has nowhere to hide: write real sentences. Vary the set pieces; four sections of big-heading-plus-paragraph is a text document, not a design. Keep all headings within two lines.

## Motion signatures (referenced by `motion` above)

- `masked-headline` (Masked headline): On load, each line of the headline rises from behind its own baseline, about 900ms with a strong ease-out, the second line 110ms after the first; the supporting sentence and the action then fade up together. Nothing else on the page performs.
- `shutter-image` (Shutter image): The one hero or showcase image opens from an edge with a clip-path over about 1.1 seconds while the picture inside settles from 1.12 scale to rest. Use it once, on the image that matters most; later images simply are there.
- `scaling-wordmark` (Scaling wordmark): The giant name responds to the scroll: as the first screen leaves, the wordmark scales down a few percent (or grows from 0.94 to 1 as the footer arrives) on a scroll-linked timeline, so the monument feels heavy. Travel stays under 8%. Static fallback where scroll timelines are unsupported.
- `pinned-story` (Pinned story): One element holds its place with `position: sticky` (a title, a frame, a product fragment) while the items that belong to it scroll past or swap inside it. The page's ordinary scrolling does the work; nothing is hijacked. Keep the pinned run under six screens.
- `index-preview` (Index with preview): Rows of text are the navigation through the work; pointing at a row brings up its image in one fixed frame and dims the other rows. On touch screens each row shows its image inline instead. Fast and exact (about 240ms crossfade), no lag behind the pointer.
- `curtain-footer` (Curtain footer): The page content slides up like a sheet to uncover the footer waiting beneath it, so the last screen is revealed rather than scrolled to. Build with a sticky footer at the bottom and a main element with its own background and a higher stacking order. No JavaScript.
- `slow-crossfade` (Slow crossfade): The principal photograph quietly changes: three or four images of the same framing crossfade over about 1.6 seconds, holding five to six seconds each, or the fixed image changes when its matching section arrives. It should feel like light shifting in a room.
- `edge-marquee` (Edge-to-edge marquee): One line of very large type travels sideways across the full width at a slow constant speed, as a band between two sections or as the closing statement. Linear timing, duplicated content for a seamless loop, paused on hover and under reduced motion.
- `drag-row` (Drag row): A row of large items wider than the screen that the visitor pulls sideways: native horizontal scrolling with scroll snapping, the first item aligned to the page margin and the last allowed to run off the edge so the row visibly continues. No carousel library, no arrows, no dots.
- `colour-on-scroll` (Colour by chapter): Each chapter is its own full-bleed field of one palette colour, so the ground changes exactly at section edges as you scroll, never as a global recolouring of the screen.
- `stillness` (Stillness): No showpiece. The page is simply there, instantly, and the discipline is the statement. Motion is limited to exact feedback: a 140ms press on the button, a 180ms colour change on links, focus rings that appear without delay. Do not add a load animation or scroll reveals to this direction.

Use transform and opacity only, and follow `animation-craft` (reduced motion included).
