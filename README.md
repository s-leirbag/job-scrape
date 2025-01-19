# Job Scraper

Web scraper for [Bunsly's Job Spy job aggregator](https://www.bunsly.com/demo/jobspy)

## How to Use
1. Install dependencies using pnpm
```
pnpm i
```

2. Set environment variables for the search query, locations, job boards, and output type. It searches for each pair of a search query and location.
```
SEARCH_QUERIES=software engineer,junior software engineer
LOCATIONS=Boston MA,Wyoming,The Milky Way
SITES=indeed,glassdoor,zip_recruiter
FILE_TYPE=excel
```

3. Run `pnpm start` or `node index.js`
