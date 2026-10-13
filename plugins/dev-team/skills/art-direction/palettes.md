<!-- Vendored and trimmed from Leonxlnx/taste-skill (MIT, (c) 2026 Leonxlnx), commit 2b44c81bbe36ac8a8a6bdd1c9ff593f28b8728f4. See ../../THIRD-PARTY-NOTICES.md. -->
# Palettes: a library of OPTIONS

56 palettes as proportions (one ground, one ink, one accent, optional full-bleed fields), not just colours. Choose by tag and by the subject's own material; if the client has brand colours, those win. Map to tokens: bg -> `--background`, ink -> `--foreground`, surface -> `--card`/`--muted`, muted -> `--muted-foreground`, accent -> `--primary`/`--accent`, accentInk -> `--primary-foreground`. MEASURE contrast of every pair you use; the values here are not guaranteed to pass AA (notably `muted` and some accents).


| id | name | tags | bg | surface | ink | muted | accent | accentInk | fields (bg/ink) |
|---|---|---|---|---|---|---|---|---|---|
| `white-link-blue` | Sheet and biro | light-neutral, mono-accent | #ffffff | #f4f4f4 | #111111 | #6b6b6b | #1a4be0 | #ffffff | #111111/#ffffff |
| `cool-white-slate` | Frost and slate | light-neutral | #f7f9fa | #ecf0f2 | #1f3038 | #5d6b72 | #0d7480 | #ffffff |  |
| `rose-grey-green` | Rose grey, green | light-neutral | #ebe5e3 | #e1dad7 | #2b2622 | #6a615d | #0f7d45 | #ffffff |  |
| `paper-grey-brass` | Newsprint and brass | light-neutral | #e8e8e3 | #dcdcd6 | #181715 | #63625c | #bfb21a | #181715 | #181715/#e8e8e3 |
| `stone-blueprint` | Stone and blueprint | light-neutral | #dfdedb | #d3d2ce | #26251e | #5f5d55 | #2456d6 | #ffffff |  |
| `white-navy-tab` | Navy on white | light-neutral, photographic-neutral | #ffffff | #f4f4f2 | #1f2b4d | #6a7186 | #f7941d | #1f2b4d | #05070a/#ffffff ; #e3e1dc/#1f2b4d |
| `three-stones` | Three stones | light-neutral, photographic-neutral | #eeecea | #e4e1dd | #333231 | #6b6763 | #5c6b54 | #ffffff | #cdc3b6/#333231 |
| `putty-black-teal` | Putty and black | light-neutral, photographic-neutral | #dedad3 | #d3cec6 | #0a0a0a | #5c5852 | #256f82 | #ffffff |  |
| `moss-sand` | Sand and moss | light-neutral, earth | #ddd6c6 | #d2cab8 | #2a2a26 | #59574e | #4f6238 | #ffffff | #3f5a2a/#ffffff |
| `green-mat-chocolate` | Bone, green, chocolate | light-neutral, earth | #e5e1d8 | #dad5ca | #2a1d17 | #6b5b51 | #456f3a | #ffffff | #456f3a/#ffffff |
| `lunar-grey-bronze` | Lunar and bronze | dark-neutral | #111111 | #1c1c1c | #f2f2f2 | #8f8f8f | #a08672 | #111111 |  |
| `blue-black-cornflower` | Night and cornflower | dark-neutral | #0a0d14 | #131824 | #e9edf3 | #8891a1 | #5a9bfc | #0a0d14 |  |
| `green-black-bone` | Green-black and bone | dark-neutral, earth | #161c1a | #1f2725 | #e3e2da | #8e948d | #9fc7b8 | #161c1a |  |
| `black-crimson` | Black and crimson | dark-neutral, mono-accent | #0a0a0a | #151515 | #efefef | #8c8c8c | #b11226 | #ffffff | #efefef/#0a0a0a |
| `forest-pale-lime` | Forest and lime | dark-neutral, earth | #0f1f10 | #162a17 | #ffffff | #9aa39a | #c6f19d | #0f1f10 | #000000/#ffffff ; #ffffff/#0f1f10 |
| `charcoal-room-sage` | Charcoal and sage | dark-neutral, photographic-neutral | #1c1c1c | #262626 | #f1f1ef | #9a9b96 | #8fa68e | #1c1c1c | #c8c5ba/#1c1c1c |
| `warm-black-gold` | Warm black, gold | dark-neutral, photographic-neutral | #0c0a08 | #181512 | #ffffff | #8f8a84 | #c9a45a | #0c0a08 |  |
| `graphite-safety-orange` | Graphite and orange | mono-accent, dark-neutral | #18191b | #222427 | #eff0f1 | #9c9ea3 | #ff4a1f | #18191b | #eff0f1/#18191b |
| `soot-pale-lime` | Soot and lime | mono-accent, dark-neutral | #0f0f0f | #1a1a1a | #ffffff | #8f8f8f | #dafa9c | #0f0f0f | #ffffff/#0f0f0f ; #dafa9c/#0f0f0f |
| `plum-black-pink` | Plum-black and pink | mono-accent, dark-neutral | #0d060b | #1b0e17 | #ffffff | #9a8f97 | #ff488b | #0d060b | #470c35/#ffffff ; #ffffff/#101421 |
| `white-signal-red` | Signal red, white | mono-accent | #ffffff | #f2f2f2 | #0a0a0a | #6b6b6b | #d92b21 | #ffffff | #000000/#ffffff |
| `white-mint-tiles` | Greys and mint | mono-accent | #ffffff | #f3f3f3 | #232323 | #6e6e6e | #a1ffcb | #232323 | #a1ffcb/#232323 ; #232323/#ffffff |
| `cool-grey-cobalt` | Cool grey, cobalt | mono-accent | #eef0f3 | #e2e5ea | #0b0c0e | #5d6470 | #1f2de6 | #ffffff | #1f2de6/#ffffff |
| `offwhite-bottle-yellow` | Bottle ink, yellow | mono-accent | #f7f7f7 | #ebebeb | #0d2a1c | #5f6b64 | #f6e016 | #0d2a1c | #f6e016/#0d2a1c |
| `teal-on-paper` | Teal on paper | two-tone | #f7f9f8 | #ebf0ee | #06525c | #2f737d | #06525c | #f7f9f8 | #06525c/#f7f9f8 |
| `navy-pink` | Navy and pink | two-tone, single-field | #1a2039 | #212846 | #f9a3c0 | #b9879c | #f9a3c0 | #1a2039 |  |
| `blush-aubergine` | Blush and aubergine | two-tone | #edccbe | #e8c2b2 | #351a2b | #6c4857 | #351a2b | #edccbe | #351a2b/#edccbe |
| `cobalt-on-sand` | Cobalt on sand | two-tone | #e6dbc7 | #ddd0b9 | #062b8a | #3a5aa8 | #062b8a | #e6dbc7 |  |
| `oxblood-grey` | Oxblood and grey | two-tone | #e2e2e2 | #d6d6d6 | #7d0c14 | #7a4a4e | #7d0c14 | #e2e2e2 | #7d0c14/#e2e2e2 |
| `olive-on-bone` | Olive on bone | two-tone, earth | #ecebe7 | #e1dfd9 | #38450f | #5d683a | #38450f | #ecebe7 | #38450f/#ecebe7 |
| `burgundy-bubblegum` | Burgundy and bubblegum | two-tone | #3d0012 | #4d0519 | #ff99d3 | #c77aa0 | #ff99d3 | #3d0012 |  |
| `bottle-green-gold` | Bottle green, gold | two-tone, earth | #133621 | #1a4429 | #f4d96c | #b3a55e | #f4d96c | #133621 |  |
| `cobalt-field` | Cobalt field | single-field | #0034eb | #002fd6 | #ffffff | #c5d0ff | #e9e34a | #111111 |  |
| `mustard-field` | Mustard and black | single-field | #e1ac10 | #cd9d0f | #0b0b0b | #4d3d0a | #24338f | #ffffff |  |
| `carmine-field` | Carmine field | single-field | #9c1220 | #8a101c | #ffffff | #f0b9bd | #ffd9dc | #9c1220 | #2a2a2a/#ffffff |
| `pink-field-lime` | Bubblegum and lime | single-field | #ff87ab | #ff739d | #0a0a0a | #6b1f3a | #def915 | #0a0a0a | #0a0a0a/#ff87ab |
| `sky-field-navy` | Sky and navy | single-field | #6bb4ee | #7dbdf0 | #0e1822 | #1b3d5c | #ff5a1f | #0e1822 | #ffffff/#0e1822 ; #0e1822/#ffffff |
| `orange-field-black` | Orange and black | single-field, two-tone | #ff7a1f | #ff8633 | #050f16 | #5a2306 | #050f16 | #ff7a1f | #ffffff/#050f16 |
| `tobacco-olive` | Tobacco and olive | single-field, earth | #472913 | #55321a | #e4e0cf | #b39f84 | #525e1b | #e4e0cf | #c79a3e/#2b170a ; #525e1b/#e4e0cf |
| `poster-chapters` | Poster chapters | flat-loud | #e6e0d2 | #dcd5c5 | #1a1a1a | #5f5b52 | #18bc42 | #1a1a1a | #ed4b44/#0f0f0f ; #1a1a1a/#e6e0d2 ; #18bc42/#1a1a1a ; #f2c21a/#1a1a1a ; #e6e0d2/#1a1a1a |
| `blue-red-black` | Blue, red, black | flat-loud | #ffffff | #f3f3f3 | #0a0a0a | #6b6b6b | #2436ff | #ffffff | #2436ff/#ffffff ; #ff3b1f/#0a0a0a ; #0a0a0a/#ffffff ; #050a5c/#ffffff |
| `charcoal-primaries` | Charcoal and primaries | flat-loud | #191919 | #242424 | #ffffff | #9a9a9a | #0c7866 | #ffffff | #d71e1e/#ffffff ; #1e4bd7/#ffffff ; #0c7866/#ffffff ; #ffe927/#111111 |
| `ultramarine-yellow` | Ultramarine and yellow | flat-loud | #1423b8 | #1220a6 | #ffffff | #b4bcf0 | #1fc27a | #0a0a0a | #1423b8/#ffffff ; #000000/#ffffff ; #f7dd47/#000000 ; #e9479f/#000000 |
| `candy-chapters` | Candy chapters | flat-loud | #ffd249 | #f5c63c | #0a0a0a | #5e4a0a | #f53fd6 | #0a0a0a | #ffd249/#0a0a0a ; #ffffff/#0a0a0a ; #ffc4ef/#0a0a0a ; #a4f6f8/#0a0a0a ; #f9a21f/#0a0a0a |
| `orange-sky-lime` | Orange, sky, lime | flat-loud | #ff8126 | #ff8d3a | #111111 | #5c2a05 | #de194b | #ffffff | #ff8126/#111111 ; #4db3ff/#111111 ; #c5f53d/#111111 ; #161615/#f2f2f2 |
| `post-red-mustard` | Post red, mustard | flat-loud | #e2dccf | #d7d0c1 | #2a1110 | #6b524c | #4a6f84 | #ffffff | #dc1928/#ffffff ; #952625/#ffffff ; #e0a912/#2a1110 ; #4a6f84/#ffffff ; #e2dccf/#2a1110 |
| `mint-orange-grey` | Grey, mint, orange | flat-loud | #ffffff | #f5f5f5 | #000000 | #666666 | #a7ff9c | #000000 | #c5c5c5/#000000 ; #a7ff9c/#000000 ; #ff6831/#000000 ; #000000/#ffffff |
| `report-blocks` | Report blocks | flat-loud | #ffffff | #f6f6f6 | #000000 | #5f5f5f | #fe7141 | #000000 | #fe7141/#000000 ; #d1ddd3/#000000 ; #f0ff1c/#000000 ; #000000/#f4f4f4 |
| `card-pastels` | Card pastels | pastel-fields | #f7f7f5 | #ebebe8 | #000000 | #666662 | #d0106f | #ffffff | #97aaf6/#000000 ; #bbf697/#000000 ; #fed878/#000000 ; #6ef8fb/#000000 |
| `mint-pink-accounts` | Mint and pink | pastel-fields | #f8f8f8 | #eeeeee | #0a0a0a | #6a6a6a | #1f6b3a | #ffffff | #c3edce/#0a0a0a ; #f8c7c9/#0a0a0a ; #ffffff/#0a0a0a |
| `swap-pastels` | Swapping pastels | pastel-fields | #c3cbe5 | #d0d6eb | #141414 | #4a5068 | #0f5257 | #ffffff | #c3cbe5/#141414 ; #efd3da/#141414 ; #e6dccd/#141414 ; #cfd3cb/#141414 ; #f9cdbd/#141414 |
| `blush-sage-slate` | Blush, sage, slate | pastel-fields, earth | #a6b3bc | #b2bdc5 | #1c1c1c | #38424a | #2c3620 | #e3e2da | #a6b3bc/#1c1c1c ; #b7c8be/#1c1c1c ; #d6c4b8/#1c1c1c ; #2c3620/#e3e2da |
| `candy-on-black` | Candy on black | pastel-fields | #000000 | #0d0d0d | #ffffff | #999999 | #93f1f7 | #000000 | #9ae187/#000000 ; #93f1f7/#000000 ; #f3ea7a/#000000 ; #fbb65c/#000000 ; #b9c8ff/#000000 |
| `sky-sand` | Sky and sand | pastel-fields | #cbe4f2 | #bcdcee | #0a0a0a | #44606e | #b0298f | #ffffff | #cbe4f2/#0a0a0a ; #f1e3b5/#0a0a0a ; #ffc013/#0a0a0a ; #0a0a0a/#f2f2f2 |
| `studio-grey` | Studio grey | photographic-neutral | #a8a8aa | #b4b4b6 | #0e0e0e | #3a3a3c | #1f5c49 | #ffffff | #1b1b1c/#ffffff |
| `walnut-tan` | Walnut and tan | photographic-neutral, earth | #2b2216 | #382d1e | #e4e2da | #a39a8b | #bda38b | #2b2216 | #bda38b/#1c150d |

## Notes per palette

- `white-link-blue`: White holds the whole page with black type, one grey for secondary lines and a pale grey step for tiles and inputs; the footer may invert to black. Blue is the colour of text links and the one button, and nothing else is tinted.
- `cool-white-slate`: Cool white and one paler blue-grey step hold everything, with type in dark slate instead of black. Teal appears once per screen at most, as the primary button or one small detail beside the product photograph.
- `rose-grey-green`: A single rosy grey covers the page from top to bottom with brown-black text and grey secondary lines; images are kept greyscale. Green appears only on the current-page link and on one button in the footer.
- `paper-grey-brass`: Warm paper grey with near-black type holds the upper page, then whole sections flip to near-black with paper-grey type; no section is tinted. Brass yellow marks one small detail per screen, such as the button or a single word.
- `stone-blueprint`: Stone paper carries the whole page with near-black and grey text. One image at a time is printed in the accent blue as its only ink, and the same blue fills the single button.
- `white-navy-tab`: Pure white pages with navy type sit between full-bleed photographs, opening on near-black and closing on a warm grey footer. Tangerine is one small tab or button, never larger than a thumbnail.
- `three-stones`: Three close stone tones share the interface: the lightest for the page, the middle one for panels, the darkest for a single band, all with charcoal type. Saturated colour is left to the photographs and their backdrops; the grey-green fills the button only.
- `putty-black-teal`: Warm putty covers the page and pure black handles all type and the main shapes. The only tint in the interface is teal, used for the one button or a single marker placed near the photographs.
- `moss-sand`: Sand grey holds the page with charcoal type, and one deep leaf-green band may close it. Moss green is reserved for buttons; brighter greens and blues arrive only through photographs.
- `green-mat-chocolate`: Bone ground with chocolate-brown text takes most of the page. The green is spent on one large flat block, about a third of a screen, and on the button; all other colour comes from photographs.
- `lunar-grey-bronze`: Soft black holds the page with panels one step lighter, white text and grey secondary lines, so photographs supply all the colour. Muted bronze goes on small markers and the one button only.
- `blue-black-cornflower`: Blue-black ground and slate panels with silver-white text fill the page; no section changes colour. Cornflower blue marks the buttons and at most one word in a heading.
- `green-black-bone`: Bone type on green-black from top to bottom, with panels and drawn details barely lighter than the ground so photographs supply the colour. Pale jade is for the booking or contact button alone.
- `black-crimson`: Black with off-white text and mid-grey texture takes nearly the whole page, and the last sections may invert to off-white with black type. Deep crimson is scattered sparingly: a few characters in a heading, a slider fill, the one button.
- `forest-pale-lime`: Forest green, black and white sections alternate, with forest green holding the most; photographs stay in moss greens and stone browns. Pale lime sits on small squares only, such as arrow buttons and the closing wordmark.
- `charcoal-room-sage`: Charcoal holds the page with off-white text, and one section may flip to a pale concrete tone with dark text. Colour comes from the photographs; grey sage is used for the single button and the active state of a control.
- `warm-black-gold`: Warm near-black fills the page and photographs sit bright against it, with pure white small type; panels warm to a brown-black. Gold is for one text link or small button per screen, never a field.
- `graphite-safety-orange`: Graphite and cool light-grey sections alternate, graphite taking about two thirds, and photographs are desaturated so nothing competes. Safety orange marks the buttons, one thick solid bar across the top of the page and the highlighted item in a list or chart.
- `soot-pale-lime`: A soot-black opening and close bracket white middle sections, all in black, white and grey. Pale lime is the single action colour: every button, and at most one headline set in it on the dark ground.
- `plum-black-pink`: Near-black and plum at the top and bottom bracket a white middle with navy-black text. Hot pink is reserved for primary buttons, bars in charts and map markers; it never fills a section.
- `white-signal-red`: White ground, black text and paper grey for filled panels, with one full black band allowed. Signal red is the only colour in the interface: one word in a headline, a few solid blocks, or the button.
- `white-mint-tiles`: White, near-black and two greys fill a board of flat tiles. Mint floods a few whole tiles (one statement, one figure, the closing call to action) and appears nowhere else.
- `cool-grey-cobalt`: Cool pale grey holds the page with near-black type and nothing else tinted. Cobalt starts as the button and one highlighted sentence, takes one whole section as a flat field with white text, then returns as a single button block.
- `offwhite-bottle-yellow`: Off-white ground with all type in a near-black bottle green instead of black. Yellow is the only saturated note: the button or one small object on most screens, and one later section that turns fully yellow.
- `teal-on-paper`: Cool white paper and a single teal used for every word, shape and button, with no black anywhere. The accent is that same teal filled solid, for the button and for one inverted band with paper-coloured type.
- `navy-pink`: One navy field runs the entire page. Pink does everything else, from the name and headings to body text, and fills one solid button.
- `blush-aubergine`: Blush pink and dark aubergine alternate as full fields and serve as each other's text colour, in roughly equal shares. There is no third colour: the button is a solid block of whichever of the two is not the ground.
- `cobalt-on-sand`: Sand paper and one cobalt do everything: text, drawings and solid shapes are all the same blue. The button is a cobalt block with sand-coloured type, and no black or second hue is used.
- `oxblood-grey`: Deep red text on grey paper holds most of the page, then pale grey text on a solid red field takes one long section and the footer. Photographs are desaturated so nothing breaks the pair, and the button is a solid red block.
- `olive-on-bone`: A bone page with every word, large or small, in one olive green; the footer inverts to a solid olive field with bone text. Photography supplies all other colour, and the button is the same olive, filled.
- `burgundy-bubblegum`: Deep burgundy is the ground for the whole page and bubblegum pink sets every word on it. The button and the active state of a control are solid pink with burgundy type; product photographs supply any other colour.
- `bottle-green-gold`: Bottle green covers the page and warm gold sets all the type, with panels one step lighter than the ground. The button is solid gold with green text, and photographs are kept dark and warm so the pair is not disturbed.
- `cobalt-field`: One electric cobalt fills everything, with white and pale-blue type; photographs are tinted into blue monotone or kept as small thumbnails. A single yellow dot or button is the only other colour on the page.
- `mustard-field`: One warm mustard field for the whole page with black ink only. Royal blue is the single interruption, kept to a sliver along one edge or one small button.
- `carmine-field`: A deep red field bookends or fills the page, with white type and pale pink secondary lines; work shown in between sits on flat charcoal so it keeps its own colours. The button is a pale pink block with red type.
- `pink-field-lime`: A flat bubblegum pink field with black type from top to bottom. Fluorescent lime is the action colour only: the menu button, one highlighter swipe behind a word and the main button.
- `sky-field-navy`: Sky blue sits behind everything, white cards lie on top of it, and navy handles all text and the footer. Orange is for buttons and one highlighted word, so orange against blue is the single clash on the page.
- `orange-field-black`: Hot orange is the page: one flat field with blue-black type, flipping at a hard horizontal seam to a white section when the content needs a rest. The button is a solid block of the same blue-black with orange text, and every other colour comes from the objects shown.
- `tobacco-olive`: Tobacco brown fills the page with bone type, and photographs stay in browns and ochre. One olive block holds the main text or the button, and a single ochre band may break the brown once.
- `poster-chapters`: Each chapter takes one flat field in turn (coral red, near-black, bone, green, yellow) with black or bone type and no tints between them. Green doubles as the accent for the one button when the ground is bone or black.
- `blue-red-black`: Three flat poster colours each own whole sections: electric blue, red-orange and black, with white for the areas that show the product. No tints sit between them, and blue is the button colour on white.
- `charcoal-primaries`: A charcoal ground holds flat poster primaries assigned to whole panels: red, blue, teal green and yellow, each placed against a different one. Type is white, or black on yellow; teal green is the button colour on charcoal.
- `ultramarine-yellow`: Each section is one flat field in sequence: ultramarine, black, yellow, then ultramarine again, with white type on blue and black, and black type on yellow. Green is the only small accent and never grows larger than a button.
- `candy-chapters`: Each section owns one flat candy colour: yellow first, then white, pink, cyan and orange, with all type in black. Magenta is kept for buttons alone.
- `orange-sky-lime`: The page ground changes as you read: orange first, then sky blue, then acid lime at the end, with one near-black band between; type stays black on all three colours. Crimson is one small button per field.
- `post-red-mustard`: Post red and bone alternate as full section fields, with red holding the opening and the close. Mustard, slate blue and maroon are kept for whole card frames, and slate blue also fills the one button.
- `mint-orange-grey`: Black on white to start, then whole sections flood with flat mid-grey, acid mint and orange in turn. Photographs inside a flooded section are shown in black-and-white, and mint is also the button colour on white and black.
- `report-blocks`: A white base with flat blocks of orange, sage, acid yellow and black assigned to whole modules: figure tiles, quote panels and chapter bands. Text is black on every colour and off-white on black, and orange is also the button colour.
- `card-pastels`: Neutral paper ground and black type, with each card or tile given its own flat pastel (periwinkle, lime, amber or cyan), never two alike side by side. Magenta is reserved for the logo, the email address and text links.
- `mint-pink-accounts`: Near-white base with black type; mint and pink are the only two colours and each stands for one side of the product. They first appear as small circles, then as full-screen section fields, and deep green is used only for the button.
- `swap-pastels`: One flat pastel is the whole background and it swaps per project or chapter: periwinkle, pink, sand, sage, peach. Type and one solid box stay near-black on all five, and dark teal is only for the button.
- `blush-sage-slate`: Slate blue-grey, sage and blush share the page as soft flat blocks, one per chapter or menu tile, with dark type; one deep olive block anchors the close with pale type. Olive is also the button colour, and photographs of sea and sky do the rest.
- `candy-on-black`: Black ground and dark photographs take nearly all of the surface. The only flat colour is a solid block behind each title, which takes a new candy pastel per project (mint, cyan, lemon, orange, cornflower); cyan is the default for the button.
- `sky-sand`: Sky blue and sand yellow are the constant ground, each holding whole sections, with black text throughout. Saturated colour arrives only as small solid objects, and magenta is kept for the contact card and its button.
- `studio-grey`: One mid grey serves as both page and studio backdrop, so the photographed object seems to stand on the page itself; type is black and one black band comes late. Colour comes only from the product, and racing green is for the single button.
- `walnut-tan`: Dark walnut holds the opening and the close with bone type, and the middle of the page may turn to flat tan around honey-lit photographs. There is no bright accent: tan is the fill for the one button on walnut.
