export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  const kw = req.query.kw || '';
  if (!kw) return res.status(400).json({ error: 'Missing kw param' });

  try {
    const result = await fetch('https://7emj9dp942-dsn.algolia.net/1/indexes/autocomplete_query_prod/query', {
      method: 'POST',
      headers: {
        'x-algolia-agent': 'Algolia for JavaScript (4.8.6); Browser',
        'x-algolia-application-id': '7EMJ9DP942',
        'x-algolia-api-key': 'ad5f6b128a5182b962611d9d11f3c473',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: kw,
        facets: [],
        filters: ''
      }),
    });

    if (!result.ok) {
      return res.status(500).json({ error: 'Algolia response not OK' });
    }

    const data = await result.json();
    const suggestions = data.hits.map(hit => hit.query);

    res.status(200).json({
      keyword: kw,
      foundInSuggestions: suggestions.includes(kw),
      allSuggestions: suggestions,
    });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', details: err.message });
  }
}
