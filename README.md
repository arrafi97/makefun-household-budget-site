# HearthLedger — The Hartono Household Budget

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/arrafi97/makefun-household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/arrafi97/makefun-household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Entry for the make.fun bounty [Make the best household budget site](https://make.fun/bounty/best-household-budget-site-20261126-1457): an original, offline household budget site for the Hartono family, built with plain JavaScript and hand-drawn SVG charts — no libraries, no network.

HearthLedger is the Hartono household's budget book for November 2026: $6,240 of income, 46 real transactions, twelve monthly envelopes, three savings goals and eleven recurring bills — every figure computed from the same transaction list, so the numbers always agree. Six hash-routed pages (Dashboard, Transactions, Budgets, Goals, Bills, Reports), each reached by a link. Every control works: add a transaction, search and filter, mark bills paid, feed a savings goal, and the totals follow at once. The site runs from static files on a desktop and on a phone.

## Run

Serve `app/` and open it in a desktop browser:

    node serve.ts

or open `app/index.html` from any static server. No build step, no network requests.

## Screenshots

`?shot=dashboard|transactions|budgets|phone` stages one deterministic view of the real site (see `shots.json`).

## Hand in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `$MAKEFUN_OUTPUT_DIR` (default `/output`) and writes `dossier.json` with the vendored make.fun library:

    mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

## The household

The Hartonos are a family of four. Maya works at a clinic, Dimas at a logistics firm; together they bring in $6,240 a month. Their system is twelve envelopes — housing, groceries, eating out, transport, utilities, health, kids & school, fun, clothing, home, subscriptions, personal — plus three goals funded first every payday: an emergency fund, a family holiday, and a car down payment. Figures are the household's own records for November 2026, as of the 26th.
