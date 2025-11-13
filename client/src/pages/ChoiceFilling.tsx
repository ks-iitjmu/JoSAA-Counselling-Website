import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  choiceAPI, 
  instituteAPI, 
  seatMatrixAPI, 
  candidateAPI, 
  allocationAPI, 
  counsellingRoundAPI 
} from '../services/api';
import { getCurrentUser, isAuthenticated, isStudent, isAdmin } from '../utils/auth';
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
  Degree_Type?: string;
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

interface Candidate {
  CandidateID: number;
  Name: string;
  Email: string;
  Phone: string;
  JEE_Mains_AIR: number;
  Category: string;
}

interface Allocation {
  AllocationID?: number;
  CandidateID: number;
  RoundID: number;
  AllocatedInstituteCode: string;
  AllocatedProgramCode: string;
  Action: string;
  Fee_Payment_Status: string;
  InstituteName?: string;
  ProgramName?: string;
}

interface Round {
  RoundID: number;
  StartDate: string;
  EndDate: string;
}

const ChoiceFilling = () => {
  const navigate = useNavigate();
  
  // Student-specific state
  const [candidateId, setCandidateId] = useState<number | null>(null);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');

  // Admin-specific state
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [allocationForm, setAllocationForm] = useState<Allocation>({
    CandidateID: 0,
    RoundID: 1,
    AllocatedInstituteCode: '',
    AllocatedProgramCode: '',
    Action: 'Allotted',
    Fee_Payment_Status: 'Pending'
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Please login to access this page.');
      navigate('/login');
      return;
    }

    if (isStudent()) {
      // Student initialization
      const user = getCurrentUser();
      if (user?.candidateID) {
        setCandidateId(user.candidateID);
      } else {
        alert('Unable to retrieve your candidate information.');
        navigate('/');
        return;
      }
      fetchInstitutes();
    } else if (isAdmin()) {
      // Admin initialization
      fetchAllCandidates();
      fetchRounds();
    } else {
      alert('Access denied.');
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (candidateId && isStudent()) {
      fetchChoices();
    }
  }, [candidateId]);

  // Student functions
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
    setSelectedProgram('');
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

  // Admin functions
  const fetchAllCandidates = async () => {
    try {
      setLoading(true);
      const response = await candidateAPI.getAll();
      setCandidates(response.data.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRounds = async () => {
    try {
      const response = await counsellingRoundAPI.getAll();
      setRounds(response.data.data);
    } catch (error) {
      console.error('Error fetching rounds:', error);
    }
  };

  const handleCandidateSelect = async (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setCandidateId(candidate.CandidateID);
    
    try {
      const [choicesRes, allocationsRes] = await Promise.all([
        choiceAPI.getByCandidate(candidate.CandidateID),
        allocationAPI.getByCandidate(candidate.CandidateID)
      ]);
      
      setChoices(choicesRes.data.data || []);
      setAllocations(allocationsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching candidate data:', error);
    }
  };

  const handleAllocateChoice = (choice: Choice) => {
    if (!selectedCandidate) return;
    
    setSelectedChoice(choice);
    setAllocationForm({
      CandidateID: selectedCandidate.CandidateID,
      RoundID: rounds.length > 0 ? rounds[0].RoundID : 1,
      AllocatedInstituteCode: choice.InstituteCode,
      AllocatedProgramCode: choice.ProgramCode,
      Action: 'Allotted',
      Fee_Payment_Status: 'Pending'
    });
    setShowAllocationModal(true);
  };

  const handleCreateAllocation = async () => {
    try {
      const response = await allocationAPI.create(allocationForm);
      if (response.data.success) {
        alert('Allocation created successfully!');
        setShowAllocationModal(false);
        setSelectedChoice(null);
        if (selectedCandidate) {
          handleCandidateSelect(selectedCandidate);
        }
      }
    } catch (error: any) {
      console.error('Error creating allocation:', error);
      alert(error.response?.data?.message || 'Failed to create allocation');
    }
  };

  const handleUpdateAllocation = async (allocationId: number, updates: any) => {
    try {
      const response = await allocationAPI.update(allocationId, updates);
      if (response.data.success) {
        alert('Allocation updated successfully!');
        if (selectedCandidate) {
          handleCandidateSelect(selectedCandidate);
        }
      }
    } catch (error: any) {
      console.error('Error updating allocation:', error);
      alert(error.response?.data?.message || 'Failed to update allocation');
    }
  };

  const handleDeleteAllocation = async (allocationId: number) => {
    if (!confirm('Are you sure you want to delete this allocation?')) return;

    try {
      const response = await allocationAPI.delete(allocationId);
      if (response.data.success) {
        alert('Allocation deleted successfully!');
        if (selectedCandidate) {
          handleCandidateSelect(selectedCandidate);
        }
      }
    } catch (error: any) {
      console.error('Error deleting allocation:', error);
      alert(error.response?.data?.message || 'Failed to delete allocation');
    }
  };

  const filteredCandidates = candidates.filter(c =>
    c.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.CandidateID.toString().includes(searchTerm) ||
    c.JEE_Mains_AIR.toString().includes(searchTerm)
  );

  // Render student view
  if (isStudent()) {
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
  }

  // Render admin view
  return (
    <div className="choice-filling-page admin-view">
      <h1>Choice Filling & Allocation Management</h1>
      <p className="page-description">View candidate choices and manage seat allocations</p>

      <div className="admin-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search candidates by name, ID, or rank..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="results-count">
          Showing {filteredCandidates.length} of {candidates.length} candidates
        </div>
      </div>

      <div className="candidates-grid">
        {loading ? (
          <div className="loading">Loading candidates...</div>
        ) : (
          filteredCandidates.map(candidate => (
            <div
              key={candidate.CandidateID}
              className={`candidate-card ${selectedCandidate?.CandidateID === candidate.CandidateID ? 'selected' : ''}`}
              onClick={() => handleCandidateSelect(candidate)}
            >
              <div className="candidate-header">
                <h3>{candidate.Name}</h3>
                <span className="candidate-id">ID: {candidate.CandidateID}</span>
              </div>
              <div className="candidate-meta">
                <span className="badge">AIR: {candidate.JEE_Mains_AIR}</span>
                <span className="badge">{candidate.Category}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedCandidate && (
        <div className="candidate-details-section">
          <div className="section-header">
            <h2>{selectedCandidate.Name}'s Choices & Allocations</h2>
            <div className="candidate-info-bar">
              <span>AIR: {selectedCandidate.JEE_Mains_AIR}</span>
              <span>Category: {selectedCandidate.Category}</span>
              <span>Email: {selectedCandidate.Email}</span>
            </div>
          </div>

          <div className="data-section">
            <h3>Choice List ({choices.length})</h3>
            {choices.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Priority</th>
                    <th>Institute</th>
                    <th>Program</th>
                    <th>Degree</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {choices.map((choice, index) => (
                    <tr key={choice.ChoiceID}>
                      <td className="priority">#{index + 1}</td>
                      <td>{choice.InstituteName}</td>
                      <td>{choice.ProgramName}</td>
                      <td>{choice.Degree_Type || 'N/A'}</td>
                      <td>
                        {choice.Lock_Status ? (
                          <span className="badge locked">🔒 Locked</span>
                        ) : (
                          <span className="badge unlocked">🔓 Unlocked</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-small"
                          onClick={() => handleAllocateChoice(choice)}
                        >
                          Allocate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">No choices filled by this candidate</div>
            )}
          </div>

          <div className="data-section">
            <h3>Current Allocations ({allocations.length})</h3>
            {allocations.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Institute</th>
                    <th>Program</th>
                    <th>Round</th>
                    <th>Action</th>
                    <th>Fee Status</th>
                    <th>Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map(allocation => (
                    <tr key={allocation.AllocationID}>
                      <td>{allocation.AllocationID}</td>
                      <td>{allocation.InstituteName}</td>
                      <td>{allocation.ProgramName}</td>
                      <td>Round {allocation.RoundID}</td>
                      <td>
                        <select
                          value={allocation.Action}
                          onChange={(e) => allocation.AllocationID && handleUpdateAllocation(allocation.AllocationID, { Action: e.target.value })}
                          className="select-small"
                        >
                          <option value="Allotted">Allotted</option>
                          <option value="Upgraded">Upgraded</option>
                          <option value="Retained">Retained</option>
                          <option value="Withdrawn">Withdrawn</option>
                        </select>
                      </td>
                      <td>
                        <select
                          value={allocation.Fee_Payment_Status}
                          onChange={(e) => allocation.AllocationID && handleUpdateAllocation(allocation.AllocationID, { Fee_Payment_Status: e.target.value })}
                          className="select-small"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Not Required">Not Required</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-small"
                          onClick={() => allocation.AllocationID && handleDeleteAllocation(allocation.AllocationID)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">No allocations found for this candidate</div>
            )}
          </div>
        </div>
      )}

      {showAllocationModal && selectedChoice && (
        <div className="modal-overlay" onClick={() => setShowAllocationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Allocation</h2>
              <button className="close-btn" onClick={() => setShowAllocationModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="allocation-info">
                <p><strong>Candidate:</strong> {selectedCandidate?.Name}</p>
                <p><strong>AIR:</strong> {selectedCandidate?.JEE_Mains_AIR}</p>
                <p><strong>Institute:</strong> {selectedChoice.InstituteName}</p>
                <p><strong>Program:</strong> {selectedChoice.ProgramName}</p>
              </div>

              <div className="form-group">
                <label>Counselling Round:</label>
                <select
                  value={allocationForm.RoundID}
                  onChange={(e) => setAllocationForm({ ...allocationForm, RoundID: parseInt(e.target.value) })}
                  className="input-field"
                >
                  {rounds.map(round => (
                    <option key={round.RoundID} value={round.RoundID}>
                      Round {round.RoundID} - {new Date(round.StartDate).toLocaleDateString()} to {new Date(round.EndDate).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Action:</label>
                <select
                  value={allocationForm.Action}
                  onChange={(e) => setAllocationForm({ ...allocationForm, Action: e.target.value })}
                  className="input-field"
                >
                  <option value="Allotted">Allotted</option>
                  <option value="Upgraded">Upgraded</option>
                  <option value="Retained">Retained</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fee Payment Status:</label>
                <select
                  value={allocationForm.Fee_Payment_Status}
                  onChange={(e) => setAllocationForm({ ...allocationForm, Fee_Payment_Status: e.target.value })}
                  className="input-field"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Not Required">Not Required</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAllocationModal(false)}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleCreateAllocation}>
                Create Allocation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChoiceFilling;
