import React, { useState, useEffect, useCallback } from 'react';

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [notes, setNotes] = useState([]);
  const [grapeVarieties, setGrapeVarieties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formState, setFormState] = useState({
    grapeVarietyId: '',
    rating: 3,
    vintageYear: new Date().getFullYear(),
    aromas: '',
    notes: ''
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [varietiesRes, notesRes] = await Promise.all([
        manifest.from('GrapeVariety').find({ sort: { name: 'asc' } }),
        manifest.from('TastingNote').find({
          filter: { authorId: user.id },
          include: ['grapeVariety'],
          sort: { createdAt: 'desc' }
        })
      ]);
      setGrapeVarieties(varietiesRes.data);
      setNotes(notesRes.data);
      if (varietiesRes.data.length > 0) {
        setFormState(prev => ({ ...prev, grapeVarietyId: varietiesRes.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Could not load your dashboard. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [manifest, user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formState.grapeVarietyId || !formState.notes) {
      alert('Please select a grape and add some notes.');
      return;
    }
    try {
      const newNote = await manifest.from('TastingNote').create({
        ...formState,
        rating: parseInt(formState.rating, 10),
        vintageYear: parseInt(formState.vintageYear, 10),
      });
      // Refetch all data to get the latest state
      await fetchData(); 
      // Reset form
      setFormState({
        grapeVarietyId: grapeVarieties.length > 0 ? grapeVarieties[0].id : '',
        rating: 3,
        vintageYear: new Date().getFullYear(),
        aromas: '',
        notes: ''
      });
    } catch (err) {
      console.error('Failed to create note:', err);
      alert('Failed to save your note. Please try again.');
    }
  };
  
  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
        try {
            await manifest.from('TastingNote').delete(noteId);
            setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
        } catch (err) {
            console.error('Failed to delete note:', err);
            alert('Could not delete the note. Please try again.');
        }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">GrapeLog</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user.name}!</span>
            <a href="/admin" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Admin Panel</a>
            <button onClick={onLogout} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors">Logout</button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">{error}</div>}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add a Tasting Note</h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="grapeVarietyId" className="block text-sm font-medium text-gray-700">Grape Variety</label>
                  <select id="grapeVarietyId" name="grapeVarietyId" value={formState.grapeVarietyId} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" required>
                    {grapeVarieties.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
                  <input type="number" name="rating" id="rating" min="1" max="5" value={formState.rating} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                </div>
                 <div>
                  <label htmlFor="vintageYear" className="block text-sm font-medium text-gray-700">Vintage Year</label>
                  <input type="number" name="vintageYear" id="vintageYear" value={formState.vintageYear} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="aromas" className="block text-sm font-medium text-gray-700">Aromas</label>
                  <input type="text" name="aromas" id="aromas" value={formState.aromas} onChange={handleInputChange} placeholder="e.g., Cherry, vanilla, oak" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Tasting Notes</label>
                  <textarea name="notes" id="notes" rows="4" value={formState.notes} onChange={handleInputChange} placeholder="Describe the taste, texture, and finish." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required></textarea>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-semibold">Add Note</button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">My Tasting Journal</h2>
              {isLoading ? (
                <p className="text-gray-500">Loading notes...</p>
              ) : notes.length === 0 ? (
                <p className="text-gray-500">You haven't added any notes yet. Use the form to add your first one!</p>
              ) : (
                <ul className="space-y-4">
                  {notes.map(note => (
                    <li key={note.id} className="border border-gray-200 rounded-lg p-4 relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-indigo-700">{note.grapeVariety?.name || 'Unknown Variety'}</h3>
                          <p className="text-sm text-gray-500">Vintage: {note.vintageYear} | Rating: {'⭐'.repeat(note.rating)}</p>
                          {note.aromas && <p className="text-sm mt-1 text-gray-600"><strong>Aromas:</strong> {note.aromas}</p>}
                          <p className="text-sm mt-2 text-gray-800">{note.notes}</p>
                        </div>
                         <button onClick={() => handleDeleteNote(note.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full absolute top-2 right-2">
                            <svg xmlns=\"http://www.w3.org/2000/svg\" className=\"h-5 w-5\" viewBox=\"0 0 20 20\" fill=\"currentColor\"><path fillRule=\"evenodd\" d=\"M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z\" clipRule=\"evenodd\" /></svg>
                         </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
