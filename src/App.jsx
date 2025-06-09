// src/components/SkipSelector.jsx
import React, { useEffect, useState } from 'react';

const SkipSelector = () => {
  const [skips, setSkips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkip, setSelectedSkip] = useState(null);
  const [error, setError] = useState(null);

  const postcode = 'NR32';
  const area = 'Lowestoft';

  useEffect(() => {
    const fetchSkips = async () => {
      try {
        const res = await fetch(
          `https://app.wewantwaste.co.uk/api/skips/by-location?postcode=${postcode}&area=${area}`
        );
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        console.log('Raw API response:', data);
        // assume data.data or fallback to data itself
        setSkips(data.data || data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSkips();
  }, [postcode, area]);

  if (loading) return <div className="text-center py-10">Loading skips for {area}...</div>;
  if (error) return <div className="text-center text-red-500 py-10">Error: {error}</div>;

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Skips in {area}</h1>

      <div className="grid grid-cols-1 gap-4">
        {skips.map((skip) => (
          <div
            key={skip.id || skip.slug || JSON.stringify(skip)}
            onClick={() => setSelectedSkip(skip)}
            className={`border rounded-xl p-4 cursor-pointer shadow hover:shadow-lg transition ${
              selectedSkip === skip ? 'bg-green-200' : 'bg-white'
            }`}
          >
            {/* Fallback to skip.name or skip.title, etc. */}
            <h2 className="text-xl font-semibold">{skip.name || skip.title || "Unnamed Skip"}</h2>
            <p className="text-gray-600">£{skip.price !== undefined ? skip.price : skip.cost || "N/A"}</p>
          </div>
        ))}
      </div>

      {selectedSkip && (
        <div className="mt-6 p-4 bg-white rounded-xl shadow text-center">
          <pre className="text-left text-xs bg-gray-100 p-2 rounded">
            {JSON.stringify(selectedSkip, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SkipSelector;
