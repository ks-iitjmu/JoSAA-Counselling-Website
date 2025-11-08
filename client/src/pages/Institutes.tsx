import { useEffect, useState } from 'react';
import { instituteAPI } from '../services/api';
import './Institutes.css';

interface Institute {
  InstituteCode: string;
  InstituteName: string;
  InstituteType: string;
  MailingAddress: string;
  Phone: string;
  Website: string;
}

const Institutes = () => {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    try {
      const response = await instituteAPI.getAll();
      setInstitutes(response.data.data);
    } catch (error) {
      console.error('Error fetching institutes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInstitutes = institutes.filter(inst => {
    const matchesSearch = inst.InstituteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inst.InstituteCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || inst.InstituteType === filterType;
    return matchesSearch && matchesType;
  });

  const instituteTypes = ['All', ...Array.from(new Set(institutes.map(i => i.InstituteType)))];

  if (loading) {
    return <div className="loading">Loading institutes...</div>;
  }

  return (
    <div className="institutes-page">
      <h1>Participating Institutes</h1>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Search institutes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          {instituteTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="institutes-count">
        Showing {filteredInstitutes.length} of {institutes.length} institutes
      </div>

      <div className="institutes-grid">
        {filteredInstitutes.map(institute => (
          <div key={institute.InstituteCode} className="institute-card">
            <div className="institute-header">
              <h3>{institute.InstituteName}</h3>
              <span className="institute-type">{institute.InstituteType}</span>
            </div>
            <div className="institute-details">
              <p><strong>Code:</strong> {institute.InstituteCode}</p>
              <p><strong>Address:</strong> {institute.MailingAddress}</p>
              <p><strong>Phone:</strong> {institute.Phone}</p>
              {institute.Website && (
                <p>
                  <strong>Website:</strong>{' '}
                  <a href={institute.Website} target="_blank" rel="noopener noreferrer">
                    {institute.Website}
                  </a>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredInstitutes.length === 0 && (
        <div className="no-results">No institutes found matching your criteria.</div>
      )}
    </div>
  );
};

export default Institutes;
