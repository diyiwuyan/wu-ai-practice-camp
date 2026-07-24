# Design QA

## Comparison target

- Source visual truth: `/Users/wangxiaoxian/.codex/generated_images/019f7f5f-e604-72a3-8114-5173f1164ea6/exec-d10edb6d-b46c-496d-beab-696700f451df.png`
- Rendered implementation: `http://localhost:4173/`
- Browser-rendered evidence: `/Users/wangxiaoxian/Documents/视频制作/wu-ai-practice-camp/implementation-homepage.png`
- Combined comparison input: `/Users/wangxiaoxian/Documents/视频制作/wu-ai-practice-camp/qa-comparison.png`
- Responsive evidence: `/Users/wangxiaoxian/Documents/视频制作/wu-ai-practice-camp/implementation-mobile.png`

## Capture normalization

- Desktop CSS viewport requested: 1440 x 1024.
- Source pixels: 1487 x 1058.
- Implementation screenshot pixels: 1425 x 1013; the in-app browser capture excludes browser chrome and includes the page scrollbar.
- Mobile CSS viewport requested: 390 x 844.
- Density: browser capture at the default 1x device density; source and implementation were proportionally normalized to a shared 900px comparison height in `qa-comparison.png`.
- State: home page, signed-out, search empty, modal closed, light theme.

## Full-view comparison evidence

The combined comparison places the selected source on the left and the revised implementation on the right. Both preserve the selected direction: warm paper background, orange-book orange as the action color, editorial headline treatment, compact top navigation, practical case feed, Skill recommendations, learner contribution, and a free-plus-paid learning path.

The revised implementation reduces the initial hero height and image scale so the real-case feed enters the first desktop viewport. It keeps the product hierarchy legible rather than reproducing the mock as a flat image, and it remains usable at mobile width.

## Focused region comparison evidence

- Hero: headline hierarchy, orange emphasis, CTA pair, three proof points, and the orange AI workflow illustration were checked against the source. The illustration is a raster asset in `public/assets/hero-community.png`, not a CSS or SVG approximation.
- Case feed and right rail: the first two case cards, Skill recommendation panel, learner contribution panel, and contribution CTA were checked against the source composition. Card imagery is preserved as raster assets in `public/assets/`.
- Mobile: `/implementation-mobile.png` confirms the header wraps into a compact two-row layout, navigation scrolls horizontally, the hero stacks cleanly, and the primary CTA remains visible without horizontal overflow.

## Findings

- No actionable P0, P1, or P2 findings remain.
- [P3] The reference mock is denser above the fold: it shows three case rows and the lower principles strip within the same viewport, while the implementation gives the hero and case cards more breathing room and shows the third case only partially. This is an acceptable content-density choice for the working prototype; if a closer editorial match is needed, reduce `.section-block` spacing and `.case-row` height together.
- Typography uses the local Chinese system fallback stack rather than a bundled custom font. This preserves legibility and avoids adding an external dependency; exact font matching can be revisited when a brand font is selected.

## Comparison history

### Pass 1

- Earlier finding: [P2] the initial hero was too tall and pushed the case feed materially below the first viewport compared with the source.
- Fix: reduced `.hero` min-height and vertical padding, lowered the headline cap, tightened stats spacing, and reduced the hero illustration max width/min-height.
- Post-fix evidence: `/implementation-homepage.png` and `/qa-comparison.png`; the case feed now enters the first viewport and the hierarchy remains intact.

## Primary interactions tested

- Search `发票`: filters to the invoice case and leaves one matching heading visible.
- `立即发布案例`: opens the contribution dialog; `关闭` returns to the page.
- `查看` on a case: opens the case detail dialog; `关闭` returns to the page.
- `WorkBuddy 免费实战课`: opens the course dialog, exposes all 35 chapter entries across four parts, supports chapter selection, and `关闭` returns to the page.
- Browser console error check: no error-level entries returned.
- Production checks: `npm run build` and `npm run test:sites` both passed.

## Latest revision

- Navigation labels were increased to 16px on desktop and kept at 14px for narrower layouts, preserving the compact mobile header.
- The free WorkBuddy course now has a real catalog modal with all 35 chapters from the Feishu second draft, grouped as 01—10, 11—29, 30—33, and 34—35, with learning time, difficulty, chapter introductions, exercises, and expected outputs.
- “开始跟做这门课” now opens a persistent lesson reader instead of closing the modal and returning to the homepage. The reader supports returning to the catalog, previous/next chapter navigation, marking the current chapter complete, and showing course progress.
- Browser check: the reader opened at chapter 01, marking it complete changed the action state and progress, next chapter opened chapter 02, returning to the catalog worked, and no console errors were reported.
- The reader now lazy-loads the full migrated chapter bundle only when a learner starts a chapter, keeping the homepage bundle smaller.
- Full migration check: 35 chapter records, 67 local images, 7 embedded Feishu sheets converted to web tables, and 1 embedded MP4 downloaded locally. No migrated image path is missing.
- Progress and case favorites now persist in local storage across refreshes; opening the course resumes at the first unfinished chapter.
- The course catalog now supports searching by chapter number, title, level, exercise, output, or keyword, with an explicit empty state when nothing matches.
- The lesson reader renders the migrated Markdown body, original local images, converted tables, Prompt code blocks, and the preserved chapter video instead of only showing a summary card.
- Paid course cards now open real detail panels for Codex 橙皮书, image2 生图训练营, and 大学生求职 AI 课, including audience, duration, syllabus, outputs, and a local interest callback.
- Login and registration now use the same honest local-progress entry point; no placeholder backend success state is shown.

## Implementation Checklist

- [x] Build the selected orange-book visual direction as a working React page.
- [x] Include free WorkBuddy learning, paid advanced-course cards, cases, Skills, knowledge/learning path, and learner contribution entry points.
- [x] Generate and use separate raster assets for the hero and case cards.
- [x] Verify desktop and mobile rendering in the browser.
- [x] Verify primary search, modal, course, and case interactions.
- [x] Run production build and Sites packaging tests.

## Follow-up Polish

- Add real course routes and authenticated progress persistence.
- Add downloadable chapter materials and a dedicated full Skill detail surface.
- Add real routes and backend persistence for paid enrollment, case submissions, Skill details, knowledge pages, comments, and learner progress.
- Connect case, Skill, knowledge, and contribution content to a CMS or database.
- Add the final brand font and replace placeholder community metrics with live data.

final result: passed
