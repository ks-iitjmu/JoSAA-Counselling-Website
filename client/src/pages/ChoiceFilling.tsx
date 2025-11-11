import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { choiceAPI, instituteAPI, seatMatrixAPI } from '../services/api';
import { getCurrentUser, isAuthenticated, isStudent } from '../utils/auth';
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

interface Program {
  ProgramCode: string;
  ProgramName: string;
  TotalSeats: number;
}

const ChoiceFilling = () => {
  const navigate = useNavigate();
  const [candidateId, setCandidateId] = useState<number | null>(null);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');

  useEffect(() => {
    // Check authentication - only students can fill choices
    if (!isAuthenticated() || !isStudent()) {
      alert('Only students can access the choice filling page.');
      navigate('/login');
      return;
    }

    const user = getCurrentUser();
    if (user?.candidateID) {
      setCandidateId(user.candidateID);
    } else {
      alert('Unable to retrieve your candidate information.');
      navigate('/');
      return;
    }

    fetchInstitutes();
  }, [navigate]);

  useEffect(() => {
    if (candidateId) {
      fetchChoices();
    }
  }, [candidateId]);

  const fetchInstitutes = async () => {
    try {
      const response = await instituteAPI.getAll();
      setInstitutes(response.data.data);
    } catch (error) {
      console.error('Error fetching institutes:', error);
    }
  };

  const fetchProgramsByInstitute = async (instituteCode: string) => {
    if (!instituteCode) {
      setPrograms([]);
      return;
    }

    setLoadingPrograms(true);
    try {
      const response = await seatMatrixAPI.getByInstitute(instituteCode);
      // Extract unique programs from seat matrix
      const uniquePrograms = response.data.data.reduce((acc: Program[], curr: any) => {
        const exists = acc.find(p => p.ProgramCode === curr.ProgramCode);
        if (!exists) {
          acc.push({
            ProgramCode: curr.ProgramCode,
            ProgramName: curr.ProgramName,
            TotalSeats: curr.TotalSeats
          });
        }
        return acc;
      }, []);
      setPrograms(uniquePrograms);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setPrograms([]);
    } finally {
      setLoadingPrograms(false);
    }
  };

  const handleInstituteChange = (instituteCode: string) => {
    setSelectedInstitute(instituteCode);
    setSelectedProgram(''); // Reset program selection
    fetchProgramsByInstitute(instituteCode);
  };

  const fetchChoices = async () => {
    if (!candidateId) return;
    
    setLoading(true);
    try {
      const response = await choiceAPI.getByCandidate(candidateId);
      setChoices(response.data.data);
    } catch (error: any) {
      console.error('Error fetching choices:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
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
        CandidateID: candidateId,
        ChoiceNumber: choices.length + 1,
        InstituteCode: selectedInstitute,
        ProgramCode: selectedProgram,
        Lock_Status: false
      });
      
      alert('Choice added successfully!');
      fetchChoices();
      setSelectedInstitute('');
      setSelectedProgram('');
    } catch (error: any) {
      console.error('Error adding choice:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert(error.response?.data?.message || 'Unauthorized access');
        navigate('/login');
      } else {
        alert('Error adding choice. Please try again.');
      }
    }
  };

  const deleteChoice = async (choiceId: number) => {
    if (!confirm('Are you sure you want to delete this choice?')) return;

    try {
      await choiceAPI.delete(choiceId);
      alert('Choice deleted successfully!');
      fetchChoices();
    } catch (error: any) {
      console.error('Error deleting choice:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert(error.response?.data?.message || 'Unauthorized access');
        navigate('/login');
      } else {
        alert('Error deleting choice.');
      }
    }
  };

  const lockChoices = async () => {
    if (!candidateId) return;
    if (!confirm('Are you sure you want to lock your choices? You cannot modify them after locking.')) return;

    try {
      await choiceAPI.lock(candidateId, true);
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
      <p className="page-description">Manage your college and program choices for counselling</p>
      
      {candidateId && (
        <>
          <div className="candidate-info">
            <p><strong>Candidate ID:</strong> {candidateId}</p>
          </div>

          <div className="add-choice-section">
            <h2>Add New Choice</h2>
            <div className="choice-form">
              <select
                value={selectedInstitute}
                onChange={(e) => handleInstituteChange(e.target.value)}
                className="input-field"
              >
                <option value="">Select Institute</option>
                {institutes.map(inst => (
                  <option key={inst.InstituteCode} value={inst.InstituteCode}>
                    {inst.InstituteName}
                  </option>
                ))}
              </select>

              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="input-field"
                disabled={!selectedInstitute || loadingPrograms}
              >
                <option value="">
                  {loadingPrograms ? 'Loading programs...' : 'Select Program'}
                </option>
                {programs.map(prog => (
                  <option key={prog.ProgramCode} value={prog.ProgramCode}>
                    {prog.ProgramName} ({prog.ProgramCode})
                  </option>
                ))}
              </select>

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
