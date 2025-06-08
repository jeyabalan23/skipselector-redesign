import React, { useEffect, useState } from "react";
import axios from "axios";

const SkipSelector = () => {
  const [skips, setSkips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkips = async () => {
      try {
        const response = await axios.get(
          "https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft"
        );
        setSkips(response.data.skips);
      } catch (err) {
        setError("Failed to load skips.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkips();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading skips...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Choose Your Skip</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skips.map((skip) => (
          <div
            key={skip.id}
            className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between"
          >
            <img
              src={skip.imageUrl || "https://via.placeholder.com/300x200"}
              alt={skip.name}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold">{skip.name}</h2>
            <p className="text-gray-600 mt-2 mb-4 text-sm">
              {skip.description || "No description available."}
            </p>
            <div className="flex justify-between items-center mt-auto">
              <span className="text-lg font-bold text-green-700">
                £{skip.price.toFixed(2)}
              </span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Select
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkipSelector;
