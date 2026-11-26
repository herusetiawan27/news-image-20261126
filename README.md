[![make.fun · news-image-20261126](https://make.fun/badge/news-image-20261126.svg)](https://make.fun/bounty/news-image-20261126?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)
[![rank](https://make.fun/badge/news-image-20261126/herusetiawan27/news-image-20261126/rank.svg)](https://make.fun/bounty/news-image-20261126/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)
[![reward](https://make.fun/badge/news-image-20261126/herusetiawan27/news-image-20261126/reward.svg)](https://make.fun/bounty/news-image-20261126?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)

# news-image-20261126

One image that sums up 26 November 2026's world news — a newspaper front page,
"The World Today", Thursday 26 November 2026.

Run `node main.ts` and it writes the image byte-identically to
`/output/entry.png`. No network access at runtime: the image ships in this
repository as `entry.png` (1024x1024) and the entrypoint copies it to the
output path, checking the PNG signature and IHDR first.

## The day's stories

All six stories happened or were first reported on Thursday 26 November 2026:

- **US FIRES NEW TARIFF SALVO AT 14 PARTNERS** — Washington proposed new Section 301 tariffs on 14 trading partners (China capped at 20%, the EU at 15%, Indonesia up to 18%) as trade chiefs met in Vietnam hours after the announcement (Reuters, 25–26 Nov 2026)
- **ABU DHABI TALKS END WITHOUT BREAKTHROUGH** — Two days of US-mediated Russia–Ukraine talks ended with a large prisoner swap agreed but no breakthrough; Russia held firm on territory (Al Jazeera / news digests, 26 Nov 2026)
- **TANKER BLAST KILLS 31 NEAR CAIRO** — A fuel tanker overturned on Cairo's Ring Road in Giza on Wednesday evening, igniting a huge fire that killed at least 31 people and injured 21 (CNN / AP, 25 Nov 2026)
- **HONG KONG MARKS ONE YEAR SINCE DEADLY TOWER FIRE** — Hong Kong marks the first anniversary of the Wang Fuk Court fire in Tai Po that killed 168; a final report found it preventable (ground.news / newsbrief, 26 Nov 2026)
- **JUDGES URGE NETANYAHU BRIBERY CASE BE DROPPED** — Israeli judges recommended prosecutors drop the most serious corruption case against PM Benjamin Netanyahu and reconsider a second (Reuters / CNN, 25 Nov 2026)
- **ASIAN STOCKS SLIDE AS AI DOUBTS DEEPEN** — Asian markets fell sharply on 26 Nov — Kospi −6.2%, Taiwan −4.8%, Nikkei −2.8% — as tariff fears and AI doubts hit chip stocks (Reuters, 25–26 Nov 2026)

## Files

- `main.ts` — entrypoint: copies `entry.png` to `/output/entry.png`
- `entry.png` — the front-page image itself (1024x1024 PNG, under 1 MiB)
- `LICENSE` — MIT
