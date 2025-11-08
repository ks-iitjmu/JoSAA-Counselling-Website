import { useEffect, useState } from 'react';
import { choiceAPI, instituteAPI } from '../services/api';
import './ChoiceFilling.css';

interface Choice {
  ChoiceID: number;
  CandidateID: number;
  ChoiceNumber: number;
  InstituteCode: string;
  ProgramCode: string;
  InstituteName: string;
  ProgramName: string;
  Lock_Status: boolean;
}

interface Institute {
  InstituteCode: string;
  InstituteName: string;
}

const ChoiceFilling = () => {
  const [candidateId, setCandidateId] = useState('');
  const [choices, setChoices] = useState<Choice[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    try {
      const response = await instituteAPI.getAll();
      setInstitutes(response.data.data);
    } catch (error) {
      console.error('Error fetching institutes:', error);
    }
  };

  const fetchChoices = async () => {
    if (!candidateId) return;
    
    setLoading(true);
    try {
      const response = await choiceAPI.getByCandidate(parseInt(candidateId));
      setChoices(response.data.data);
    } catch (error) {
      console.error('Error fetching choices:', error);
      alert('Error fetching choices. Please check candidate ID.');
    } finally {
      setLoading(false);
    }
  };

  const addChoice = async () => {
    if (!candidateId || !selectedInstitute || !selectedProgram) {
      alert('Please fill all fields');
      return;
    }

    try {
      await choiceAPI.add({
        CandidateID: parseInt(candidateId),
        ChoiceNumber: choices.length + 1,
        InstituteCode: selectedInstitute,
        ProgramCode: selectedProgram,
        Lock_Status: false
      });
      
      alert('Choice added successfully!');
      fetchChoices();
      setSelectedInstitute('');
      setSelectedProgram('');
    } catch (error) {
      console.error('Error adding choice:', error);
      alert('Error adding choice. Please try again.');
    }
  };

  const deleteChoice = async (choiceId: number) => {
    if (!confirm('Are you sure you want to delete this choice?')) return;

    try {
      await choiceAPI.delete(choiceId);
      alert('Choice deleted successfully!');
      fetchChoices();
    } catch (error) {
      console.error('Error deleting choice:', error);
      alert('Error deleting choice.');
    }
  };

  const lockChoices = async () => {
    if (!candidateId) return;
    if (!confirm('Are you sure you want to lock your choices? You cannot modify them after locking.')) return;

    try {
      await choiceAPI.lock(parseInt(candidateId), true);
      alert('Choices locked successfully!');
      fetchChoices();
    } catch (error) {
      console.error('Error locking choices:', error);
      alert('Error locking choices.');
    }
  };

  return (
    <div className="choice-filling-page">
      <h1>Choice Filling</h1>
      
      <div className="candidate-section">
        <input
          type="number"
          placeholder="Enter Candidate ID"
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value)}
          className="input-field"
        />
        <button onClick={fetchChoices} className="btn btn-primary">
          Load Choices
        </button>
      </div>

      {candidateId && (
        <>
          <div className="add-choice-section">
            <h2>Add New Choice</h2>
            <div className="choice-form">
              <select
                value={selectedInstitute}
                onChange={(e) => setSelectedInstitute(e.target.value)}
                className="input-field"
              >
                <option value="">Select Institute</option>
                {institutes.map(inst => (
                  <option key={inst.InstituteCode} value={inst.InstituteCode}>
                    {inst.InstituteName}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Enter Program Code (e.g., CSE, ECE, ME)"
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="input-field"
              />

              <button onClick={addChoice} className="btn btn-success">
                Add Choice
              </button>
            </div>
          </div>

          <div className="choices-section">
            <div className="choices-header">
              <h2>Your Choices ({choices.length})</h2>
              {choices.length > 0 && !choices[0]?.Lock_Status && (
                <button onClick={lockChoices} className="btn btn-warning">
                  Lock Choices
                </button>
              )}
            </div>

            {loading ? (
              <div className="loading">Loading choices...</div>
            ) : choices.length === 0 ? (
              <div className="no-choices">No choices added yet. Add your first choice above!</div>
            ) : (
              <div className="choices-list">
                {choices.map((choice, index) => (
                  <div key={choice.ChoiceID} className="choice-item">
                    <div className="choice-number">{index + 1}</div>
                    <div className="choice-details">
                      <h3>{choice.InstituteName}</h3>
                      <p>{choice.ProgramName} ({choice.ProgramCode})</p>
                    </div>
                    {!choice.Lock_Status && (
                      <button 
                        onClick={() => deleteChoice(choice.ChoiceID)} 
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    )}
                    {choice.Lock_Status && (
                      <span className="locked-badge">🔒 Locked</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChoiceFilling;
