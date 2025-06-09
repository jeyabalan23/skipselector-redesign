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
        // Add placeholder images if not included in API
        const skipsWithImages = (data.data || data || []).map((skip) => ({
          ...skip,
          image: skip.image || `/images/skips/${(skip.slug || skip.name || 'default').toLowerCase().replace(/\s+/g, '-')}.jpg`,
        }));
        setSkips(skipsWithImages);
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
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Skips in {area}</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {skips.map((skip) => (
          <div
            key={skip.id || skip.slug || JSON.stringify(skip)}
            onClick={() => setSelectedSkip(skip)}
            className={`border rounded-xl p-4 cursor-pointer shadow hover:shadow-lg transition bg-white ${
              selectedSkip === skip ? 'ring-2 ring-green-400' : ''
            }`}
          >
            <img
              src={skip.image}
              alt={skip.name || 'Skip'}
              className="w-full h-40 object-cover rounded-md mb-3"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/skips/default.jpg';
              }}
            />
            <h2 className="text-xl font-semibold">{skip.name || skip.title || "Unnamed Skip"}</h2>
            <p className="text-gray-600 text-sm mt-1">
              £{skip.price !== undefined ? skip.price : skip.cost || "N/A"}
            </p>
          </div>
        ))}
      </div>

      {selectedSkip && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow text-center border">
          <h3 className="text-lg font-bold mb-2">Selected Skip</h3>
          <img
            src={selectedSkip.image}
            alt="Selected Skip"
            className="mx-auto mb-3 w-60 h-40 object-cover rounded-md"
          />
          <pre className="text-left text-xs bg-gray-100 p-3 rounded overflow-auto max-h-80">
            {JSON.stringify(selectedSkip, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SkipSelector;
